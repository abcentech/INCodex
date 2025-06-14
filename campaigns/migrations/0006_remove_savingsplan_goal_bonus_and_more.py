# Generated by Django 4.2.13 on 2024-08-07 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0005_rename_transfers_transfer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='savingsplan',
            name='goal_bonus',
        ),
        migrations.RemoveField(
            model_name='savingsplan',
            name='unit_price',
        ),
        migrations.AddField(
            model_name='campaign',
            name='unit_price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AddField(
            model_name='savingsplan',
            name='min_investment',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='savingsplan',
            name='tier',
            field=models.CharField(choices=[('CONSERVATIVE', 'Conservative'), ('BALANCED', 'Balanced'), ('AGGRESSIVE', 'Aggressive')], max_length=20),
        ),
        migrations.AlterField(
            model_name='transfer',
            name='status',
            field=models.CharField(choices=[('SUCCESS', 'Success'), ('PENDING', 'Pending'), ('FAILED', 'Failed')], default='PENDING', max_length=10),
        ),
        migrations.AlterField(
            model_name='usersavingsplan',
            name='status',
            field=models.CharField(choices=[('ACTIVE', 'Active'), ('PAUSED', 'Paused'), ('COMPLETED', 'Completed')], max_length=20),
        ),
    ]
