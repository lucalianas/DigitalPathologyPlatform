# Generated by Django 3.1.13 on 2022-09-17 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rois_manager', '0024_auto_20220303_1519'),
    ]

    operations = [
        migrations.AddField(
            model_name='slice',
            name='positive_cores',
            field=models.IntegerField(default=None, null=True),
        ),
    ]