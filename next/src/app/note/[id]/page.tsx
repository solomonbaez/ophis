"use client";
import React, { useState, useEffect } from "react";

interface Note {
  title: string;
  content: string;
  updated: string;
  created: string;
}

export default function Note({ params }: { params: { id: string } }) {
  let [note, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/notes/${params.id}`)
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNotes(data);
      });
  }, []);

  return (
    <div>
      {note.title}
      <hr />
      {note.content}
    </div>
  );
}
