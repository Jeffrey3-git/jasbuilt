import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Leaderboard() {
  const [rankedBuilds, setRankedBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/projects/leaderboard`); // Fixed pathway pointing directly to project aggregates
        if (!res.ok) throw new Error('Could not pull standings.');
        const data = await res.json();
        setRankedBuilds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="feed-status-wrapper"><div className="spinner"></div><p>Calculating standings...</p></div>;

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <span className="tag-pill-orange">Standings</span>
        <h1>Ecosystem Leaderboard</h1>
        <p>The most upvoted software applications built across local campuses this week.</p>
      </header>

      <div className="leaderboard-list">
        {rankedBuilds.length === 0 ? (
          <div className="feed-status-wrapper empty-state">
            <h3>No entries ranked yet 🌌</h3>
            <p>Upvote projects on the main feed to build up the standings list!</p>
          </div>
        ) : (
          rankedBuilds.map((project, index) => {
            const rank = index + 1;
            return (
              <div key={project.id} className={`leaderboard-row rank-${rank}`}>
                <div className="rank-badge-col">
                  <span className="rank-number">#{rank}</span>
                </div>
                
                <img src={project.imageUrl} alt="" className="row-thumb" />

                <div className="project-details-col">
                  <h3>{project.title}</h3>
                  <p>by <Link to={`/profile/${project.author?.username}`}>@{project.author?.username}</Link> — <span className="school-text">{project.author?.school}</span></p>
                </div>

                <div className="metrics-col">
                  <div className="metric-pill upvotes">
                    🔺 {project._count?.upvotes || 0} Votes
                  </div>
                  <div className="metric-pill comments">
                    💬 {project._count?.comments || 0} Comments
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
