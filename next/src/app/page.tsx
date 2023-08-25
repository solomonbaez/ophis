"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Note } from "../lib/Note";
import { DeleteNote } from "../lib/DeleteNote";

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const truncatedContent =
    note.content.length < 40 ? note.content : note.content.slice(0, 40);

  const handleDelete = (id: string) => {
    DeleteNote(id);
    // getNotes();
  };

  return (
    <li>
      <Link href={`note/${note.id}`} passHref>
        <button className="hover:text-blue-400 hover:underline">
          {note.title}
        </button>
      </Link>
      <br />
      {truncatedContent}
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
  );
};

const Home: React.FC = () => {
  let [notes, setNotes] = useState<Note[]>([]);

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

  return (
    <main>
      <Head>
        <title>NOTES</title>
      </Head>
      <div className="px-10 py-5">
        <h1 className="text-center">NOTES</h1>
        <hr />
        <ul>
          {notes.map((note, index) => (
            <NoteItem key={index} note={note} />
          ))}
        </ul>
        <Link href="/note/create" passHref>
          <button className="py-5 text-green-500 hover:text-green-600 hover:underline">
            create
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
