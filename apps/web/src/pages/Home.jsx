import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, MessageCircle, SearchX, Sparkles, MessageSquareText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GH_SCHOOLS, TECH_TAGS } from '../../../../packages/shared/src/index';
import { ProjectModal } from '../components/ui/ProjectModal';
import { UpvoteButton } from '../components/ui/UpvoteButton';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [seekingFeedbackOnly, setSeekingFeedbackOnly] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      try {
        const queryParams = new URLSearchParams();

        if (selectedSchool) queryParams.append('school', selectedSchool);
        if (selectedTag) queryParams.append('tag', selectedTag);
        if (seekingFeedbackOnly) queryParams.append('seekingFeedback', 'true');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects?${queryParams.toString()}`
        );

        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed fetching ecosystem stream:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedSchool, selectedTag, seekingFeedbackOnly]);

  // Client-side instant search
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    return (
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.author?.username?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="home-feed-container">
      {/* Hero Header Area */}
      <header className="feed-hero">
        <div className="hero-content">
          <span className="badge">Ecosystem Feed</span>
          <h1>The Product Hunt for Ghanaian Student Devs</h1>
          <p>
            Discover, explore, and support software applications being built
            across local universities.
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/submit" className="btn-ship">
            <span>Ship Something</span>
            <Rocket size={16} strokeWidth={2.25} />
          </Link>
        )}
      </header>

      {/* Filter Control Board */}
      <section className="filter-bar">
        <div className="filter-group search-group">
          <label>Search Projects</label>
          <input
            type="text"
            placeholder="Search projects, features, or developers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Filter Institution</label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
          >
            <option value="">All Schools</option>

            {GH_SCHOOLS.map((school) => (
              <option key={school.id} value={school.id}>
                {school.id} — {school.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter Tech Stack</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Technologies</option>

            {TECH_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <label className="feedback-filter-toggle">
          <input
            type="checkbox"
            checked={seekingFeedbackOnly}
            onChange={(e) => setSeekingFeedbackOnly(e.target.checked)}
          />
          <MessageSquareText size={14} strokeWidth={2.25} />
          Seeking Feedback
        </label>
      </section>

      {/* Projects Grid Execution */}
      {loading ? (
        <div className="feed-status-wrapper">
          <div className="spinner"></div>
          <p>Loading the latest builds...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="feed-status-wrapper empty-state">
          <Sparkles size={28} strokeWidth={1.75} className="empty-state-icon" />
          <h3>No builds shipped here yet</h3>
          <p>Be the first to break the ice for this tech category!</p>

          {!isAuthenticated && (
            <Link to="/auth" className="btn-text-link">
              Create an account to get started
            </Link>
          )}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="feed-status-wrapper empty-state">
          <SearchX size={28} strokeWidth={1.75} className="empty-state-icon" />
          <h3>No matching projects found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <main className="projects-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              onClick={() => setSelectedProjectId(project.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-image-wrapper">
                <img
                  src={project.imageUrl}
                  alt={`${project.title} screenshot`}
                  loading="lazy"
                />
                <span className="school-badge">
                  {project.author.school}
                </span>
              </div>

              <div className="card-body">
                <div className="card-header">
                  <div className="card-title-row">
                    <h3>{project.title}</h3>
                    {project.feedbackRequest && (
                      <span className="feedback-request-badge">
                        <MessageSquareText size={12} strokeWidth={2.25} />
                        Seeking feedback
                      </span>
                    )}
                  </div>
                  <p className="author-tag">
                    by @{project.author.username}
                  </p>
                </div>

                <p className="card-description">
                  {project.description}
                </p>

                <div className="card-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div
                  className="card-footer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="stats-group">
                    <UpvoteButton
                      projectId={project.id}
                      initialCount={project._count.upvotes}
                      initialHasUpvoted={project.upvotes?.length > 0}
                    />

                    <span className="stat-pill comment-pill">
                      <MessageCircle size={14} strokeWidth={2.25} />
                      {project._count.comments}
                    </span>
                  </div>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-github-link"
                  >
                    View Code ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}

      {selectedProjectId && (
        <ProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};
