"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  stats: any;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/characters")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCharacters(data);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) return <div className="container">Please login to view your characters.</div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>My Characters</h1>
        <button className="button">Create New</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {characters.map(c => (
            <div key={c.id} className="card">
              <h2 style={{ color: "var(--secondary)", margin: 0 }}>{c.name}</h2>
              <p style={{ margin: "0.5rem 0" }}>{c.race} {c.class}</p>
              
              <div className="stats-grid">
                {Object.entries(c.stats).map(([stat, val]: any) => (
                  <div key={stat} className="stat-box">
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>{stat.slice(0,3)}</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {characters.length === 0 && <p>No characters found. Embark on a journey and create one!</p>}
        </div>
      )}
    </div>
  );
}
