# Generated by Django 3.0.6 on 2020-05-12 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dict', '0011_auto_20200512_1931'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dictionary',
            name='slug',
            field=models.SlugField(blank=True),
        ),
    ]
