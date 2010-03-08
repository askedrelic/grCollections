from django.views.generic.simple import direct_to_template
from django.http import HttpResponse

from lib.libgreader import Feed, GoogleReader

def index(request):
    """Receives POST request with user/pass and displays that user's feeds"""

    #validate username/pass and display error if bad
    #username = request.POST['username']
    #password = request.POST['password']
    username = request.GET['username']
    password = request.GET['password']

    #try:
    #    google = GoogleReader(username, password, 'FeederReader')
    #except URLError:
    #    #handle username/password error
    #    #redirect to homepage with error?
    #    pass

    #if google.buildSubscriptionList():
    #    user_feed_list = google.getFeeds()
        
    #DEBUG setup static user_feed_list
    user_feed_list = []
    for i in xrange(1,20):
        user_feed_list.append(Feed("test%s"%i, "www.%s.com"%i, [i,i+1,i+2]))
        
    templateLocation = 'reader/index.html'
    return direct_to_template(request, templateLocation, locals())


#AJAX METHODS
def echo(request):
    return HttpResponse(request.GET['echo'])
