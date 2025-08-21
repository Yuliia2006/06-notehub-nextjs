import axios from 'axios';
import type { Note } from '@/types/note.ts';

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface FetchNotesParams {
  page: number;       
  perPage: number;    
  search?: string;    
}

export interface FetchNotesResponse {
   notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const res = await axios.get<FetchNotesResponse>(`notes/`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    params, 
  });
  return res.data;
};

export const createNote = async (noteData: Pick<Note, "title" | "content" | "tag">): Promise<Note> => {
  const res = await axios.post<Note>(`/notes`, noteData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.data;
};

export const getSingleNote = async (id: string) => {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
};