import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../src/hooks/useAuth';
import { UpvoteButton } from '../src/components/ui/UpvoteButton';

function renderWithAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe('UpvoteButton', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is disabled and prompts login when the user is not authenticated', async () => {
    renderWithAuth(<UpvoteButton projectId="p1" initialCount={5} initialHasUpvoted={false} />);

    const button = await screen.findByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('title', 'Log in to upvote builds');
    expect(screen.getByText('5')).toBeInTheDocument();

    fireEvent.click(button);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('is enabled and calls the upvote endpoint when the user is authenticated', async () => {
    localStorage.setItem('jasbuilt_token', 'fake-token');
    localStorage.setItem('jasbuilt_user', JSON.stringify({ id: 'u1', username: 'jas' }));
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ upvoted: true }) });

    renderWithAuth(<UpvoteButton projectId="p1" initialCount={5} initialHasUpvoted={false} />);

    const button = await screen.findByRole('button');
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    // Optimistic update happens immediately
    expect(screen.getByText('6')).toBeInTheDocument();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/api/projects/p1/upvote');
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer fake-token');
  });

  it('rolls back the optimistic update if the request fails', async () => {
    localStorage.setItem('jasbuilt_token', 'fake-token');
    localStorage.setItem('jasbuilt_user', JSON.stringify({ id: 'u1', username: 'jas' }));
    fetch.mockResolvedValueOnce({ ok: false });

    renderWithAuth(<UpvoteButton projectId="p1" initialCount={5} initialHasUpvoted={false} />);

    const button = await screen.findByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('6')).toBeInTheDocument(); // optimistic
    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument()); // rolled back
  });

  it('formats large counts with the shared formatter', async () => {
    localStorage.setItem('jasbuilt_token', 'fake-token');
    localStorage.setItem('jasbuilt_user', JSON.stringify({ id: 'u1', username: 'jas' }));

    renderWithAuth(<UpvoteButton projectId="p1" initialCount={1500} initialHasUpvoted={false} />);

    expect(await screen.findByText('1.5k')).toBeInTheDocument();
  });
});
