import React, { useState, useEffect } from "react";
import { Note } from "./Note";

interface NoteCreationProps {
  initialNote?: Note;
  isOpen: boolean;
  onClose: (response?: Promise<void>) => void; // callback
}

const NoteModal: React.FC<NoteCreationProps> = ({
  initialNote,
  isOpen,
  onClose,
}) => {
  let [note, setNote] = useState<Note | undefined>(initialNote);
  console.log(note?.id);

  const createHandler = (post: Note) => {
    console.log(post?.id);
    if (post && post.content && post.content.trim() !== "") {
      // extract first row of data
      let title: string = post.content.split("\n")[0];

      if (title.length > 20) {
        title = title.slice(0, 30);
      }

      post.title = title;

      fetch(`http://127.0.0.1:8000/api/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      let newpost = fetch(`http://127.0.0.1:8000/api/notes/${note.id}`)
        .then((res) => res.json())
        .then((data: Note) => {
          setNote(data);
        });
      onClose(newpost);
    }

    onClose();
  };

  const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const element = event.target;
    setNote({ note, content: element.value });
  };

  return (
    <div
      className={`modal ${
        isOpen ? "fixed" : "hidden"
      } inset-0 py-5 overflow-y-auto flex items-center justify-center z-10`}
    >
      <div className="w-11/12 mx-auto pt-4 pb-10 h-5/6 rounded-lg border border-gray-400 bg-gray-500 shadow-lg shadow-gray-700">
        <textarea
          className="px-4 placeholder-pink-300 text-white h-full w-full bg-gray-500 resize-none focus:outline-none"
          placeholder="Enter your note 🫧"
          defaultValue={note?.content}
          onChange={(event) => {
            textHandler(event);
          }}
        />
        <button
          className="modal-actions px-4 h-auto text-pink-300 hover:text-pink-200"
          onClick={() => createHandler(note)}
        >
          done
        </button>
      </div>
    </div>
  );
};

export default NoteModal;
