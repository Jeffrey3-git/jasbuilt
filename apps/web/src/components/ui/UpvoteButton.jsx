import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const UpvoteButton = ({ projectId, initialCount, initialHasUpvoted }) => {
  const { token, isAuthenticated } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpvoteClick = async (e) => {
    e.preventDefault(); // Prevent accidental page bubbling/navigation actions
    
    if (!isAuthenticated) {
      alert('Please log in to upvote student projects! 🚀');
      return;
    }

    if (isSyncing) return; // Prevent double-click network spamming

    // --- THE OPTIMISTIC UI FLIP ---
    // Change states instantly before the network response arrives
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
        throw new Error('Network synchronization sync failed.');
      }
      
      const data = await response.json();
      // Ensure local state perfectly reflects the server's definitive response
      // ✅ FIX: Changed from data.hasUpvoted to data.upvoted to match server payload
      setHasUpvoted(data.upvoted);
    } catch (error) {
      // --- THE ROLLBACK ---
      // If the internet cut out, silently undo our optimistic assumptions
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
      title={hasUpvoted ? "Remove upvote" : "Upvote this project"}
    >
      <span className="arrow">▲</span>
      <span className="count">{count}</span>
    </button>
  );
};
