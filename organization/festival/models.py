from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse, reverse_lazy
from django.conf import settings

from mezzanine.core.models import RichText, Displayable, Slugged
from mezzanine.core.fields import RichTextField, OrderField, FileField
from mezzanine.utils.models import AdminThumbMixin, upload_to
from mezzanine.blog.models import BlogPost
from mezzanine.pages.models import Page

from mezzanine_agenda.models import Event

import requests
from pyquery import PyQuery as pq


app_label = 'festival'
ALIGNMENT_CHOICES = (('left', _('left')), ('right', _('right')))
MEDIA_BASE_URL = getattr(settings, 'MEDIA_BASE_URL', 'http://medias.ircam.fr/embed/media/')


class MetaCore:

    app_label = 'festival'


class BaseNameModel(models.Model):
    """Base object with name and description"""

    name = models.CharField(_('name'), max_length=512)
    description = models.TextField(_('description'), blank=True)

    class Meta(MetaCore):
        abstract = True

    def __unicode__(self):
        return self.name

class BaseTitleModel(models.Model):
    """Base object with title and description"""

    title = models.CharField(_('title'), max_length=512)
    description = models.TextField(_('description'), blank=True)

    class Meta(MetaCore):
        abstract = True

    def __unicode__(self):
        return self.title


class Artist(Displayable, RichText, AdminThumbMixin):
    """Artist"""

    first_name = models.CharField(_('first name'), max_length=255, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=255, blank=True, null=True)
    bio = RichTextField(_('biography'), blank=True)
    photo = FileField(_('photo'), upload_to='images/photos', max_length=1024, blank=True, format="Image")
    photo_credits = models.CharField(_('photo credits'), max_length=255, blank=True, null=True)
    photo_alignment = models.CharField(_('photo alignment'), choices=ALIGNMENT_CHOICES, max_length=32, default="left", blank=True)
    photo_description = models.TextField(_('photo description'), blank=True)
    photo_featured = FileField(_('photo featured'), upload_to='images/photos', max_length=1024, blank=True, format="Image")
    photo_featured_credits = models.CharField(_('photo featured credits'), max_length=255, blank=True, null=True)
    events = models.ManyToManyField(Event, related_name='artists', verbose_name=_('events'), blank=True)

    search_fields = ("title", "bio")

    class Meta(MetaCore):
        verbose_name = _('artist')
        db_table = app_label + '_artists'
        ordering = ['last_name',]

    def __unicode__(self):
        return self.title

    @property
    def name(self):
        return self.title

    def get_absolute_url(self):
        return reverse("festival-artist-detail", kwargs={'slug': self.slug})

    def set_names(self):
        names = self.title.split(' ')
        if len(names) == 1:
            self.first_name = ''
            self.last_name = names[0]
        elif len(names) == 2:
            self.first_name = names[0]
            self.last_name = names[1]
        else:
            self.first_name = names[0]
            self.last_name = ' '.join(names[1:])

    def clean(self):
        super(Artist, self).clean()
        self.set_names()

    def save(self, *args, **kwargs):
        self.set_names()
        super(Artist, self).save(*args, **kwargs)

    @property
    def featured_image(self):
        if self.photo_featured:
            return self.photo_featured
        else:
            return self.photo


class Media(Displayable, RichText):
    """Media"""

    media_id = models.CharField(_('media id'), max_length=128)
    open_source_url = models.URLField(_('open source URL'), max_length=1024, blank=True)
    closed_source_url = models.URLField(_('closed source URL'), max_length=1024, blank=True)
    poster_url = models.URLField(_('poster'), max_length=1024, blank=True)

    class Meta(MetaCore):
        abstract = True

    def __unicode__(self):
        return self.title

    @property
    def uri(self):
        return MEDIA_BASE_URL + self.media_id

    def get_html(self):
        r = requests.get(self.uri)
        return r.content

    def clean(self):
        super(Media, self).clean()
        self.q = pq(self.get_html())
        sources = self.q('source')
        for source in sources:
            if self.open_source_mime_type in source.attrib['type']:
                self.open_source_url = source.attrib['src']
            elif self.closed_source_mime_type in source.attrib['type']:
                self.closed_source_url = source.attrib['src']
        video = self.q('video')
        if len(video):
            if 'poster' in video[0].attrib.keys():
                self.poster_url = video[0].attrib['poster']


class Audio(Media):
    """Audio"""

    open_source_mime_type = 'audio/ogg'
    closed_source_mime_type = 'audio/mp4'

    event = models.ForeignKey(Event, related_name='audios', verbose_name=_('event'), blank=True, null=True, on_delete=models.SET_NULL)
    artists = models.ManyToManyField(Artist, verbose_name=_('artists'), related_name='audios', blank=True)

    class Meta(MetaCore):
        verbose_name = _('audio')
        db_table = app_label + '_audios'

    def get_absolute_url(self):
        return reverse("festival-video-detail", kwargs={"slug": self.slug})


class Video(Media):
    """Video"""

    open_source_mime_type = 'video/webm'
    closed_source_mime_type = 'video/mp4'

    event = models.ForeignKey(Event, related_name='videos', verbose_name=_('event'), blank=True, null=True, on_delete=models.SET_NULL)
    category = models.ForeignKey('VideoCategory', related_name='videos', verbose_name=_('category'), blank=True, null=True, on_delete=models.SET_NULL)
    artists = models.ManyToManyField(Artist, verbose_name=_('artists'), related_name='videos', blank=True)

    class Meta(MetaCore):
        verbose_name = _('video')
        db_table = app_label + '_videos'

    @property
    def html(self):
        #TODO: get html content from medias.ircam.fr with request module
        pass

    def get_absolute_url(self):
        return reverse("festival-video-detail", kwargs={"slug": self.slug})


class Playlist(BaseTitleModel):
    """(Playlist description)"""

    audios = models.ManyToManyField(Audio, verbose_name=_('audios'), related_name='playlists', blank=True)
    event = models.ForeignKey(Event, related_name='playlists', verbose_name=_('event'), blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title


class Featured(BaseNameModel):
    """(Featured description)"""

    artists = models.ManyToManyField(Artist, verbose_name=_('artists'), related_name='featured', blank=True)
    events = models.ManyToManyField(Event, verbose_name=_('events'), related_name='featured', blank=True)
    videos = models.ManyToManyField(Video, verbose_name=_('videos'), related_name='featured', blank=True)
    blogposts = models.ManyToManyField(BlogPost, verbose_name=_('blog posts'), related_name='featured', blank=True)
    pages = models.ManyToManyField(Page, verbose_name=_('pages'), related_name='featured', blank=True)
    playlists = models.ManyToManyField(Playlist, verbose_name=_('playlists'), related_name='featured', blank=True)

    def __unicode__(self):
        return self.name


class VideoCategory(Slugged):
    """Video Category"""

    class Meta(MetaCore):
        verbose_name = _('video category')
        db_table = app_label + '_video_category'

    def count(self):
        return self.videos.published().count()+1