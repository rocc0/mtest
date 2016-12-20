from django.conf.urls import url, include
from django.conf import settings
from django.views.generic.base import TemplateView

from . import views
from . import serializers

urlpatterns = [
    url(r'^$', views.mtest_add, name='mtest_add'),
    url(r'^i/(?P<pk>[\w-]+)$', views.mtest_edit, name='mtest_edit'),
    url(r'^i/(?P<pk>[\w-]+)/get/$', serializers.mtest_get, name='mtest_json'),
    url(r'^i/(?P<pk>[\w-]+)/pdf/$', views.to_pdf, name='to_pdf'),
    url(r'^json/(?P<model>\w{0,50})/(?P<param>\w{0,50})$', serializers.uib_view, name='serial'),


    url(r'^email/send/$', views.sendmail),
    url(r'^email/thankyou/$', TemplateView.as_view(template_name='mtest/thankyou.html'), name='thankyou'),
    url(r'^email/$', TemplateView.as_view(template_name='mtest/email.html'), name='email'),
]