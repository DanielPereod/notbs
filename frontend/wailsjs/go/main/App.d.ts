// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';

export function CloseApp():Promise<void>;

export function CreateFileByDirectory(arg1:string,arg2:string):Promise<main.Note>;

export function DeleteFileByDirectory(arg1:string):Promise<main.Note>;

export function FilesInDirectory(arg1:string):Promise<Array<string>>;

export function FindNotesByFilename(arg1:string):Promise<Array<main.Note>>;

export function MaximiseApp():Promise<void>;

export function MinimiseApp():Promise<void>;

export function OpenFileByDirectory(arg1:string):Promise<main.Note>;

export function UpdateFileByDirectory(arg1:string,arg2:string,arg3:string):Promise<main.Note>;