# Generated by Django 3.0.6 on 2020-05-18 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dict', '0015_word_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dictionary',
            name='date_create',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='word',
            name='date_create',
            field=models.DateTimeField(),
        ),
    ]
