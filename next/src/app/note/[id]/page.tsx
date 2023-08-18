"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Note {
  title: string;
  content: string;
  updated: string;
  created: string;
}

export default function Note({ params }: { params: { id: string } }) {
  const router = useRouter();

  let [note, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/notes/${params.id}`)
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNotes(data);
      });
  }, []);

  function deleteNote() {
    fetch(`http://127.0.0.1:8000/api/notes/${params.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.refresh();
  }

  return (
    <div>
      {note.title}
      <hr />
      {note.content}
      <br />
      <Link className="hover:text-blue-400 hover:underline" href="/">
        ⬅ back
      </Link>
      <Link
        className="hover:text-blue-400 hover:underline"
        href="/"
        onClick={deleteNote}
      >
        ❌ delete
      </Link>
    </div>
  );
}
