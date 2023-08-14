# Generated by Django 4.2.3 on 2023-08-14 17:24

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Note",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("content", models.TextField(max_length=200)),
                ("updated", models.DateField(auto_now=True)),
                ("created", models.DateField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-updated", "-created"],
            },
        ),
    ]