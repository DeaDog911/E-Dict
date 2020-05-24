# Generated by Django 3.0.6 on 2020-05-18 16:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dict', '0016_auto_20200518_1621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dictionary',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='foreign_dictionaries', to=settings.AUTH_USER_MODEL),
        ),
    ]