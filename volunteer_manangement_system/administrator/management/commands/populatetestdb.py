from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "This command populates the database with default db"

    def handle(self, *_, **__):
        ...
