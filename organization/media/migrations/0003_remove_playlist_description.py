# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-27 13:53
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('organization-media', '0002_auto_20160721_1351'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlist',
            name='description',
        ),
    ]
