from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'index.views.index'),
    (r'^signup/$', 'reader.views.index'),
    (r'^admin/(.*)', admin.site.root),
    (r'^echo/$', 'reader.views.echo'),
)

#Let django host static content during development.
if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    )

