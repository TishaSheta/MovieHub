import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/moviesSlice.js";
import useDebounce from "../hooks/useDebounce.js";
import GenreFilter from "../components/GenreFilter.jsx";
import MovieList from "../components/MovieList.jsx";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error, totalPages } = useSelector((s) => s.movies);

  const [text, setText] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const query = useDebounce(text.trim(), 500);

  const inputRef = useRef(null);
  const topRef = useRef(null);

  // Focus the search box on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch on mount and whenever query / genre / page change
  useEffect(() => {
    const request = dispatch(fetchMovies({ query, genre, page }));
    return () => request.abort(); // cancel stale requests
  }, [dispatch, query, genre, page]);

  // Scroll back up when the page changes
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  const handleSearch = (e) => {
    setText(e.target.value); // two-way binding: value + onChange
    setPage(1);
  };

  const handleGenre = (id) => {
    setGenre(id);
    setPage(1);
  };

  const clearFilters = () => {
    setText("");
    setGenre("");
    setPage(1);
    inputRef.current?.focus();
  };

  return (
    <section>
      <h1 ref={topRef} className="mb-4 text-3xl font-bold">
        Find your next movie
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          value={text}
          onChange={handleSearch}
          placeholder="Search movies"
          className="min-w-64 flex-1 rounded bg-[var(--surface)] px-3 py-2"
        />
        <button onClick={clearFilters} className="rounded border border-[var(--muted)] px-3 py-2 text-sm">
          Clear filters
        </button>
      </div>

      <div className="mb-6">
        <GenreFilter selected={genre} onSelect={handleGenre} />
        {query && genre !== "" && (
          <p className="mt-2 text-sm text-[var(--muted)]">Search ignores the genre filter.</p>
        )}
      </div>

      {status === "loading" && <p className="text-[var(--muted)]">Loading movies…</p>}
      {status === "failed" && (
        <p className="text-red-400">Couldn't load movies: {error}. Check your TMDB key in .env.</p>
      )}
      {status === "succeeded" && items.length === 0 && (
        <p className="text-[var(--muted)]">No movies match "{query}". Try another title.</p>
      )}

      <MovieList movies={items} />

      <div className="mt-8 flex items-center justify-center gap-4">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded bg-[var(--surface)] px-4 py-2 disabled:opacity-40">
          Previous
        </button>
        <span className="text-sm text-[var(--muted)]">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded bg-[var(--surface)] px-4 py-2 disabled:opacity-40">
          Next
        </button>
      </div>
    </section>
  );
}
