import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GH_SCHOOLS, TECH_TAGS, formatUpvoteCount } from '../../../../packages/shared/src/index';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Construct clean query parameters dynamically
        const queryParams = new URLSearchParams();
        if (selectedSchool) queryParams.append('school', selectedSchool);
        if (selectedTag) queryParams.append('tag', selectedTag);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects?${queryParams.toString()}`
        );
        const data = await response.json();
        if (response.ok) setProjects(data);
      } catch (error) {
        console.error('Failed fetching ecosystem stream:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedSchool, selectedTag]); // Refetch automatically whenever filters change

  return (
    <div className="home-feed-container">
      {/* Hero Header Area */}
      <header className="feed-hero">
        <div className="hero-content">
          <span className="badge">Ecosystem Feed</span>
          <h1>The Product Hunt for Ghanaian Student Devs</h1>
          <p>Discover, explore, and support software applications being built across local universities.</p>
        </div>
        {isAuthenticated && (
          <Link to="/submit" className="btn-ship">
            <span>Ship Something</span> 🚀
          </Link>
        )}
      </header>

      {/* Filter Control Board */}
      <section className="filter-bar">
        <div className="filter-group">
          <label>Filter Institution</label>
          <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
            <option value="">All Schools</option>
            {GH_SCHOOLS.map(school => (
              <option key={school.id} value={school.id}>{school.id} — {school.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter Tech Stack</label>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">All Technologies</option>
            {TECH_TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Projects Grid Execution */}
      {loading ? (
        <div className="feed-status-wrapper">
          <div className="spinner"></div>
          <p>Loading the latest builds...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="feed-status-wrapper empty-state">
          <h3>No builds shipped here yet 🌌</h3>
          <p>Be the first to break the ice for this tech category!</p>
          {!isAuthenticated && <Link to="/auth" className="btn-text-link">Create an account to get started</Link>}
        </div>
      ) : (
        <main className="projects-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="card-image-wrapper">
                <img src={project.imageUrl} alt={`${project.title} screenshot`} loading="lazy" />
                <span className="school-badge">{project.author.school}</span>
              </div>

              <div className="card-body">
                <div className="card-header">
                  <h3>{project.title}</h3>
                  <p className="author-tag">by @{project.author.username}</p>
                </div>

                <p className="card-description">{project.description}</p>

                <div className="card-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tech-tag">#{tag}</span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="stats-group">
                    <span className="stat-pill upvote-pill">
                      ▲ {formatUpvoteCount(project._count.upvotes)}
                    </span>
                    <span className="stat-pill comment-pill">
                      💬 {project._count.comments}
                    </span>
                  </div>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-github-link">
                    View Code ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
};