import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { clearWatchlist } from "../store/watchlistSlice.js";
import { useAuth } from "../context/AuthContext.jsx";
import MovieList from "../components/MovieList.jsx";

export default function Watchlist() {
  const items = useSelector((s) => s.watchlist.items);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleClear = async () => {
    try {
      await dispatch(clearWatchlist()).unwrap();
      toast.warn("Watchlist cleared");
    } catch {
      toast.error("Couldn't clear the watchlist");
    }
  };

  if (!user) {
    return (
      <p className="text-[var(--muted)]">
        <Link to="/login" className="text-[var(--accent)]">Log in</Link> to see your watchlist.
      </p>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your watchlist</h1>
        {items.length > 0 && (
          <button onClick={handleClear} className="rounded border border-[var(--muted)] px-3 py-2 text-sm">
            Clear all
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-[var(--muted)]">
          Nothing saved yet. <Link to="/" className="text-[var(--accent)]">Browse movies</Link> and tap the heart.
        </p>
      ) : (
        <MovieList movies={items} />
      )}
    </section>
  );
}
