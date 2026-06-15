import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TECH_TAGS } from '../../../../packages/shared/src/index';

export const Submit = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return setError('Please upload a project screenshot.');
    if (selectedTags.length === 0) return setError('Please select at least one tech tag.');

    setSubmitting(true);
    setError('');

    // Tech Industry Standard: Creating an instance of FormData to stream binary files
    const submissionPayload = new FormData();
    submissionPayload.append('title', formData.title);
    submissionPayload.append('description', formData.description);
    submissionPayload.append('githubUrl', formData.githubUrl);
    submissionPayload.append('liveUrl', formData.liveUrl);
    submissionPayload.append('image', imageFile); // Drops our binary stream file right in
    submissionPayload.append('tags', JSON.stringify(selectedTags)); // Stringify arrays for multiform parse streams

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Pass our shield token
          // Note: DO NOT set 'Content-Type' header here. The browser automatically handles it for FormData with boundary markers.
        },
        body: submissionPayload,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to submit project.');

      navigate('/'); // Return successfully back home to the product feed
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-container">
      <form onSubmit={handleSubmit} className="submit-card">
        <h2>Ship Your Build 🚀</h2>
        <p>Showcase your project to student developers across Ghana.</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Project Title</label>
          <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g., JASBOT" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" required value={formData.description} onChange={handleInputChange} placeholder="What does your app do? Who is it for? What did you learn?" rows="4" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>GitHub Repository URL</label>
            <input type="url" name="githubUrl" required value={formData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label>Live Demo URL (Optional)</label>
            <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} placeholder="https://..." />
          </div>
        </div>

        <div className="form-group">
          <label>Project Screenshot (16:9 Aspect Ratio recommended)</label>
          <input type="file" accept="image/*" required onChange={handleFileChange} className="file-input" />
        </div>

        <div className="form-group">
          <label>Select Technology Stack Tags</label>
          <div className="tags-grid">
            {TECH_TAGS.map(tag => (
              <button type="button" key={tag} className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`} onClick={() => handleTagToggle(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-submit">
          {submitting ? 'Uploading to Hub...' : 'Publish Project'}
        </button>
      </form>
    </div>
  );
};