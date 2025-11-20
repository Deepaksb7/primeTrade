"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import axios from "axios";
import Cards from "@/components/cards";
import EditableCard from "@/components/EditableCard";
import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
}

type SortOption = "newest" | "oldest" | "a-z" | "z-a";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [addingNote, setAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );

  const updateQuery = useCallback(
  (newSearch: string, newSort: string) => {
    const params = new URLSearchParams({ search: newSearch, sort: newSort });
    router.replace(`/dashboard?${params.toString()}`);
  },
  [router]
);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/api/notes", { params: { search, sort } });
        setNotes(res.data.notes || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };
    fetchNotes();
  }, [search, sort]);

  const handleSearch = useCallback(
  (newSearch?: string) => {
    const searchValue = newSearch ?? search;
    setSearch(searchValue);
    updateQuery(searchValue, sort);
  },
  [search, sort, updateQuery] 
);


  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    handleSearch(search);
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [search, handleSearch]); 


  const handleAddNote = async (title: string, content: string) => {
    try {
      const res = await axios.post("/api/notes", { title, content });
      const newNote = res.data.note || res.data;
      setNotes([newNote, ...notes]);
      setAddingNote(false);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleSaveEdit = async (id: string, title: string, content: string) => {
    try {
      const res = await axios.put(`/api/notes/${id}`, { title, content });
      const updatedNote = res.data.updatedNote || res.data;
      setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
      setEditingNoteId(null);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 pb-10">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
            </div>
            <input
              className="block w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 transition-shadow"
              type="text"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <select
            className="rounded-xl border bg-white px-3 py-2 shadow-sm text-sm"
            value={sort}
            onChange={(e) => {
              const newSort = e.target.value as SortOption;  
              setSort(newSort);
              updateQuery(search, newSort);
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="a-z">A → Z</option>
            <option value="z-a">Z → A</option>
          </select>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            onClick={() => setAddingNote(true)}
          >
            <Plus size={18} />
            Create Note
          </button>
        </div>

        {addingNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 transition-all duration-300">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/5">
              <div className="h-[400px] w-full">
                <EditableCard
                  onSave={handleAddNote}
                  onCancel={() => setAddingNote(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note._id}
                className="h-full w-full animate-in fade-in zoom-in duration-300"
              >
                {editingNoteId === note._id ? (
                  <EditableCard
                    initialTitle={note.title}
                    initialContent={note.content}
                    onSave={(title, content) =>
                      handleSaveEdit(note._id!, title, content)
                    }
                    onCancel={() => setEditingNoteId(null)}
                  />
                ) : (
                  <Cards
                    title={note.title}
                    content={note.content}
                    onEdit={() => setEditingNoteId(note._id!)}
                    onDelete={() => handleDeleteNote(note._id!)}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-zinc-100 p-4 mb-4">
                <Plus className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">
                No notes found
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Get started by creating a new note.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
