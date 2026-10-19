import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { fetchWatchlist, reset } from "./store/watchlistSlice.js";

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-6xl px-4 py-8"
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();

  // Load the user's watchlist from the API on login, clear it on logout
  useEffect(() => {
    if (user) dispatch(fetchWatchlist());
    else dispatch(reset());
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/movie/:id" element={<Page><MovieDetails /></Page>} />
          <Route path="/watchlist" element={<Page><Watchlist /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <ToastContainer position="bottom-right" autoClose={2000} theme={theme} />
    </>
  );
}
