import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquareText, Link as LinkIcon, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ProjectDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProjectDetails() {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to load project details.');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetails();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/projects/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (res.ok) {
        const newComment = await res.json();
        setProject(prev => ({
          ...prev,
          comments: [newComment, ...prev.comments]
        }));
        setCommentText('');
      }
    } catch (err) {
      console.error('Comment failed to post:', err);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="project-detail-container">
        <span className="loader">Analyzing Build...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-container">
        <p className="not-found">Project not found.</p>
        <Link to="/" className="btn-text-link">Back to feed</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="detail-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} strokeWidth={2.25} />
          Back to feed
        </Link>

        <header className="detail-header">
          <h1>{project.title}</h1>
          <div className="detail-header-meta">
            <p className="author-tag">Built by @{project.author?.username} ({project.author?.school})</p>
            <button className="btn-copy-link" onClick={handleCopyLink}>
              {copied ? <Check size={14} strokeWidth={2.25} /> : <LinkIcon size={14} strokeWidth={2.25} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </header>

        <div className="detail-body">
          <img src={project.imageUrl} alt={project.title} className="detail-hero-img" />
          <p className="description-text">{project.description}</p>
        </div>

        {project.feedbackRequest && (
          <div className="feedback-request-callout">
            <MessageSquareText size={16} strokeWidth={2.25} />
            <div>
              <strong>Looking for feedback on:</strong>
              <p>{project.feedbackRequest}</p>
            </div>
          </div>
        )}

        <section className="comments-section">
          <h3>Feedback Stream ({project.comments?.length || 0})</h3>

          {token ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                placeholder="Leave feedback on this student build..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button type="submit">Send ↗</button>
            </form>
          ) : (
            <p className="login-prompt">Log in to leave feedback for this developer.</p>
          )}

          <div className="comments-list">
            {project.comments?.map(comment => (
              <div key={comment.id} className="comment-item">
                <strong>@{comment.user?.username}</strong>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
