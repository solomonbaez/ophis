"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

interface Note {
  title: string;
  content: string;
  updated: string;
  created: string;
}

export default function Home() {
  let [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notes/")
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNotes(data);
      });
  }, []);

  return (
    <main>
      <Head>
        <title>NOTES</title>
      </Head>
      <div>
        <h1 className="text-center">NOTES</h1>
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <Link href={`note/${note.id}`}>{note.title}</Link>
              <br />
              {note.content}
              <br />
              {note.updated}
              <br />
              {note.created}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
