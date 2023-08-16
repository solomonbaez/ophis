from django.urls import reverse
from rest_framework.test import APITestCase
from .models import Note
from .serializers import NoteSerializer


class NoteTests(APITestCase):
    #################### TESTING /NOTES ####################
    def test_health_check(self):
        url = reverse("health")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_get_notes_empty_db(self):
        url = reverse("notes")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        # need to include post generation to ensure actual GET functionality
        self.assertEqual(response.data, {"message": "No notes."})

    def test_post_note(self):
        url = reverse("notes")

        data = {"title": "testing", "content": "testing"}
        response = self.client.post(url, data, format="json")

        # GET returns a json list object -> unpack
        [response_get] = self.client.get(url).json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, response_get)

    #################### TESTING /NOTES/<str:pk> ####################
    def test_get_note_no_match(self):
        url = reverse("notes", args=[1])

        response = self.client.get(url)

        self.assertEqual(response.data, {"message": "No matching note."})

    def test_put_note(self):
        self.test_post_note()

        url = reverse("notes", args=[1])
        post = self.client.get(url)

        data = {"title": "testing (updated)", "content": "testing"}
        response = self.client.put(url, data, format="json")

        self.assertNotEqual(response.data, post.data)

    def test_delete_note(self):
        self.test_post_note()

        url = reverse("notes", args=[1])
        post = self.client.get(url)

        self.client.delete(url)
        response = self.client.get(url)

        self.assertNotEqual(response.data, post.data)
        self.assertEqual(response.data, {"message": "No matching note."})
