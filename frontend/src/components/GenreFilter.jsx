const GENRES = [
  { id: "", name: "All" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 16, name: "Animation" },
];

export default function GenreFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((g) => (
        <button
          key={g.name}
          onClick={() => onSelect(g.id)}
          className={`rounded-full px-3 py-1 text-sm ${
            selected === g.id
              ? "bg-[var(--accent)] text-[var(--accent-ink)]"
              : "bg-[var(--surface)] text-[var(--muted)]"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
