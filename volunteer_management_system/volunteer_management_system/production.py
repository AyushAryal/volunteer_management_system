# flake8: noqa

import sys
from .settings import *

DEBUG = False

FRONTEND_USES_TLS = True

SECURE_BROWSER_XSS_FILTER = True

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = ("rest_framework.renderers.JSONRenderer",)

REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = (
    "rest_framework.authentication.TokenAuthentication",
)

print("WARNING: Using MD5 Password hasher in production", file=sys.stderr)

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = (
#     [
#         "rest_framework.throttling.AnonRateThrottle",
#     ],
# )
#
# REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
#     "anon": "100/day",
# }

ALLOWED_HOSTS = ["182.93.86.220"]
STATIC_ROOT = os.path.join(BASE_DIR, "../static")
