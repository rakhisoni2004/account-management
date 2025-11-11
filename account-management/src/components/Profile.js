import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = updateProfile(formData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
    setMessage('');
    setError('');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h2 className="gradient-text">Profile</h2>
            <p className="text-muted mb-0">Manage your account information</p>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm"
          >
            Logout
          </button>
        </div>
        
        <div className="card-body">
          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                className="form-control"
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Member Since</label>
              <input
                type="text"
                className="form-control"
                value={new Date(user?.createdAt).toLocaleDateString()}
                disabled
              />
            </div>
            
            <div className="d-flex gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;