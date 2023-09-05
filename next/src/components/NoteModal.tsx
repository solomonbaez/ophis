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
      } inset-0 py-5 overflow-y-auto flex items-center justify-center z-10`}
    >
      <div className="w-11/12 mx-auto pt-4 pb-10 h-5/6 rounded-lg border border-pink-500 bg-gray-500">
        <textarea
          className="px-4 placeholder-green-300 text-white h-full w-full bg-gray-500 resize-none focus:outline-none"
          placeholder="Enter your note 💕"
          onChange={(event) => {
            textHandler(event);
          }}
        />
        <button
          className="modal-actions px-4 h-auto text-green-300 hover:text-green-400"
          onClick={() => createHandler(note)}
        >
          create
        </button>
      </div>
    </div>
  );
};

export default NoteModal;
