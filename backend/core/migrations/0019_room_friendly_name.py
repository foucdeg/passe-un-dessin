# Generated by Django 3.0.5 on 2020-05-04 02:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_auto_20200427_2134'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='friendly_name',
            field=models.CharField(default='', max_length=128),
        ),
    ]
