from django.views.generic.simple import direct_to_template

def index(request):
    title = 'Index'
    templateLocation = 'index/index.html'
    
    return direct_to_template(request, templateLocation, locals())
