"use client";

import { useEffect, useState } from "react";
import "./globals.css";

interface Standing {
  rank: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/standings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStandings(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Premier League Standings</h1>
      </header>
      
      {loading ? (
        <p>Loading table...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Club</th>
              <th>Pl</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr key={s.name}>
                <td>{s.rank}</td>
                <td><strong>{s.name}</strong></td>
                <td>{s.played}</td>
                <td>{s.won}</td>
                <td>{s.drawn}</td>
                <td>{s.lost}</td>
                <td>{s.gf}</td>
                <td>{s.ga}</td>
                <td>{s.gd > 0 ? `+${s.gd}` : s.gd}</td>
                <td><strong>{s.points}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
