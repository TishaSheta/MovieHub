import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const count = useSelector((s) => s.watchlist.items.length);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    navigate("/");
  };

  const link = ({ isActive }) =>
    `px-2 py-1 ${isActive ? "border-b-2 border-[var(--accent)]" : "text-[var(--muted)]"}`;

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3 shadow">
      <NavLink to="/" className="text-xl font-bold text-[var(--accent)]">
        MovieHub
      </NavLink>
      <div className="flex items-center gap-3 text-sm">
        <NavLink to="/" className={link} end>Browse</NavLink>
        <NavLink to="/watchlist" className={link}>Watchlist ({count})</NavLink>
        <button onClick={toggleTheme} className="rounded border border-[var(--muted)] px-2 py-1">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        {user ? (
          <button onClick={handleLogout} className="rounded bg-[var(--accent)] px-3 py-1 text-[var(--accent-ink)]">
            Log out ({user.name})
          </button>
        ) : (
          <NavLink to="/login" className="rounded bg-[var(--accent)] px-3 py-1 text-[var(--accent-ink)]">
            Log in
          </NavLink>
        )}
      </div>
    </nav>
  );
}
