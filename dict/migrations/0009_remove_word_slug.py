# Generated by Django 3.0.6 on 2020-05-12 19:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dict', '0008_auto_20200512_1928'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='word',
            name='slug',
        ),
    ]
