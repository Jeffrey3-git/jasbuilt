import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UpvoteButton } from '../components/ui/UpvoteButton';

export function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:5000/api/users/profile/${username}`);
        if (!res.ok) throw new Error('Profile not found');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  if (loading) return <div className="loading">Loading Portfolio...</div>;
  if (!profile) return <div className="error">Developer profile not found.</div>;

  return (
    <div className="profile-container">
      <header className="profile-card">
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p className="username">@{profile.username}</p>
          <span className="badge-school">{profile.school}</span>
        </div>
        <div className="profile-stats">
          <div className="stat-box">
            <h3>{profile.projects?.length || 0}</h3>
            <p>Builds Shipped</p>
          </div>
        </div>
      </header>

      <section className="user-builds">
        <h3>Shipped Ecosystem Portfolio</h3>
        <div className="project-grid">
          {profile.projects?.map(project => (
            <article key={project.id} className="project-card">
              
              {/* 🛡️ IMAGE EDGE CASE FIX: Automatically falls back if link breaks */}
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="card-img"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'; // Sleek dark abstract placeholder
                }}
              />

              <div className="card-body">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                
                <div className="card-footer">
                  <UpvoteButton 
                    projectId={project.id} 
                    initialCount={project._count.upvotes}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}