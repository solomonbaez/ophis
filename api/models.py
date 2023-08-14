from django.db import models


class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(max_length=200)

    updated = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)

    # order by most recent update/creation
    class Meta:
        ordering = ["-updated", "-created"]
