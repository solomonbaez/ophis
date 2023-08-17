"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { request } from "http";

async function getNotes() {}

export default function Home() {
  let [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notes")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
      });
  }, []);

  console.log("Notes:", notes);

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
              {note.title}
              <br />
              {note.content}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
