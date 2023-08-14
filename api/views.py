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
        notes = Note.objects.all()
        if notes:
            notes_data = NoteSerializer(notes, many=True)
            notes_data = notes_data.data if notes_data else None

            return Response(notes_data)

        return Response({"message": "No notes."})

    def post(self, request) -> Response:
        post_data = request.data

        note = Note.objects.create(
            title=post_data["title"],
            content=post_data["content"],
        )

        note_data = NoteSerializer(note, many=False)
        note_data = note_data.data

        return Response(note_data)


class NoteView(APIView):
    def get(self, request, pk) -> Response:
        try:
            note = Note.objects.get(id=pk)
        except:
            return Response({"message": "No matching note."})

        note_data = NoteSerializer(note, many=False)
        note_data = note_data.data

        return Response(note_data)
