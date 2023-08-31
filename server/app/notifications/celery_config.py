import os
from celery import Celery

# Load environment variables or provide default values
BROKER_URL = os.environ.get("BROKER_URL", "pyamqp://guest@localhost//")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "rpc://")

celery_app = Celery(
    "notifications",
    broker=BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["notifications.tasks"],
)

celery_app.conf.task_routes = {
    "notifications.tasks.*": {"queue": "notifications"}
}

# Additional Celery configurations can be added here
