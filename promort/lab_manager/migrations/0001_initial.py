#  Copyright (c) 2022, CRS4
#
#  Permission is hereby granted, free of charge, to any person obtaining a copy of
#  this software and associated documentation files (the "Software"), to deal in
#  the Software without restriction, including without limitation the rights to
#  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
#  the Software, and to permit persons to whom the Software is furnished to do so,
#  subject to the following conditions:
#
#  The above copyright notice and this permission notice shall be included in all
#  copies or substantial portions of the Software.
#
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
#  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
#  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
#  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
#  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from django.db import migrations

from promort import settings as pms

import logging
logger = logging.getLogger('promort')


def create_lab_manager_group(apps, schema_editor):
    logger.info('Creating lab manager group (if needed)')
    Group = apps.get_model('auth', 'Group')
    group_data = pms.DEFAULT_GROUPS['lab_manager']
    group, created = Group.objects.get_or_create(name=group_data['name'])
    if created:
        logger.info('Created group %s', group.name)
    else:
        logger.info('A group with name %s already exists, no need to create a new one', group.name)


class Migration(migrations.Migration):

    operations = [
        migrations.RunPython(create_lab_manager_group)
    ]
