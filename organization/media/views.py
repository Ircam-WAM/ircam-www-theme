from django.shortcuts import render

from organization.media.models import *
from organization.core.views import *


class VideoListView(ListView):

    model = Video
    template_name='festival/video_list.html'

    def get_queryset(self, **kwargs):
        return self.model.objects.published()

    def get_context_data(self, **kwargs):
        context = super(VideoListView, self).get_context_data(**kwargs)
        context['categories'] = VideoCategory.objects.all()
        return context


class VideoDetailView(SlugMixin, DetailView):

    model = Video
    template_name='festival/video_detail.html'
    context_object_name = 'video'

    def get_context_data(self, **kwargs):
        context = super(VideoDetailView, self).get_context_data(**kwargs)
        return context


class VideoListCategoryView(VideoListView):

    def get_queryset(self):
        self.category = VideoCategory.objects.get(slug=self.kwargs['slug'])
        return self.model.objects.filter(category=self.category)

    def get_context_data(self, **kwargs):
        context = super(VideoListCategoryView, self).get_context_data(**kwargs)
        context['category'] = self.category
        return context
