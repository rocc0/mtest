# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-06-22 07:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mtest', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mtestdata',
            name='user_type',
            field=models.TextField(default=''),
        ),
    ]
