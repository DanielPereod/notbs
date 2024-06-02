import { ChangeEvent, EventHandler, useContext, useEffect, useState } from "react";
import { CloseApp, MinimiseApp, MaximiseApp, UpdateFileByDirectory } from "../../wailsjs/go/main/App";
import { NoteContext } from "../App";
import { XMarkIcon, MinusIcon, Square2StackIcon } from "@heroicons/react/16/solid";

export function TitleBar() {
  const { note, setNote } = useContext(NoteContext);
  const [path, setPath] = useState(note.Path);

  async function handleNoteTitleInput(e: ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;
    setPath(() => newPath);
  }

  async function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    const oldPath = note.Path;
    const updatedNote = await UpdateFileByDirectory(oldPath, path, note.Body);
    setNote(() => updatedNote);
  }

  useEffect(() => {
    setPath(() => note.Path);
  }, [note]);

  return (
    <div id="title-bar" style={{ widows: 1 }}>
      {note && <input onBlur={handleBlur} onChange={handleNoteTitleInput} value={path}></input>}
      <div>
        <div onClick={MinimiseApp}>
          <MinusIcon className="title-bar-icon" />
        </div>
        <div onClick={MaximiseApp}>
          <Square2StackIcon className="title-bar-icon" />
        </div>
        <div onClick={CloseApp}>
          <XMarkIcon className="title-bar-icon" />
        </div>
      </div>
    </div>
  );
}
