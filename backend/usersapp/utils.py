from django.core.mail import EmailMessage

class Utils:
    @staticmethod
    def send_email(payload):
        email = EmailMessage(subject=payload['EMAIL_SUBJECT'], body=payload['EMAIL_BODY'], from_email="support@livingcareservices.org", to=(payload['EMAIL_TO'],))
        email.send()

    