from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

if settings.DEBUG:

    class AsyncResult:
        def __init__(self, result):
            self.result = result

        def get(self):
            return self.result

    class async_send_mail:
        @staticmethod
        def delay(*args, **kwargs) -> AsyncResult:
            return AsyncResult(send_mail(*args, **kwargs))
else:

    @shared_task
    def async_send_mail(*args, **kwargs):
        return send_mail(*args, **kwargs)
