import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-3 text-[var(--muted)]">This page doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block text-[var(--accent)]">Go to browse</Link>
    </div>
  );
}
