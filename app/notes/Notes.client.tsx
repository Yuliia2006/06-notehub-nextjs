"use client";

import { useState, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import css from "@/app/notes/Notes.module.css";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function App() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const perPage = 12;

  const debouncedSearch = useDebouncedCallback(setSearchQuery, 300);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage, search: searchQuery }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) return;
    if (currentPage > data.totalPages) {
      setCurrentPage(data.totalPages || 1);
    }

   if (!isLoading && !isFetching && (data?.notes?.length ?? 0) === 0) {
  toast("No such note found", { icon: "ℹ️", duration: 3000 });
}
  }, [data, currentPage, isLoading, isFetching]);
  console.log("data from query:", data);

  const handleCreateSuccess = async () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          text={searchInput}
          onSearch={(value) => {
            setSearchInput(value);
            debouncedSearch(value);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          disabled={isFetching}
        >
          Create note +
        </button>
      </header>

      {isLoading && <strong>Loading notes...</strong>}
      {isError && <div>Error loading notes</div>}

      {data && !isLoading && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
