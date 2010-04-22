from common import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

## Database Setup
DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = SITE_ROOT / 'db' / 'development.sqlite3'

DEVSERVER_MODULES = (
    'devserver.modules.sql.SQLRealTimeModule',
    'devserver.modules.sql.SQLSummaryModule',
    'devserver.modules.profile.ProfileSummaryModule',
    'devserver.modules.ajax.AjaxDumpModule',

    # Modules not enabled by default
    #'devserver.modules.profile.MemoryUseModule',
    #'devserver.modules.cache.CacheSummaryModule',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
    #'django.contrib.auth.middleware.AuthenticationMiddleware',
)

INSTALLED_APPS = (
    #'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    #'django.contrib.sites',
    'django_extensions',
    'devserver',
    'apps.index',
    'apps.reader',
)
