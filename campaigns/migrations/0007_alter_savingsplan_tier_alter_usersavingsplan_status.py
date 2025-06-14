# Generated by Django 4.2.13 on 2024-08-11 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0006_remove_savingsplan_goal_bonus_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savingsplan',
            name='tier',
            field=models.CharField(choices=[('CONSERVATIVE', 'Conservative'), ('BALANCED', 'Balanced'), ('AGGRESIVE', 'Aggressive')], max_length=20),
        ),
        migrations.AlterField(
            model_name='usersavingsplan',
            name='status',
            field=models.CharField(choices=[('ACTIVE', 'Active'), ('PAUSED', 'Paused'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled')], max_length=20),
        ),
    ]
