import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatUpvoteCount } from '../../../../../packages/shared/src/index';

export const UpvoteButton = ({ projectId, initialCount, initialHasUpvoted }) => {
  const { token, isAuthenticated } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpvoteClick = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || isSyncing) return;

    const previousCount = count;
    const previousHasUpvoted = hasUpvoted;

    setCount(hasUpvoted ? count - 1 : count + 1);
    setHasUpvoted(!hasUpvoted);
    setIsSyncing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${projectId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Upvote failed');
      }

      const data = await response.json();
      setHasUpvoted(data.upvoted);
    } catch (error) {
      console.error('Rolling back optimistic vote update:', error);
      setCount(previousCount);
      setHasUpvoted(previousHasUpvoted);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      className={`upvote-action-pill ${hasUpvoted ? 'active' : ''}`}
      onClick={handleUpvoteClick}
      disabled={!isAuthenticated || isSyncing}
      title={!isAuthenticated ? 'Log in to upvote builds' : hasUpvoted ? 'Remove upvote' : 'Upvote this project'}
      style={{ cursor: isAuthenticated ? 'pointer' : 'not-allowed' }}
    >
      <span className="arrow">▲</span>
      <span className="count">{formatUpvoteCount(count)}</span>
    </button>
  );
};
