from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Note
from .serializers import NoteSerializer


@api_view(["GET"])
def health(request) -> Response:
    return Response(HttpResponse.status_code)


class NotesView(APIView):
    def get(self, request) -> Response:
        note = Note.objects.all()
        if note:
            note_data = NoteSerializer(note)
            note_data = note_data.data if note_data else None

            return Response(request, note_data)

        return Response({"message": "No notes."})
