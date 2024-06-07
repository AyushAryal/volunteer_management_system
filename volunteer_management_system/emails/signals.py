from authentication.signals import new_password_reset_link, new_verification_link
from django.conf import settings
from django.contrib.sites.models import Site
from django.dispatch import receiver
from django.template.loader import get_template

from emails.tasks import async_send_mail


@receiver(new_verification_link)
def on_new_verification_link(sender, link, user, **kwargs):
    site = Site.objects.get_current()
    msg = get_template("emails/confirm_email.html").render(
        {
            "site": site,
            "admin_email": settings.EMAIL_HOST_USER,
            "link": link,
            "user": user,
        }
    )
    async_send_mail.delay(
        "Verification Link",
        None,
        settings.EMAIL_HOST_USER,
        [user.email],
        html_message=msg,
    )


@receiver(new_password_reset_link)
def on_new_password_reset_link(sender, link, user, **kwargs):
    site = Site.objects.get_current()
    msg = get_template("emails/password_reset.html").render(
        {
            "site": site,
            "admin_email": settings.EMAIL_HOST_USER,
            "link": link,
            "user": user,
        }
    )
    async_send_mail.delay(
        "Verification Link",
        None,
        settings.EMAIL_HOST_USER,
        [user.email],
        html_message=msg,
    )
