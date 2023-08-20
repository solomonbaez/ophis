"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Note } from "../../../lib/Note";
import { DeleteNote } from "../../../lib/DeleteNote";

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

  const deleteHandler = (id: string) => {
    DeleteNote(id);
    router.refresh();
  };

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
        onClick={() => deleteHandler(note.id)}
      >
        ❌ delete
      </Link>
    </div>
  );
}
