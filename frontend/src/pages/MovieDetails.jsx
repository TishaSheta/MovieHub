import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { imgUrl } from "../services/api.js";
import Reviews from "../components/Reviews.jsx";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setMovie(null);
    setError("");
    api
      .get(`/movie/${id}`, { signal: controller.signal })
      .then((res) => setMovie(res.data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") setError("Couldn't load this movie.");
      });
    return () => controller.abort();
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!movie) return <p className="text-[var(--muted)]">Loading…</p>;

  return (
    <>
      <article className="grid gap-8 md:grid-cols-[300px_1fr]">
        <img src={imgUrl(movie.poster_path)} alt={movie.title} className="w-full rounded-lg" />
        <div>
          <Link to="/" className="text-sm text-[var(--accent)]">← Back to browse</Link>
          <h1 className="mt-2 text-3xl font-bold">{movie.title}</h1>
          {movie.tagline && <p className="italic text-[var(--muted)]">{movie.tagline}</p>}
          <p className="mt-3 text-sm text-[var(--muted)]">
            {movie.release_date} · {movie.runtime} min · ★ {movie.vote_average?.toFixed(1)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g.id} className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs">{g.name}</span>
            ))}
          </div>
          <p className="mt-5 max-w-prose leading-relaxed">{movie.overview}</p>
        </div>
      </article>
      <Reviews tmdbId={movie.id} />
    </>
  );
}
