import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investnaira.settings')

app = Celery('investnaira')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
app.conf.beat_schedule = {
    'process-transfers-daily': {
        'task': 'campaigns.tasks.process_transfers',
        'schedule': crontab(minute=0, hour=0),
    },
}