"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
}

export default function ChallengesPage() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (challengeId: string) => {
    if (!session) {
      alert("Please login first");
      return;
    }

    const res = await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        challengeId,
        submittedFlag: flags[challengeId],
      }),
    });

    const result = await res.json();
    if (result.isCorrect) {
      alert("Success! Points added.");
      window.location.reload(); // Simple way to update score in Navbar
    } else {
      alert(result.message);
    }
  };

  if (loading) return <div>Loading challenges...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Challenges</h1>
      <div className="grid">
        {challenges.map((c) => (
          <div key={c.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{c.title}</h3>
              <span style={{ color: "var(--primary)" }}>{c.points} pts</span>
            </div>
            <p style={{ margin: "1rem 0", color: "#aaa" }}>{c.category}</p>
            <p style={{ marginBottom: "1.5rem" }}>{c.description}</p>
            
            <input
              type="text"
              className="input"
              placeholder="CTF{flag_here}"
              value={flags[c.id] || ""}
              onChange={(e) => setFlags({ ...flags, [c.id]: e.target.value })}
            />
            <button
              className="button"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => handleSubmit(c.id)}
            >
              Submit Flag
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
