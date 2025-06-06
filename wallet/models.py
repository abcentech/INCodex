import uuid
from django.db import models, transaction
from django.conf import settings

class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name='wallet',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    balance = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"{self.user.email} wallet"
        return str(self.id)

class Bank(models.Model):
    bank_id = models.CharField(primary_key=True, default='', blank=True, max_length=100)
    bank_code = models.CharField(max_length=10, db_index=True)
    bank_name = models.CharField(max_length=100)

    def __str__(self):
        return self.bank_name

class BankAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='bank_account', on_delete=models.CASCADE)
    account_name = models.CharField(max_length=200)
    account_number = models.CharField(max_length=200)
    bank = models.ForeignKey(Bank, related_name='account', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.account_number}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
        ('INVESTMENT', 'Investment'),
        ('RETURN', 'Return'),
        ('TRANSFER', 'Transfer'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'pending'),
        ('SUCCESS', 'success'),
        ('FAILED', 'failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.DecimalField(max_digits=100, decimal_places=2)
    description = models.TextField()
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    transaction_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    sender_entity = models.CharField(max_length=20, choices=[('WALLET','Wallet'),('PLAN','Plan')], null=True)
    sender_id = models.UUIDField(null=True)
    receiver_entity = models.CharField(max_length=20, choices=[('WALLET','Wallet'),('PLAN','Plan')], null=True)
    receiver_id = models.UUIDField(null=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

@transaction.atomic
def create_transaction(**kwargs):
    sender_wallet = kwargs.pop('sender_wallet', None)
    receiver_wallet = kwargs.pop('receiver_wallet', None)
    if sender_wallet:
        kwargs['sender_entity'] = 'WALLET'
        kwargs['sender_id'] = sender_wallet.id
    if receiver_wallet:
        kwargs['receiver_entity'] = 'WALLET'
        kwargs['receiver_id'] = receiver_wallet.id
    return Transaction.objects.create(**kwargs)

@transaction.atomic
def process_transaction(tx_id):
    tx = Transaction.objects.select_for_update().get(id=tx_id)
    try:
        if tx.sender_entity == 'WALLET' and tx.sender_id:
            sender = Wallet.objects.select_for_update().get(id=tx.sender_id)
            if sender.balance < tx.amount:
                tx.transaction_status = 'FAILED'
                tx.save()
                return False, 'Insufficient funds'
            sender.balance -= tx.amount
            sender.save()
        if tx.receiver_entity == 'WALLET' and tx.receiver_id:
            receiver = Wallet.objects.select_for_update().get(id=tx.receiver_id)
            receiver.balance += tx.amount
            receiver.save()
        tx.transaction_status = 'SUCCESS'
        tx.save()
        return True, 'Success'
    except Exception as exc:
        tx.transaction_status = 'FAILED'
        tx.save()
        return False, str(exc)
