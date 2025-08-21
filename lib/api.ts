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
    const { page = 1, perPage = 12, search = '' } = params;
  const res = await axios.get<FetchNotesResponse>(`notes/`, {
    params: { page, perPage, search },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
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

export const getSingleNote = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.data;
};