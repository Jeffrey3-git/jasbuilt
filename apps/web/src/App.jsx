import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Submit } from './pages/Submit';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? children
    : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />} />

          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <Submit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:username"
            element={<Profile />}
          />

          <Route
            path="/leaderboard"
            element={<Leaderboard />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;