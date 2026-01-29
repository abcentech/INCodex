from django.contrib import admin
from .models import Wallet, Bank, BankAccount, Transaction, process_transaction

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'created_at', 'updated_at')
    search_fields = ('user__email',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_type', 'amount', 'transaction_status', 'created_at', 'receiver_id', 'sender_id')
    list_filter = ('transaction_type', 'transaction_status')
    actions = ['process_selected_transactions']

    def process_selected_transactions(self, request, queryset):
        for tx in queryset:
            if tx.transaction_status == 'PENDING':
                process_transaction(tx.id)
        self.message_user(request, "Selected pending transactions have been processed.")
    process_selected_transactions.short_description = "Process selected pending transactions"

admin.site.register(Bank)
admin.site.register(BankAccount)
