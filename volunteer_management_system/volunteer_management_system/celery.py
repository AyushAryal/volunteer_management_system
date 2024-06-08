import os
from celery import Celery
import dotenv

dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "volunteer_management_system.development"
)

app = Celery("volunteer_management_system")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
