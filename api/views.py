from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Note


@api_view(["GET"])
def health(request) -> Response:
    return Response(HttpResponse.status_code)
