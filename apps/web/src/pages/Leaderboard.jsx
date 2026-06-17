import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Leaderboard() {
  const [rankedBuilds, setRankedBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leaderboard`
        );

        if (!res.ok) {
          throw new Error('Could not pull standings.');
        }

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

  if (loading) {
    return (
      <div className="feed-status-wrapper">
        <div className="spinner"></div>
        <p>Calculating standings...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <span className="badge">Standings</span>

        <h1>Ecosystem Leaderboard</h1>

        <p>
          The most upvoted software applications built across local campuses.
        </p>
      </header>

      <div className="leaderboard-list">
        {rankedBuilds.map((project, index) => {
          const rank = index + 1;

          return (
            <div
              key={project.id}
              className={`leaderboard-row rank-${rank}`}
            >
              <div className="rank-badge-col">
                <span className="rank-number">#{rank}</span>
              </div>

              <img
                src={project.imageUrl}
                alt={project.title}
                className="row-thumb"
              />

              <div className="project-details-col">
                <h3>{project.title}</h3>

                <p>
                  by{' '}
                  <Link to={`/profile/${project.author?.username}`}>
                    @{project.author?.username}
                  </Link>

                  {' '}—{' '}

                  <span className="school-text">
                    {project.author?.school}
                  </span>
                </p>
              </div>

              <div className="metrics-col">
                <div className="metric-pill upvotes">
                  🔺 {project._count?.upvotes || 0} Votes
                </div>

                <div className="metric-pill comments">
                  💬 {project._count?.comments || 0}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}