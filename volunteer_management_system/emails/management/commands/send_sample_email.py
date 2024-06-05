from django.contrib.sites.models import Site

from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import get_template


class Command(BaseCommand):
    help = "This command sends a sample email to specified users"

    def add_arguments(self, parser):
        parser.add_argument("email_addresses", nargs="+")

    def handle(self, *args, **options):
        site = Site.objects.get_current()
        msg = get_template("emails/confirm_email.html").render(
            {
                "site": site,
                "admin_email": settings.EMAIL_HOST_USER,
            }
        )
        send_mail(
            "Sample email from {site.name}",
            None,
            settings.EMAIL_HOST_USER,
            options["email_addresses"],
            html_message=msg,
        )
