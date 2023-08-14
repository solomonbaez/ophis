from django.urls import path
from . import views


urlpatterns = [
    path("health/", views.health, name="health"),
    path("notes/", views.NotesView.as_view(), name="notes"),
    path("notes/<str:pk>", views.NoteView.as_view(), name="notes"),
]
