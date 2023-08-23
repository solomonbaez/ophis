"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Note } from "../../../lib/Note";
import { DeleteNote } from "../../../lib/DeleteNote";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export default function Note({ params }: { params: { id: string } }) {
  const router: AppRouterInstance = useRouter();
  let [note, setNote] = useState<Note[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/notes/${params.id}`)
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNote(data);
      });
  }, []);

  const changeHandler = (id: string) => {
    let response = fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  };

  const createHandler = (post: Note) => {
    post.title = "title";
    let response = fetch(`http://127.0.0.1:8000/api/notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
  };

  const deleteHandler = (id: string) => {
    DeleteNote(id);
    router.refresh();
  };

  return (
    <div>
      {note.title}
      <hr />
      <textarea
        className="bg-black"
        defaultValue={note?.content}
        onChange={(event) => {
          setNote({ ...note, content: event.target.value });
        }}
      >
        {note?.content}
      </textarea>
      <br />
      <Link onClick={() => changeHandler(note.id)} href="/">
        <button className="hover:text-blue-400 hover:underline">back</button>
      </Link>
      <br />
      <Link href="/">
        {params.id !== "create" ? (
          <button
            className="hover:text-red-600 hover:underline"
            onClick={deleteHandler}
          >
            delete
          </button>
        ) : (
          <button
            className="hover:text-green-400 hover:underline"
            onClick={() => createHandler(note)}
          >
            create
          </button>
        )}
      </Link>
    </div>
  );
}
