from django.db import models

class FeedList(models.Model):
    name = models.CharField(max_length=150)
    urlid = models.CharField(max_length=50)

class Feed(models.Model):
    title = models.CharField(max_length=150) 
    url = models.URLField()
    list_of_feeds = models.ForeignKey('FeedList')
