import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { imgUrl } from "../services/api.js";
import WatchlistButton from "./WatchlistButton.jsx";

export default function MovieCard({ movie }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="poster relative overflow-hidden rounded-lg bg-[var(--surface)]"
    >
      <Link to={`/movie/${movie.id}`}>
        <img src={imgUrl(movie.poster_path)} alt={movie.title} loading="lazy" className="aspect-[2/3] w-full object-cover" />
        <div className="p-3">
          <h3 className="truncate font-semibold">{movie.title}</h3>
          <p className="text-sm text-[var(--muted)]">
            {movie.release_date?.slice(0, 4) || "N/A"} · ★ {movie.vote_average?.toFixed(1)}
          </p>
        </div>
        <WatchlistButton movie={movie} />
      </Link>
    </motion.article>
  );
}
