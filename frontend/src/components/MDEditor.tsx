import { FormEvent, TextareaHTMLAttributes, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import "../App.css";
import { UpdateFileByDirectory } from "../../wailsjs/go/main/App";
import { marked } from "marked";
import { useHotkeys, HotkeysProvider } from "react-hotkeys-hook";
import { hotkeysDict } from "../config/hotkeys";
import { useDebounce } from "../helpers/debounce";
import { Note } from "../types/Note";
import { NoteContext } from "../App";

export function MDEditor() {
  const { note, setNote } = useContext(NoteContext);
  const [formatedNote, setFormatedNote] = useState<Note>({ Path: "", Body: "", Title: "" }); //TODO: set default note from home

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

  async function transformToMarkdown(body: string): Promise<Note> {
    const newText = await marked.parse(body);

    return {
      ...note,
      Body: newText,
    };
  }

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
    const transformNote = async () => {
      const formattedNote = await transformToMarkdown(note.Body);
      setFormatedNote(formattedNote);
    };
    UpdateFileByDirectory(note.Path, note.Path, note.Body);

    transformNote();
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
          <div
            className="markdown-editor"
            dangerouslySetInnerHTML={{
              __html:
                formatedNote?.Body.trim().length == 0
                  ? `${hotkeysDict.toggle_display} to start typing...`
                  : formatedNote?.Body,
            }}
          ></div>
        )}
      </div>
    </HotkeysProvider>
  );
}
