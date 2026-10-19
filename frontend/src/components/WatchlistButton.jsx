import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { addToWatchlist, removeFromWatchlist } from "../store/watchlistSlice.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function WatchlistButton({ movie }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const saved = useSelector((s) => s.watchlist.items.some((m) => m.id === movie.id));

  const handleClick = async (e) => {
    e.preventDefault(); // button sits inside a Link
    if (!user) {
      toast.info("Log in to save movies");
      navigate("/login");
      return;
    }
    try {
      if (saved) {
        await dispatch(removeFromWatchlist(movie.id)).unwrap();
        toast.warn("Removed from watchlist");
      } else {
        await dispatch(addToWatchlist(movie)).unwrap();
        toast.success("Added to watchlist");
      }
    } catch {
      toast.error("Couldn't reach the server. Try again.");
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      animate={{ scale: saved ? [1, 1.5, 1] : 1 }}
      whileTap={{ scale: 0.85 }}
      className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-lg text-white"
    >
      {saved ? "♥" : "♡"}
    </motion.button>
  );
}
