# Generated by Django 3.1.13 on 2021-12-01 09:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rois_manager', '0022_auto_20211129_1509'),
    ]

    operations = [
        migrations.AddField(
            model_name='core',
            name='action_complete_time',
            field=models.DateTimeField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='focusregion',
            name='action_complete_time',
            field=models.DateTimeField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='slice',
            name='action_complete_time',
            field=models.DateTimeField(default=None, null=True),
        ),
    ]