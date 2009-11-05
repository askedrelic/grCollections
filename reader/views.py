from django.views.generic.simple import direct_to_template
from django.http import HttpResponse

def index(request):
    title = 'Index'
    templateLocation = 'reader/index.html'

    return direct_to_template(request, templateLocation, locals())




#AJAX METHODS
def echo(request):
    return HttpResponse(request.GET['echo'])
