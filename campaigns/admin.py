from django.contrib import admin
from .models import Campaign, SavingsPlan, UserSavingsPlan

# Register your models here.
admin.site.register(Campaign)
admin.site.register(SavingsPlan)
admin.site.register(UserSavingsPlan)