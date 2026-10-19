import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Login successful");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Account created");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't reach the server");
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-3xl font-bold">{isRegister ? "Create account" : "Log in"}</h1>
      {isRegister && (
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full rounded bg-[var(--surface)] px-3 py-2" />
      )}
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full rounded bg-[var(--surface)] px-3 py-2" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password (min 6 characters)" required minLength={6} className="w-full rounded bg-[var(--surface)] px-3 py-2" />
      <button type="submit" disabled={loading} className="w-full rounded bg-[var(--accent)] px-3 py-2 font-semibold text-[var(--accent-ink)] disabled:opacity-60">
        {loading ? "Please wait…" : isRegister ? "Sign up" : "Log in"}
      </button>
      <button type="button" onClick={() => setMode(isRegister ? "login" : "register")} className="text-sm text-[var(--accent)]">
        {isRegister ? "Already have an account? Log in" : "New here? Create an account"}
      </button>
    </form>
  );
}
