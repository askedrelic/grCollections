from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'index.views.index'),
    (r'^select/$', 'reader.views.index'),
    (r'^share/$', 'reader.views.share'),


    (r'^v/([a-zA-Z0-9]{10})$', 'reader.views.view'),

    #(r'^admin/(.*)', admin.site.root),
)

#DEBUG Let django host static content during development.
import settings
if settings.development.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.development.MEDIA_ROOT}),
    )

