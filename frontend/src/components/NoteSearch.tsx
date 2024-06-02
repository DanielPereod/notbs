import { ChangeEvent, useContext, useEffect, useState } from "react";
import { GlobalInput } from "./GlobalInput";
import { NoteContext } from "../App";
import { OpenFileByDirectory, FindNotesByFilename, CreateFileByDirectory } from "../../wailsjs/go/main/App";
import { Note } from "../types/Note";
import { hotkeysDict } from "../config/hotkeys";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useHotkeys } from "react-hotkeys-hook";

export function NoteSearch() {
  const noteCtx = useContext(NoteContext);
  const { note, setNote } = noteCtx;
  const [isActive, setIsActive] = useState(false);
  const [directory, setDirectory] = useState("");
  const [foundNotes, setFoundNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note>();

  const handleActivate = () => setIsActive(true);
  const handleDeactivate = () => setIsActive(false);

  useHotkeys(
    "enter",
    async (e) => {
      e.preventDefault();
      await getOrCreateNote();
    },
    { enableOnFormTags: true, scopes: ["prompt"] }
  );

  useHotkeys(
    "tab",
    async (e) => {
      e.preventDefault();
      selectNextNote();
    },
    { enableOnFormTags: true, scopes: ["prompt"] }
  );

  async function getOrCreateNote() {
    if (selectedNote) {
      const note = await OpenFileByDirectory(selectedNote?.Path);
      setNote(note);
    } else {
      const note = await CreateFileByDirectory(directory, "");
      setNote(note);
    }
  }

  function selectNextNote() {
    const currentNoteIndex = foundNotes.findIndex((note) => note.Path === selectedNote?.Path);

    if (currentNoteIndex + 1 < foundNotes.length && currentNoteIndex != -1) {
      setSelectedNote(() => foundNotes[currentNoteIndex + 1]);
    } else {
      setSelectedNote(() => foundNotes[0]);
    }
  }

  async function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const fileName = e.target.value;
    const notes = await FindNotesByFilename(fileName);

    if (notes && notes.length > 0) {
      setFoundNotes(() => notes);
    } else {
      setFoundNotes(() => []);
      setSelectedNote(() => undefined)
    }

    setDirectory(() => fileName);
    console.log(foundNotes, selectedNote)
  }

  async function handleNoteClick(path: string) {
    const note = await OpenFileByDirectory(path);
    setNote(() => note);
  }

  function isNoteSelected(path: string): boolean {
    if (selectedNote?.Path === path) {
      return true;
    }
    return false;
  }

  function renderItem(note: Note, key: number) {
    return (
      <li
        key={key}
        className={isNoteSelected(note.Path) ? "selected" : ""}
        onClick={() => handleNoteClick(note.Path)}
        id={note.Path}
      >
        <span>{note.Title}</span>
        <caption>{note.Path}</caption>
      </li>
    );
  }

  useEffect(() => {
    setSelectedNote(() => foundNotes[0]);
  }, [foundNotes]);

  useEffect(() => {
    setIsActive(false);
  }, [note]);

  useEffect(() => {
    setSelectedNote(undefined);
    setFoundNotes([]);
  }, [isActive]);

  return (
    <GlobalInput<Note>
      openHotkey={hotkeysDict.open_search_prompt}
      onActivate={handleActivate}
      onDeactivate={handleDeactivate}
      onChange={handleInputChange}
      renderItem={renderItem}
      items={foundNotes}
      isActive={isActive}
      inputPlaceholder="Search or create a note..."
      Icon={MagnifyingGlassIcon}
    />
  );
}
