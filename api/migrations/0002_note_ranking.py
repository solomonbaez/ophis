# Generated by Django 4.2.3 on 2023-09-01 06:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="note",
            name="ranking",
            field=models.IntegerField(default=0),
        ),
    ]
