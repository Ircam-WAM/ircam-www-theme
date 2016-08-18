# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-12 15:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('organization-magazine', '0011_articleimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('object_id', models.PositiveIntegerField(blank=True, editable=False, null=True)),
                ('content_type', models.ForeignKey(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
        ),
        migrations.AddField(
            model_name='brief',
            name='content_type',
            field=models.ForeignKey(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType'),
        ),
        migrations.AddField(
            model_name='brief',
            name='object_id',
            field=models.PositiveIntegerField(blank=True, editable=False, null=True),
        ),
    ]