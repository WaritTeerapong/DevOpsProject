"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CharacterDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && id) {
      fetch(`/api/characters/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
            router.push("/dashboard");
          } else {
            setCharacter(data);
          }
          setLoading(false);
        });
    }
  }, [session, id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this legend?")) return;

    const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Character deleted.");
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("Failed to delete.");
    }
  };

  if (loading) return <div className="container">Loading Character Sheet...</div>;
  if (!character) return null;

  return (
    <div className="container">
      <div className="card" style={{ position: "relative" }}>
        <button 
          onClick={() => router.push("/dashboard")}
          style={{ position: "absolute", top: "1rem", left: "1rem", background: "transparent", border: "none", color: "var(--secondary)", cursor: "pointer" }}
        >
          ← Back to Dashboard
        </button>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h1 style={{ color: "var(--secondary)", fontSize: "3rem", margin: 0 }}>{character.name}</h1>
          <p style={{ fontSize: "1.2rem", color: "#aaa" }}>{character.race} {character.class}</p>
        </div>

        <div className="stats-grid" style={{ margin: "3rem 0" }}>
          {Object.entries(character.stats).map(([stat, val]: any) => (
            <div key={stat} className="stat-box" style={{ padding: "1.5rem" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--secondary)", textTransform: "uppercase" }}>{stat}</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{val}</div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Modifier: {Math.floor((val - 10) / 2) >= 0 ? `+${Math.floor((val - 10) / 2)}` : Math.floor((val - 10) / 2)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", display: "flex", justifyContent: "space-between" }}>
          <div>
             <h3 style={{ color: "var(--secondary)" }}>Background & Skills</h3>
             <p>No custom background story yet.</p>
          </div>
          <button 
            className="button" 
            style={{ background: "#444", color: "#ff4d4d", alignSelf: "flex-end" }}
            onClick={handleDelete}
          >
            Delete Character
          </button>
        </div>
      </div>
    </div>
  );
}
