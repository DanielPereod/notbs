export type Note = {
  Path: string;
  Title: string;
  Body: string
};


export type NoteContextType = {
  note: Note;
  setNote: React.Dispatch<React.SetStateAction<Note>>;
}
