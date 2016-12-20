from django.contrib import admin
import bulk_admin

from .models import Profession, Dia, Zob, MtestData



class ProfessionAdmin(bulk_admin.BulkModelAdmin):
    fieldsets = [
        (None,               {'fields': ['prof_name']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    list_filter = ['pub_date']
    list_display = ('prof_name', 'pub_date')

class DiaAdmin(bulk_admin.BulkModelAdmin):
    fieldsets = [
        (None,               {'fields': ['dia_name']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    list_filter = ['pub_date']
    list_display = ('dia_name', 'pub_date')


class ZobAdmin(bulk_admin.BulkModelAdmin):
    fieldsets = [
        (None,               {'fields': ['zob_name']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    list_filter = ['pub_date']
    list_display = ('zob_name', 'pub_date')

class MtestDataAdmin(admin.ModelAdmin):
    fieldsets = [
        ('None',                {'fields': ['mid','author','content']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]

    list_filter = ['pub_date']
    list_display = ('mid', 'pub_date')

admin.site.register(Profession, ProfessionAdmin)
admin.site.register(Dia, DiaAdmin)
admin.site.register(Zob, ZobAdmin)
admin.site.register(MtestData, MtestDataAdmin)
