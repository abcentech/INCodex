import os
import requests
from decimal import Decimal
from django.utils import timezone
from campaigns.models import UserSavingsPlan
from wallet.models import Wallet

def get_user_financial_context(user):
    """
    Gather financial context for the user to provide personalized advice.
    """
    context = []
    
    # 1. Wallet Balance
    try:
        wallet = Wallet.objects.get(user=user)
        context.append(f"Primary Wallet Balance: {wallet.balance} NGN")
    except Wallet.DoesNotExist:
        context.append("User does not have a wallet initialized.")

    # 2. Risk Profile
    if hasattr(user, 'customer'):
        context.append(f"User Risk Profile: {user.customer.risk_profile}")
    else:
        context.append("User Risk Profile: Not set (Business account)")

    # 3. Savings Plans
    active_plans = UserSavingsPlan.objects.filter(user=user, status='ACTIVE')
    if active_plans.exists():
        context.append("Active Savings Plans:")
        for plan in active_plans:
            progress = (plan.balance / plan.goal_amount * 100) if plan.goal_amount > 0 else 0
            context.append(
                f"- Plan: {plan.title}, Balance: {plan.balance} NGN, Goal: {plan.goal_amount} NGN, "
                f"Progress: {progress:.1f}%, Auto-Transfer: {'Enabled' if plan.auto_transfer_enabled else 'Disabled'}"
            )
    else:
        context.append("User has no active savings plans.")

    # 4. Recent Transactions (simplified)
    # Could add more details here if needed
    
    return "\n".join(context)

def get_ai_advisor_response(user, user_message, chat_history=[]):
    """
    Get a response from the AI advisor.
    In a real app, this would call OpenAI/Anthropic.
    For now, it uses a mock implementation if no API key is set.
    """
    context = get_user_financial_context(user)
    
    api_key = os.getenv('OPENAI_API_KEY')
    base_url = os.getenv('AI_SERVICE_URL', 'https://api.openai.com/v1/chat/completions')

    system_prompt = (
        "You are the InvestNaira AI Financial Advisor. Your goal is to help users manage their "
        "wealth and make smart investment decisions on the InvestNaira platform. "
        "Use the user's financial context provided below to give personalized, actionable advice. "
        "Be professional, encouraging, and clear. Avoid overly complex jargon. "
        "Always remind users that investments carry risk.\n\n"
        f"USER FINANCIAL CONTEXT:\n{context}"
    )

    messages = [{"role": "system", "content": system_prompt}]
    for msg in chat_history:
        messages.append({"role": msg['role'], "content": msg['content']})
    messages.append({"role": "user", "content": user_message})

    if not api_key:
        # Mock response if no API key is provided
        return (
            f"As your InvestNaira advisor, I've analyzed your profile ({user.email}). "
            f"You currently have an active balance and your risk profile is "
            f"{user.customer.risk_profile if hasattr(user, 'customer') else 'General'}. "
            "I'm currently in 'offline' mode because the AI provider is not configured, "
            "but I can see your progress! Keeping your savings automated is a great way to build wealth. "
            "Is there anything specific about your plans you'd like to discuss?"
        )

    try:
        response = requests.post(
            base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "temperature": 0.7
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"AI Advisor Error: {str(e)}")
        return "I'm having trouble connecting to my knowledge base right now. Please try again in a few moments."
