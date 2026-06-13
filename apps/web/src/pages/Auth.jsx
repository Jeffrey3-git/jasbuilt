import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GH_SCHOOLS } from '../../../../packages/shared/src/index'; // Import shared source of truth

export const Auth = ({ isRegisterMode = false }) => {
  const navigate = useNavigate();
  const { loginSession } = useAuth();
  const [isRegister, setIsRegister] = useState(isRegisterMode);
  
  // Single consolidated state object for form fields
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    school: GH_SCHOOLS[0].id // Default to the first school (UG)
  });
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    // Payload adaptation based on route criteria
    const payload = isRegister 
      ? formData 
      : { emailOrUsername: formData.email || formData.username, password: formData.password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication lifecycle failed.');
      }

      // Commit session to context mapping
      loginSession(data.user, data.token);
      navigate('/'); // Redirect straight to the home project feed
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isRegister ? 'Join JASBuilt' : 'Welcome Back'}</h2>
          <p>{isRegister ? 'Showcase your builds to the GH dev community' : 'See what Ghanaian student devs are shipping today'}</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Kofi Mensah" />
              </div>

              <div className="form-group">
                <label htmlFor="school">University / Institution</label>
                <select id="school" name="school" value={formData.school} onChange={handleInputChange}>
                  {GH_SCHOOLS.map((school) => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="username">{isRegister ? 'Choose Username' : 'Username or Email'}</label>
            <input 
              type="text" 
              id="username" 
              name={isRegister ? 'username' : 'email'} 
              required 
              value={isRegister ? formData.username : formData.email} 
              onChange={handleInputChange} 
              placeholder={isRegister ? 'jas' : 'kofi@ug.edu.gh or kofi_dev'} 
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="email">Institutional/Personal Email</label>
              <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="kofi@ug.edu.gh" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Processing Gateway...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};