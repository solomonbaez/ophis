import React, { useState, useEffect } from "react";
import { Note } from "./Note";

interface NoteCreationProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoteModal: React.FC<NoteCreationProps> = ({ isOpen, onClose }) => {
  let [note, setNote] = useState<Note>();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/notes/create`)
      .then((res) => res.json())
      .then((data: Note) => {
        setNote(data);
      });
  }, []);

  const createHandler = (post: Note) => {
    if (post.content && post.content.trim() !== "") {
      // extract first row of data
      let title: string = post.content.split("\n")[0];

      if (title.length > 20) {
        title = title.slice(0, 30);
      }

      post.title = title;

      let _response = fetch(`http://127.0.0.1:8000/api/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
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
      } inset-0 overflow-y-auto flex items-center justify-center z-10`}
    >
      <div className="px-2 py-2 mb-2 h-5/6 rounded-lg border border-pink-500 bg-gray-600">
        <textarea
          className="h-3/4 w-full bg-gray-600 resize-none focus:outline-none"
          placeholder="Enter your note 💕"
          onChange={(event) => {
            textHandler(event);
          }}
        />
        <button
          className="modal-actions mt-4 flex justify-end hover:text-green-400 hover:underline"
          onClick={() => createHandler(note)}
        >
          create
        </button>
      </div>
    </div>
  );
};

export default NoteModal;
