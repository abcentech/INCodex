"""
Utility functions for creating and managing notifications
"""
from .models import Notification


def create_notification(user, title, message, notification_type='SYSTEM', action_link=None):
    """
    Create a notification for a user
    
    Args:
        user: User instance
        title: Notification title
        message: Notification message
        notification_type: Type of notification (TRANSACTION, SAVINGS, CAMPAIGN, SYSTEM, ACHIEVEMENT)
        action_link: Optional link for user action
    
    Returns:
        Notification instance
    """
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        action_link=action_link
    )
    return notification


def notify_transaction(user, transaction_type, amount, description):
    """
    Create a notification for a transaction
    
    Args:
        user: User instance
        transaction_type: Type of transaction (DEPOSIT, WITHDRAWAL, INVESTMENT, etc.)
        amount: Transaction amount
        description: Transaction description
    """
    title_map = {
        'DEPOSIT': '💰 Deposit Successful',
        'WITHDRAWAL': '💸 Withdrawal Processed',
        'INVESTMENT': '📈 Investment Made',
        'RETURN': '🎉 Returns Received',
        'TRANSFER': '🔄 Transfer Completed',
    }
    
    title = title_map.get(transaction_type, '💳 Transaction Completed')
    message = f"{description}. Amount: ₦{amount:,.2f}"
    
    return create_notification(
        user=user,
        title=title,
        message=message,
        notification_type='TRANSACTION',
        action_link='/dashboard/transactions'
    )


def notify_savings_transfer(user, plan_title, amount, success=True):
    """
    Create a notification for automatic savings transfer
    
    Args:
        user: User instance
        plan_title: Title of the savings plan
        amount: Transfer amount
        success: Whether the transfer was successful
    """
    if success:
        title = '✅ Auto-Save Successful'
        message = f"₦{amount:,.2f} transferred to {plan_title}"
    else:
        title = '⚠️ Auto-Save Failed'
        message = f"Transfer to {plan_title} failed. Please check your wallet balance."
    
    return create_notification(
        user=user,
        title=title,
        message=message,
        notification_type='SAVINGS',
        action_link='/dashboard/plans'
    )


def notify_goal_achieved(user, plan_title, goal_amount):
    """
    Create a notification when a savings goal is achieved
    
    Args:
        user: User instance
        plan_title: Title of the savings plan
        goal_amount: Goal amount achieved
    """
    title = '🎯 Goal Achieved!'
    message = f"Congratulations! You've reached your goal of ₦{goal_amount:,.2f} for {plan_title}"
    
    return create_notification(
        user=user,
        title=title,
        message=message,
        notification_type='ACHIEVEMENT',
        action_link='/dashboard/plans'
    )


def notify_plan_paused(user, plan_title, reason='insufficient balance'):
    """
    Create a notification when a savings plan is paused
    
    Args:
        user: User instance
        plan_title: Title of the savings plan
        reason: Reason for pausing
    """
    title = '⏸️ Plan Paused'
    message = f"Your {plan_title} has been paused due to {reason}. Please review and re-enable."
    
    return create_notification(
        user=user,
        title=title,
        message=message,
        notification_type='SAVINGS',
        action_link='/dashboard/plans'
    )


def notify_campaign_update(user, campaign_title, message_text):
    """
    Create a notification for campaign updates
    
    Args:
        user: User instance
        campaign_title: Title of the campaign
        message_text: Update message
    """
    title = f'📢 Update: {campaign_title}'
    
    return create_notification(
        user=user,
        title=title,
        message=message_text,
        notification_type='CAMPAIGN',
        action_link='/dashboard/campaigns'
    )
