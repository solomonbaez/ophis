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
        // textResize(data);
      });
  }, []);

  const changeHandler = (post: Note) => {
    post.ranking = post.ranking + 1;
    const id = post.id;
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

  // const textResize = (note: Note) => {
  //   const noteContent: string = note.content;
  //   const textArea = document.querySelector("textarea");
  //   if (noteContent && textArea) {
  //     const lineCount: number = noteContent.split("\n").length;
  //     const styleHeight: number = parseInt(textArea.style.height, 10);
  //     console.log(textArea.style.height)
  //     console.log(styleHeight);
  //     console.log(lineCount);
  //     if (10 < lineCount) {
  //       textArea.style.height = `${lineCount * 20}px`;
  //     }
  //   }
  // };

  const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const element = event.target;
    setNote({ ...note, content: element.value });
    // textResize(note);
  };

  return (
    <div className="px-2 py-2 mb-2 h-5/6 rounded-md border border-gray-300 bg-gray-600">
      <h1 className="text-orange-300 font-bold text-lg mb-2">{note.title}</h1>
      <hr />
      <textarea
        className="h-3/4 w-full bg-gray-600 resize-none focus:outline-none"
        defaultValue={note?.content}
        onChange={(event) => {
          textHandler(event);
        }}
      >
        {note?.content}
      </textarea>
      <hr />
      <Link onClick={() => changeHandler(note)} href="/">
        <button className="hover:text-blue-400 hover:underline">back</button>
      </Link>
      <br />
      <Link href="/">
        {params.id !== "create" ? (
          <button
            className="hover:text-red-600 hover:underline"
            onClick={() => deleteHandler(note.id)}
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
