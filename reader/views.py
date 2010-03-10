from django.views.generic.simple import direct_to_template
from django.http import HttpResponse

from lib.libgreader import Feed, GoogleReader
import lxml.etree

def index(request):
    """
    Receives POST request with GReader user/pass or OPML file of feeds.
    Uses either to setup list of feeds.
    """
    if request.method == 'POST':
        if 'username' in request.POST and request.POST['username'] and\
            'password' in request.POST and request.POST['password']:
                #using libgreader
                username = request.POST['username']
                password = request.POST['password']
                user_feed_list = getGoogleFeeds(username,password)
                #if username is an email, don't display the domain part
                if "@" in username:
                    username = username.split("@")[0]
        elif 'opmlfile' in request.FILES and request.FILES['opmlfile']:
            opmlfile = request.FILES['opmlfile'].read()
            #use OPML file
            username = getOPMLTitle(opmlfile)
            user_feed_list = getOPMLFeeds(opmlfile)
        else:
            #error!
            pass

    templateLocation = 'reader/index.html'
    return direct_to_template(request, templateLocation, locals())

def getGoogleFeeds(username, password):
    try:
        google = GoogleReader(username, password, 'FeederReader')
    except URLError:
        #handle username/password error
        #redirect to homepage with error?
        pass

    if google.buildSubscriptionList():
        user_feed_list = google.getFeeds()
    return user_feed_list

def getOPMLFeeds(opmlfile):
    #this only pulls 1 level deep rss feeds right now, should be made recursive
    #returns a List of Feeds
    new_feeds = lxml.etree.fromstring(opmlfile)
    feed_list = []

    title = new_feeds.xpath("/opml/head/title")[0].text

    #all RSS feeds in a doc, with dups
    #all_feeds = new_feeds.xpath("/opml/body//*[@type]")
    #top level categories
    top_cats = new_feeds.xpath("/opml/body/outline[not(@type)]")
    #top level rss feeds, without categories
    uncat_feeds = new_feeds.xpath("/opml/body/outline[@type]")

    for category in top_cats:
        for el in category:
            title = el.attrib['title']
            url = el.attrib['xmlUrl']
            cat_list = [category.attrib['title']]
            feed_list.append(Feed(title, url, cat_list))

    return feed_list

def getOPMLTitle(opmlfile):
    #return title element of the OPML feed
    new_feeds = lxml.etree.fromstring(opmlfile)
    #get the OPML title node as a split list
    title_list = new_feeds.xpath("/opml/head/title")[0].text.split()
    #title should be formatted as:
    #'XXXX subscriptions in Google Reader'
    sub_index = title_list.index('subscriptions')
    title = ''.join(title_list[:sub_index])
    return title

#AJAX METHODS
def echo(request):
    return HttpResponse(request.GET['echo'])
