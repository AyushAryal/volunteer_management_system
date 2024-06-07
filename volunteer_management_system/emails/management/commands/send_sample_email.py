from django.core.management.base import BaseCommand
from emails.tasks import async_send_mail
from django.conf import settings
from django.contrib.sites.models import Site


class Command(BaseCommand):
    help = "This command sends a sample email to specified users"

    def add_arguments(self, parser):
        parser.add_argument("email_addresses", nargs="+")

    def handle(self, *args, **options):
        site = Site.objects.get_current()
        async_send_mail.delay(
            f"Sample email from {site.name}",
            None,
            settings.EMAIL_HOST_USER,
            options["email_addresses"],
            html_message=f"Hello, this is a sample message from {site.name}",
        )
        self.stdout.write(
            self.style.SUCCESS("Successfully queued the email sending task")
        )
