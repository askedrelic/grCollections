from django.views.generic.simple import direct_to_template
from django.http import HttpResponse

from lib.libgreader import Feed, GoogleReader

def index(request):
    """Receives POST request with user/pass and displays that user's feeds"""

    #verify username/pass and display error if bad
    username = request.POST['username']
    password = request.POST['password']

    google = GoogleReader(username, password, 'FeederReader')
    if google.buildSubscriptionList():
        user_feed_list = google.getFeeds()
        
    templateLocation = 'reader/index.html'
    return direct_to_template(request, templateLocation, locals())




#AJAX METHODS
def echo(request):
    return HttpResponse(request.GET['echo'])
