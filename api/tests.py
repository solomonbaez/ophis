from django.urls import reverse
from rest_framework.test import APITestCase
from .models import Note
from .serializers import NoteSerializer


class NoteTests(APITestCase):
    def test_health_check(self):
        url = reverse("health")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_get_notes(self):
        url = reverse("notes")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "No notes."})

    def test_post_note(self):
        url = reverse("notes")

        data = {"title": "testing", "content": "testing"}
        response = self.client.post(url, data, format="json")

        # GET returns a json list object -> unpack
        [response_get] = self.client.get(url).json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, response_get)
