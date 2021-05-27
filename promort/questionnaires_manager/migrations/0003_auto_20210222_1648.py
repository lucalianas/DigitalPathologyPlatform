# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-22 16:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaires_manager', '0002_auto_20200205_1103'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionnaire',
            name='label',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='questionnairestep',
            name='slides_set_a_label',
            field=models.CharField(blank=True, default=None, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='questionnairestep',
            name='slides_set_b_label',
            field=models.CharField(blank=True, default=None, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='questionsset',
            name='label',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]