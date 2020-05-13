# Generated by Django 3.0.6 on 2020-05-12 18:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dict', '0002_auto_20200510_1754'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dictionary',
            options={'ordering': ['title']},
        ),
        migrations.AlterField(
            model_name='dictionary',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
