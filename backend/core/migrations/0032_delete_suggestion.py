# Generated by Django 3.1.3 on 2020-11-29 09:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0031_refactor_suggestions"),
        ("suggestions", "0002_copy_suggestions"),
    ]

    operations = [
        migrations.DeleteModel(name="Suggestion",),
    ]
