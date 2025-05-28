from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Customer, Business

# Register your models here.
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'phone_number', 'date_joined', 'is_staff', 'is_verified')
    search_fields = ('email', 'phone_number')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('phone_number', 'first_name', 'middle_name', 'last_name', 'is_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone_number', 'password1', 'password2'),
        }),
    )

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'middle_name', 'last_name', 'phone_number', 'date_of_birth', 'gender', 'state_of_origin', 'state_of_residence', 'next_of_kin_name', 'next_of_kin_phone', 'address', 'city', 'state')
    search_fields = ('email', 'first_name', 'middle_name', 'last_name', 'phone_number')
    ordering = ('email',)

class BusinessAdmin(admin.ModelAdmin):
    list_display = ('email', 'company_name', 'tax_id', 'address')
    search_fields = ('email', 'company_name', 'tax_id')
    ordering = ('email',)

admin.site.register(User, UserAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Business, BusinessAdmin)