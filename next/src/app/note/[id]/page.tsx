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
    // extract first row of data
    let title: string = post.content.split("\n")[0];
    if (title.length > 20) {
      title = title.splice(0, 20);
    }

    post.title = title;

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

  const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
    setNote({ ...note, content: element.value });
  };

  return (
    <div className="px-2 py-2 mb-2 h-1/2 rounded-md border border-gray-300 bg-gray-600">
      {note.title}
      <hr />
      <textarea
        className="w-full h-auto bg-gray-600 resize-none"
        defaultValue={note?.content}
        onChange={(event) => {
          textHandler(event);
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
