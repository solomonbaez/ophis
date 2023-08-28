"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Note } from "../lib/Note";
import { DeleteNote } from "../lib/DeleteNote";

interface NoteItemProps {
  note: Note;
}

const Home: React.FC = () => {
  let [notes, setNotes] = useState<Note[]>([]);

  const truncatedContent = (content: string) => {
    let truncated: string =
      content.length < 40 ? content : content.slice(0, 40);
    return truncated;
  };

  const getNotes = () => {
    fetch("http://127.0.0.1:8000/api/notes/")
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNotes(data);
      });
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleDelete = (id: string) => {
    DeleteNote(id);

    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  return (
    <main>
      <Head>
        <title>NOTES</title>
      </Head>
      <div>
        <h1 className="text-center">NOTES</h1>
        <ul>
          {notes.map((note, index) => (
            <li
              key={index}
              className="px-2 py-2 mb-2 rounded-md border border-gray-300 bg-gray-600"
            >
              <Link href={`note/${note.id}`} passHref>
                <button className="hover:text-blue-400 hover:underline">
                  {note.title}
                </button>
              </Link>
              <br />
              {truncatedContent(note.content)}
              <br />
              {note.updated}
              <br />
              <button
                className="text-red-500 hover:text-red-600 hover:underline"
                onClick={() => handleDelete(note.id)}
              >
                delete
              </button>
              <hr />
            </li>
          ))}
        </ul>
        <Link href="/note/create" passHref>
          <button className="px-2 py-5 text-green-500 hover:text-green-600 hover:underline">
            create
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
