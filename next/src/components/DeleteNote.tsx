export function DeleteNote(id: string) {
  fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
