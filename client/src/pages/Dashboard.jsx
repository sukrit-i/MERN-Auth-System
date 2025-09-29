import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="container">
        <div className="dashboard fade-in">
          <div className="dashboard-header">
            <h1>Welcome back, <span className="gradient-text">{user?.name}</span>!</h1>
            <p>Here's your account overview</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card card">
              <div className="card-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3>Profile Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-card card">
              <div className="card-icon">
                {user?.isAccountVerified ? (
                  <svg width="32" height="32" fill="none" stroke="var(--success)" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" fill="none" stroke="var(--warning)" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                )}
              </div>
              <h3>Account Status</h3>
              {user?.isAccountVerified ? (
                <div className="status-verified">
                  <div className="status-badge success">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Verified
                  </div>
                  <p className="status-text">Your email is verified and your account is fully active.</p>
                </div>
              ) : (
                <div className="status-unverified">
                  <div className="status-badge warning">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Unverified
                  </div>
                  <p className="status-text">Please verify your email to unlock all features.</p>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '1rem', width: '100%' }}
                    onClick={() => navigate('/verify-email')}
                  >
                    Verify Email
                  </button>
                </div>
              )}
            </div>

            <div className="dashboard-card card">
              <div className="card-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3>Security</h3>
              <p className="card-description">Your account is protected with industry-standard security measures.</p>
              <ul className="security-features">
                <li>✓ Password encryption</li>
                <li>✓ Secure session management</li>
                <li>✓ HTTP-only cookies</li>
              </ul>
            </div>

            <div className="dashboard-card card">
              <div className="card-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                {!user?.isAccountVerified && (
                  <button 
                    className="action-button"
                    onClick={() => navigate('/verify-email')}
                  >
                    Verify Email
                  </button>
                )}
                <button 
                  className="action-button"
                  onClick={() => navigate('/reset-password')}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
