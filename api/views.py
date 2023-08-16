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


@api_view(["GET"])
def overview(request) -> Response:
    api_urls = {
        "health": "health/",
        "notes": "notes/",
        "notes/id": "notes/id/",
    }

    return Response(api_urls)


# All Notes 
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


# Individual Notes
class NoteView(APIView):
    def get(self, request, pk) -> Response:
        try:
            note = Note.objects.get(id=pk)
        except:
            return Response({"message": "No matching note."})

        note_data = NoteSerializer(note, many=False)
        note_data = note_data.data

        return Response(note_data)

    def put(self, request, pk) -> Response:
        note = Note.objects.get(id=pk)
        note_data = NoteSerializer(instance=note, data=request.data)

        if note_data.is_valid():
            note_data.save()
            note_data = note_data.data

            return Response(note_data)

        else:
            return Response({"message": "Invalid response."})

    def delete(self, request, pk) -> Response:
        note = Note.objects.get(id=pk)
        note.delete()

        return Response({"message": "Note deleted."})
