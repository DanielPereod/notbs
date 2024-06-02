import { FormEvent, TextareaHTMLAttributes, createContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { marked } from "marked";
import { handleTabKeyDown } from "./helpers/tabDefault";
import { useHotkeys, HotkeysProvider } from "react-hotkeys-hook";
import { MDEditor } from "./components/MDEditor";
import { CommandPrompt } from "./components/CommandPrompt";
import { TitleBar } from "./components/TitleBar";
import { NoteSearch } from "./components/NoteSearch";
import { Note, NoteContextType } from "./types/Note";


export const NoteContext = createContext<NoteContextType>({} as NoteContextType);

function App() {
  const [note, setNote] = useState<Note>({} as Note);

  return (
    <NoteContext.Provider value={{note, setNote}}>
      <HotkeysProvider>
        <div className="light">
          <TitleBar />
          <CommandPrompt />
          <NoteSearch />
          <MDEditor />
        </div>
      </HotkeysProvider>
    </NoteContext.Provider>
  );
}

export default App;
