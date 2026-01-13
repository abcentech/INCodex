
import os
import re
from django.core.management.base import BaseCommand
from users.models import User, Customer
from wallet.models import Wallet
from django.db import transaction
import uuid

class Command(BaseCommand):
    help = 'Ingest legacy data from SQL dumps'

    def handle(self, *args, **kwargs):
        base_path = os.path.join(os.getcwd(), 'in_db_backup')
        users_file = os.path.join(base_path, 'users_202502221052.sql')
        
        self.stdout.write("Starting legacy ingestion...")
        
        if not os.path.exists(users_file):
            self.stderr.write(f"File not found: {users_file}")
            return

        self.ingest_users(users_file)
            
        self.stdout.write(self.style.SUCCESS("Ingestion completed successfully."))

    def ingest_users(self, filepath):
        self.stdout.write(f"Processing users from {filepath}")
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Regex to capture: ID, Email, Firstname, Lastname ... Phone 
        # based on observed structure: 
        # ('uuid','email','first','last','short','pass','phone',...)
        # We need to be careful about matching.
        
        # Structure:
        # ('uuid', 'email', 'first', 'last', 'short', 'password', 'phone', bool, ...)
        
        # Pattern components:
        # 1. \('([0-9a-f\-]{36})'  -> UUID
        # 2. ,'([^']+)'             -> Email
        # 3. ,(?:'([^']*)'|NULL)    -> Firstname
        # 4. ,(?:'([^']*)'|NULL)    -> Lastname
        # 5. ,(?:'[^']*'|NULL)      -> ShortID (skip)
        # 6. ,(?:'[^']*'|NULL)      -> Password (skip)
        # 7. ,(?:'([^']*)'|NULL)    -> Phone
        
        user_pattern = re.compile(r"\('([0-9a-f\-]{36})','([^']+)',(?:'([^']*)'|NULL),(?:'([^']*)'|NULL),(?:'[^']*'|NULL),(?:'[^']*'|NULL),(?:'([^']*)'|NULL)")
        
        matches = user_pattern.findall(content)
        count = 0
        skipped = 0
        
        for match in matches:
            uid, email, fname, lname, phone = match
            
            try:
                # Check if user exists
                user = None
                if User.objects.filter(email=email).exists():
                    user = User.objects.get(email=email)
                    if hasattr(user, 'customer'):
                        skipped += 1
                        continue
                    else:
                        self.stdout.write(f"User {email} exists but no customer profile. Creating user_ptr linkage.")
                        # This is tricky with MTI. If we have a User, we want to make it a Customer.
                        # We can't just 'create' Customer with same ID easily if we don't want to duplicate.
                        # Actually Customer table is just `users_customer` with `user_ptr_id`.
                        # So creating Customer with user_ptr=user works.
                
                # Handle Phone Uniqueness
                final_phone = phone
                if not final_phone:
                    final_phone = f"{uid[:8]}"
                
                if len(final_phone) > 15:
                    final_phone = final_phone[:15]
                
                # Logic to handle uniqueness via retry because filtering on EncryptedCharField is not supported/reliable
                
                saved = False
                attempts = 0
                while not saved and attempts < 5:
                    try:
                        # Use atomic block for the save attempt to handle IntegrityError cleanly
                        with transaction.atomic():
                            if not user:
                                # Create Customer directly
                                customer = Customer.objects.create(
                                    id=uid,
                                    email=email,
                                    phone_number=final_phone,
                                    is_legacy_user=True,
                                    is_active=True,
                                    first_name=fname or '',
                                    last_name=lname or '',
                                )
                                user = customer
                                user.set_unusable_password()
                                user.save()
                            else:
                                # User exists, create customer link
                                # If customer exists, we skipped earlier.
                                Customer.objects.create(
                                    user_ptr=user,
                                    first_name=fname or '',
                                    last_name=lname or '',
                                )
                            # Create Wallet
                            Wallet.objects.get_or_create(user=user)
                            saved = True
                            count += 1
                    except Exception as e:
                        # Check if it's an integrity error related to phone
                        if 'unique' in str(e).lower() and 'phone' in str(e).lower():
                            # Conflict on phone, retry with new phone
                            import random
                            suffix = str(random.randint(1000, 9999))
                            final_phone = final_phone[:11] + suffix
                            attempts += 1
                        elif 'unique' in str(e).lower() and 'email' in str(e).lower():
                             # Email conflict (should match above logic but just in case)
                             skipped +=1
                             saved = True # Stop trying
                        else:
                            # Other error
                            raise e

            except Exception as e:
                self.stderr.write(f"Error processing {email}: {e}")
            except Exception as e:
                self.stderr.write(f"Error processing {email}: {e}")
                
        self.stdout.write(f"Imported {count} users. Skipped {skipped}.")
