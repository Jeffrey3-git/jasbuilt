import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function ProjectModal({ projectId, onClose }) {
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch single project profile data on mount
  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to load project details.');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetails();
  }, [projectId]);

  // Handle live feedback submissions
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText }) // Matching our validated content schema key!
      });

      if (res.ok) {
        const newComment = await res.json();
        // Append comment locally instantly
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

  if (loading) return <div className="modal-overlay"><span className="loader">Analyzing Build...</span></div>;
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <header className="modal-header">
          <h2>{project.title}</h2>
          <p className="author-tag">Built by @{project.author?.username} ({project.author?.school})</p>
        </header>

        <div className="modal-body">
          <img src={project.imageUrl} alt={project.title} className="modal-hero-img" />
          <p className="description-text">{project.description}</p>
        </div>

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
}