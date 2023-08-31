import os
import smtplib
from notifications.celery_config import celery_app

# Load environment variables or provide default values
EMAIL_SMTP_SERVER = os.environ.get("EMAIL_SMTP_SERVER", "smtp.example.com")
EMAIL_SMTP_PORT = int(os.environ.get("EMAIL_SMTP_PORT", 587))
EMAIL_SMTP_USERNAME = os.environ.get("EMAIL_SMTP_USERNAME", "your_email@example.com")
EMAIL_SMTP_PASSWORD = os.environ.get("EMAIL_SMTP_PASSWORD", "your_email_password")

@celery_app.task
def send_notification(notification_type, recipient, message):
    if notification_type == "email":
        send_email(recipient, message)
        return f"Email notification sent to {recipient}"
    else:
        return "Unsupported notification type"

def send_email(to, message):
    with smtplib.SMTP(EMAIL_SMTP_SERVER, EMAIL_SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_SMTP_USERNAME, EMAIL_SMTP_PASSWORD)
        server.sendmail(EMAIL_SMTP_USERNAME, to, message)
