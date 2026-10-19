import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import backend from "../services/backend.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Reviews({ tmdbId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = () =>
    backend
      .get(`/movies/${tmdbId}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(() => toast.error("Couldn't load reviews"));

  useEffect(() => {
    load();
  }, [tmdbId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await backend.post(`/movies/${tmdbId}/reviews`, { rating, comment });
      toast.success("Review saved");
      setComment("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save review");
    }
  };

  const handleDelete = async (id) => {
    try {
      await backend.delete(`/reviews/${id}`);
      toast.warn("Review deleted");
      load();
    } catch {
      toast.error("Couldn't delete review");
    }
  };

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">
        Reviews {average && <span className="text-base text-[var(--muted)]">★ {average} ({reviews.length})</span>}
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg bg-[var(--surface)] p-4">
          <label className="flex items-center gap-2 text-sm">
            Your rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded bg-[var(--bg)] px-2 py-1">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="What did you think?"
            className="w-full rounded bg-[var(--bg)] px-3 py-2"
          />
          <button type="submit" className="rounded bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--accent-ink)]">
            Post review
          </button>
          <p className="text-xs text-[var(--muted)]">Posting again replaces your earlier review of this movie.</p>
        </form>
      ) : (
        <p className="mt-4 text-[var(--muted)]">
          <Link to="/login" className="text-[var(--accent)]">Log in</Link> to write a review.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {reviews.length === 0 && <li className="text-[var(--muted)]">No reviews yet. Be the first.</li>}
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.userName} · ★ {r.rating}</span>
              {user?.id === r.userId && (
                <button onClick={() => handleDelete(r.id)} className="text-sm text-[var(--muted)] underline">
                  Delete
                </button>
              )}
            </div>
            {r.comment && <p className="mt-2">{r.comment}</p>}
            <p className="mt-1 text-xs text-[var(--muted)]">{new Date(r.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
