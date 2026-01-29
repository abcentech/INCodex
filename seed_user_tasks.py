import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "investnaira.settings")
django.setup()

from django.contrib.auth import get_user_model
from users.models import UserTask

User = get_user_model()

def seed_tasks():
    users = User.objects.all()
    count = 0
    print(f"Checking tasks for {users.count()} users...")
    
    for user in users:
        # Task 1: Freedom Map
        if not UserTask.objects.filter(user=user, title="Map Your Freedom").exists():
            UserTask.objects.create(
                user=user,
                title="Map Your Freedom",
                description="Use the Wealth Map generator to set your freedom date.",
                action_link="OPEN_WEALTH_MAP",
                reward_text="100 Wealth Points"
            )
            count += 1
        
        # Task 2: NairaAI
        if not UserTask.objects.filter(user=user, title="Meet NairaAI").exists():
            UserTask.objects.create(
                user=user,
                title="Meet NairaAI",
                description="Ask your new AI assistant a question about your portfolio.",
                action_link="OPEN_CHAT",
                reward_text="50 Wealth Points"
            )
            count += 1
            
        # Task 3: Habit Streak
        if not UserTask.objects.filter(user=user, title="Start Your Streak").exists():
            UserTask.objects.create(
                user=user,
                title="Start Your Streak",
                description="Check out the Habit Tracker in the sidebar.",
                action_link="SCROLL_TO_SIDEBAR",
                reward_text="Badge: Consistency Rookie"
            )
            count += 1
            
    print(f"Successfully seeded {count} tasks.")

if __name__ == "__main__":
    seed_tasks()
