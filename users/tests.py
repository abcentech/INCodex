# users/tests.py
from django.test import TestCase
from django.urls import reverse
# from django.contrib.auth.models import User
from django.core import mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()
class UserRegistrationTests(TestCase):

    def test_registration(self):
        response = self.client.post(reverse('register'), {
            'email': 'testuser@example.com',
            'password1': 'complexpassword123',
            'password2': 'complexpassword123',
            "user_type": "CUSTOMER",
            "phone_number": "09127943109",
            'first_name': "John",
            'middle_name': "Avaricious",
            'last_name': "Doe",
            "date_of_birth": "2024-07-29",
            "gender": "M",
            'state_of_origin': 'Abuja',
            'state_of_residence': 'Abuja',
        })
        self.assertEqual(response.status_code, 201)  # Assuming a redirect after successful registration
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())

    def test_email_verification(self):
        self.client.post(reverse('register'), {
            'email': 'testuser@example.com',
            'password1': 'complexpassword123',
            'password2': 'complexpassword123',
            "user_type": "CUSTOMER",
            "phone_number": "09127943109",
            'first_name': "John",
            'middle_name': "Avaricious",
            'last_name': "Doe",
            "date_of_birth": "2024-07-29",
            "gender": "M",
            'state_of_origin': 'Abuja',
            'state_of_residence': 'Abuja',
        })
        self.assertEqual(len(mail.outbox), 1)  # Check that an email was sent
        self.assertIn('testuser@example.com', mail.outbox[0].to)

        # Simulate clicking the verification link
        verification_link = mail.outbox[0].body.split('http://')[1].split('\n')[0]
        response = self.client.get('http://' + verification_link)
        self.assertEqual(response.status_code, 302)  # Assuming the verification link works

class UserLoginTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='complexpassword123', user_type='CUSTOMER', phone_number='09127943109')
        self.user.is_active = True  # Ensure the user is active
        self.user.save()

    def test_login(self):
        response = self.client.post(reverse('login'), {
            'email': 'testuser@example.com',
            'password': 'complexpassword123'
        })
        self.assertEqual(response.status_code, 200)  # Assuming a redirect after successful login
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())

    def test_login_invalid_credentials(self):
        response = self.client.post(reverse('login'), {
            'email': 'testuser@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 400)  # Assuming the login page is shown again
        
