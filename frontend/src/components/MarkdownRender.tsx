import { FormEvent, HTMLAttributes, useContext } from "react";

import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { OpenFileByDirectory } from "../../wailsjs/go/main/App";
import { NoteContext } from "../App";
import Markdown from "marked-react";
import { isUrlAbsolute } from "../helpers/isValidURL";

export function MarkdownRender() {
  const { note, setNote } = useContext(NoteContext);

  const renderer = {
    link(link: string, text: string) {
      return (
        <a onClick={handleLinkClick} href={link} id={link}>
          {text}
        </a>
      );
    },
  };

  async function handleLinkClick(e: FormEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const link = e.currentTarget.id;
console.log(link)
    if (isUrlAbsolute(link)) {
      BrowserOpenURL(link);
    } else {
      const note = await OpenFileByDirectory(link);
      setNote(() => note);
    }
  }

  return (
    <div className="markdown-editor">
      <Markdown renderer={renderer} value={note.Body}></Markdown>
    </div>
  );
}

