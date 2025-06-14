# Generated by Django 4.2.13 on 2024-09-06 16:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0012_alter_usersavingsplan_title'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usersavingsplan',
            old_name='current_amount',
            new_name='balance',
        ),
        migrations.AddField(
            model_name='usersavingsplan',
            name='next_transfer_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
