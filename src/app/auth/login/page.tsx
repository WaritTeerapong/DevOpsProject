"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "4rem" }}>
      <h1 style={{ color: "var(--secondary)", textAlign: "center" }}>Login</h1>
      <form onSubmit={handleSubmit} className="card">
        {error && <p style={{ color: "#ff4d4d", fontSize: "0.9rem" }}>{error}</p>}
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
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          Don't have an account? <Link href="/auth/register" style={{ color: "var(--secondary)" }}>Register here</Link>
        </p>
      </form>
    </div>
  );
}
