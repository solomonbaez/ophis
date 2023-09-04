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

interface NoteCreationProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewNoteModal: React.FC<NoteCreationProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`modal ${
        isOpen ? "fixed" : "hidden"
      } inset-0 overflow-y-auto flex items-center justify-center z-10`}
    >
      <div className="modal-content bg-green-400">
        <h2>Create New Note</h2>
        <textarea placeholder="Enter your note here..." />
        <div className="modal-actions mt-4 flex justify-end">
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

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
          <h1 className="text-pink-500 font-bold text-lg text-center mt-8 mb-4">
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
                        className="rounded-lg border border-pink-500 bg-pink-600 p-4"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Link href={`note/${note.id}`} passHref>
                          <button className="text-whitefont-bold text-lg hover:underline">
                            {note.title}
                          </button>
                        </Link>
                        <p>{truncatedContent(note.content)}</p>
                        <p className="text-pink-300">
                          <small>{note.created}</small>
                        </p>
                        <br />
                        <button
                          className="text-blue-200 hover:text-blue-400"
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
          <Link href="/note/create" passHref>
            <button className="px-4 py-5 text-green-400 hover:text-green-500">
              create
            </button>
          </Link>
          <button onClick={() => setModalOpen(true)}>Modal</button>
          <NewNoteModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      </main>
    </DragDropContext>
  );
};

export default Home;
