"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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
        handleRank(data);
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

  const handleChange = (note: Note) => {
    let _response = fetch(`http://127.0.0.1:8000/api/notes/${note.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  };

  const handleRank = (rankedNotes: Note[]) => {
    rankedNotes.forEach((note: Note, index: number) => {
      note.ranking = index + 1;
      handleChange(note);
    });

    setNotes(rankedNotes);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedNotes = Array.from(notes);
    const [movedNote] = reorderedNotes.splice(result.source.index, 1);
    reorderedNotes.splice(result.destination.index, 0, movedNote);

    handleRank(reorderedNotes);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main>
        <Head>
          <title>NOTES</title>
        </Head>
        <div>
          <h1 className="text-orange-300 font-bold text-lg text-center">
            NOTES
          </h1>
          <Droppable droppableId="notes">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {notes.map((note, index) => (
                  <Draggable
                    key={note.id}
                    draggableId={note.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-2 py-2 mb-2 rounded-md border border-gray-300 bg-gray-600"
                      >
                        <Link href={`note/${note.id}`} passHref>
                          <button className="text-orange-300 font-bold text-lg hover:text-orange-200-400 hover:underline">
                            {note.title}
                          </button>
                        </Link>
                        <hr />
                        {truncatedContent(note.content)}
                        <br />
                        {note.created}
                        <br />
                        <button
                          className="text-red-500 hover:text-red-600 hover:underline"
                          onClick={() => handleDelete(note.id)}
                        >
                          delete
                        </button>
                        <hr />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <Link href="/note/create" passHref>
            <button className="px-2 py-5 text-green-500 hover:text-green-600 hover:underline">
              create
            </button>
          </Link>
        </div>
      </main>
    </DragDropContext>
  );
};

export default Home;
