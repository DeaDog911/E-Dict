# Generated by Django 3.0.6 on 2020-05-12 18:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dict', '0004_auto_20200512_1859'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dictionary',
            options={'ordering': ['-date_create']},
        ),
        migrations.AlterModelOptions(
            name='word',
            options={'ordering': ['-date_create']},
        ),
    ]
