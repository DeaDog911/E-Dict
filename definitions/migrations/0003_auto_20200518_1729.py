# Generated by Django 3.0.6 on 2020-05-18 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('definitions', '0002_auto_20200518_1727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='word',
            name='value',
            field=models.CharField(max_length=50),
        ),
    ]
