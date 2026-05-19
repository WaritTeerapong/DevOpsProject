"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        router.push("/auth/login");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "4rem" }}>
      <h1 style={{ color: "var(--secondary)", textAlign: "center" }}>Register</h1>
      <form onSubmit={handleSubmit} className="card">
        {error && <p style={{ color: "#ff4d4d", fontSize: "0.9rem" }}>{error}</p>}
        <div style={{ marginBottom: "1rem" }}>
          <label>Display Name</label>
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. DungeonMaster99"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            className="input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="button" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          Already have an account? <Link href="/auth/login" style={{ color: "var(--secondary)" }}>Login here</Link>
        </p>
      </form>
    </div>
  );
}
