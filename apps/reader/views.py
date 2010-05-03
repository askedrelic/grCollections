from django.views.generic.simple import direct_to_template
from django.http import HttpResponse

from apps.reader.models import FeedList, Feed as rssFeed

from lib.libgreader import Feed, GoogleReader, ClientAuth, OAuthMethod

import lxml.etree
import json
import string
from random import Random

def convert_to_builtin_type(obj):
    # Convert objects to a dictionary of their representation
    d = {}
    d.update(obj.__dict__)
    return d

def index(request):
    """
    Receives POST request with GReader user/pass or OPML file of feeds.
    Uses either to setup list of alpha sorted feeds.
    """
    if request.method == 'POST':
        if ('username' in request.POST and request.POST['username'] and
            'password' in request.POST and request.POST['password']):
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
        elif 'test' in request.POST:
            #testing mode!
            username = "tester"
            user_feed_list = getDemoFeeds()
        else:
            #error!
            pass

    #get unique categories for sorting
    json_uniq_categories = json.dumps(uniqifyCategories(user_feed_list))

    json_user_feed = json.dumps(user_feed_list,
                                sort_keys=True,
                                default=convert_to_builtin_type)

    templateLocation = 'reader/index.html'
    return direct_to_template(request, templateLocation, locals())

def share(request):
    """
    Take a list of rssFeeds and name, give them a unique id, and save them
    """
    if request.method == 'POST':
        if 'feedname' in request.POST and request.POST['feedname']:
            feedname = request.POST['feedname']
            randid = "".join(Random().sample(string.letters+string.digits, 10))
            feedlist = FeedList(name=feedname, urlid=randid)
            feedlist.save()
            for f in request.POST.items():
                if f[0] != 'feedname' and f[0]:
                    rssFeed.objects.create(
                            title=f[0],
                            url=f[1],
                            list_of_feeds=feedlist)

    templateLocation = 'reader/share.html'
    return direct_to_template(request, templateLocation, locals())


def view(request,urlid):
    """
    View a feedlist
    """
    user_feed_list = FeedList.objects.get(urlid = urlid)
    user_feed_list = user_feed_list.feed_set.all()

    if user_feed_list:
        templateLocation = 'reader/view.html'
        return direct_to_template(request, templateLocation, locals())
    else:
        return HttpResponse(500)

def getGoogleFeeds(username, password):
    try:
        auth = ClientAuth(username,password)
        google = GoogleReader(auth)
    except IOError:
        #handle username/password error
        #redirect to homepage with error?
        pass

    if google.buildSubscriptionList():
        user_feed_list = google.getFeeds()

    return user_feed_list

def getOPMLFeeds(opmlfile):
    """returns an alpha sorted List of Feeds"""
    #TODO: this only pulls 1 level deep rss feeds right now, should be made recursive
    new_feeds = lxml.etree.fromstring(opmlfile)
    #all feeds using Feed.title as the key, value as the Feed obj
    feed_list = {}

    #title = new_feeds.xpath("/opml/head/title")[0].text
    #all RSS feeds in a doc, with dups
    #all_feeds = new_feeds.xpath("/opml/body//*[@type]")

    #add all top level categories
    top_level_categories = new_feeds.xpath("/opml/body/outline[not(@type)]")
    for individual_category in top_level_categories:
        for el in individual_category:
            title = el.attrib['title']
            url = el.attrib['xmlUrl']
            feed_category = individual_category.attrib['title']
            new_feed = Feed(title, url, [feed_category])
            if title not in feed_list:
                feed_list[title] = new_feed
            #if does exist, add feed's categories
            else:
                feed_list[title].categories.append(feed_category)

    #add all top level rss feeds, without categories
    uncat_feeds = new_feeds.xpath("/opml/body/outline[@type]")
    for feed in uncat_feeds:
        title = feed.attrib['title']
        url = feed.attrib['xmlUrl']
        new_feed = Feed(title, url, ['uncategorized'])
        if title not in feed_list:
            feed_list[title] = new_feed

    #convert to List and sort based off the Feed title
    feed_list = feed_list.values()
    feed_list.sort(key=lambda obj: obj.title.lower())

    #add unique list of categories in 0 place
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

def uniqifyCategories(feedlist):
    #find all categories in a list of feeds and return them as a single list
    categories = set()
    for feed in feedlist:
        [categories.add(cat) for cat in feed.categories]
    return sorted(list(categories))

def getDemoFeeds():
    feed_list = []
    feed_list.append(Feed('WE THE ROBOTS', 'http://feeds.feedburner.com/WeTheRobots', ['comics']))
    feed_list.append(Feed('Cook To Bang', 'http://cooktobang.com/feed/', ['food']))
    feed_list.append(Feed('Amy Blogs Chow', 'http://amyblogschow.jasonpaladino.com/?feed=rss2', ['food']))
    feed_list.append(Feed('Superpoop', 'http://superpoop.com/rss/rss.php', ['comics']))
    feed_list.append(Feed('Explosm.net', 'http://feeds.feedburner.com/Explosm', ['comics']))
    feed_list.append(Feed('xkcd', 'http://xkcd.com/rss.xml', ['comics']))

    return sorted(feed_list, key=lambda obj: obj.title.lower())
