import { FormEvent, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import "../App.css";
import { UpdateFileByDirectory } from "../../wailsjs/go/main/App";
import Markdown from "marked-react";
import { useHotkeys, HotkeysProvider } from "react-hotkeys-hook";
import { NoteContext } from "../App";
import { MarkdownRender } from "./MarkdownRender";

export function MDEditor() {
  const { note, setNote } = useContext(NoteContext); //TODO: set default note from home

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  type Display = "preview" | "editor";
  const [currentDisplay, setCurrentDisplay] = useState<Display>("preview");

  useHotkeys(
    "ctrl+e",
    (e) => {
      e.preventDefault();
      setCurrentDisplay((prevDisplay) => (prevDisplay === "editor" ? "preview" : "editor"));
    },
    { enableOnFormTags: true }
  );

  function adjustHeight() {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  function handleKeyDown() {
    adjustHeight();
  }

  async function handleOnChange(e: FormEvent<HTMLTextAreaElement>) {
    const body = e.currentTarget.value;

    setNote((note) => ({ ...note, Body: body }));
  }

  useLayoutEffect(adjustHeight, []);

  useEffect(() => {
    adjustHeight();

    if (currentDisplay === "editor" && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = note.Body.length;
    }
  }, [currentDisplay]);

  useEffect(() => {
    UpdateFileByDirectory(note.Path, note.Path, note.Body);
    //TODO: debounce
  }, [note?.Body]);

  useEffect(() => {
    setCurrentDisplay(() => "preview");
  }, [note.Path]);

  return (
    <HotkeysProvider>
      <div id="app">
        {currentDisplay === "editor" ? (
          <textarea
            placeholder="Write a note..."
            ref={textareaRef}
            className="markdown-editor"
            onKeyDown={handleKeyDown}
            onChange={handleOnChange}
            value={note.Body}
          ></textarea>
        ) : (
          <MarkdownRender />
        )}
      </div>
    </HotkeysProvider>
  );
}
