from django.db import models

class FeedList(models.Model):
    name = models.CharField(max_length=150)
    urlid = models.CharField(max_length=50)

    def get_absolute_url(self):
        return "/v/%s" % self.urlid

class Feed(models.Model):
    title = models.CharField(max_length=150) 
    url = models.URLField()
    list_of_feeds = models.ForeignKey('FeedList')
