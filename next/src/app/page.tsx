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
import { Note } from "../components/Note";
import { DeleteNote } from "../components/DeleteNote";
import NoteModal from "../components/NoteModal";

interface NoteItemProps {
  note: Note;
}

const Home: React.FC = () => {
  let [isModalOpen, setModalOpen] = useState<boolean>(false);
  let [notes, setNotes] = useState<Note[]>([]);
  let [note, setNote] = useState<Note>(notes[0]);

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

  const getNote = (id: string) => {
    fetch(`http://127.0.0.1:8000/api/notes/${id}/`)
      .then((res) => res.json())
      .then((data: Note) => {
        setNote(data);
        setModalOpen(!isModalOpen);
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
    fetch(`http://127.0.0.1:8000/api/notes/${note.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  };

  const handleRank = (rankedNotes: Note[]) => {
    if (rankedNotes) {
      rankedNotes.forEach((note: Note, index: number) => {
        note.ranking = index + 1;
        handleChange(note);
      });

      setNotes(rankedNotes);
    }
  };

  const closeModal = (_response: Promise<void>) => {
    setModalOpen(!isModalOpen);
    getNotes();
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
        <div className={`${isModalOpen ? "blur-sm" : ""}`}>
          <h1 className="text-gray-300 animate-pulse transition-colors duration-1000 hover:text-pink-300 font-bold text-lg text-center mt-2 mb-4">
            NOTES
          </h1>
          <Droppable droppableId="notes">
            {(provided) => (
              <ul
                className="space-y-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {notes.map((note, index) => (
                  <Draggable
                    key={note.id}
                    draggableId={note.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        className="rounded-lg border border-gray-400 bg-gray-500 shadow-lg shadow-gray-700 p-4 transition-colors delay-50 hover:bg-gray-900"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <button
                          className="text-white font-bold text-lg transition-colors hover:text-pink-100 hover:underline"
                          onClick={() => getNote(note.id)}
                        >
                          {note.title}
                        </button>
                        <p>{truncatedContent(note.content)}</p>
                        <p className="text-pink-300">
                          <small>{note.created}</small>
                        </p>
                        <p className="text-pink-300">
                          <small>{note.id}</small>
                        </p>
                        <br />
                        <button
                          className="text-blue-200 hover:text-blue-100"
                          onClick={() => handleDelete(note.id)}
                        >
                          delete
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <button
            className="px-4 py-5 text-pink-300 hover:text-pink-200"
            onClick={() => getNote("create")}
          >
            create
          </button>
        </div>
        <NoteModal
          initialNote={note}
          isOpen={isModalOpen}
          onClose={(newNote) => closeModal(newNote)}
        />
      </main>
    </DragDropContext>
  );
};

export default Home;
