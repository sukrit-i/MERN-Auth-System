import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Secure Authentication
              <br />
              <span className="gradient-text">Made Simple</span>
            </h1>
            <p className="hero-description">
              Experience seamless, enterprise-grade authentication with email verification,
              password recovery, and robust security features built right in.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard">
                  <button className="btn btn-primary btn-large">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="btn btn-primary btn-large">
                      Get Started Free
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="btn btn-secondary btn-large">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15v2m0 4v2m3-5h10a1 1 0 011 1v8a1 1 0 01-1 1H9a1 1 0 01-1-1v-8a1 1 0 011-1h2zm0 0V9a4 4 0 118 0v4"/>
                </svg>
              </div>
              <h3>Secure Authentication</h3>
              <p>Industry-standard encryption and JWT tokens keep your data safe.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3>Email Verification</h3>
              <p>Verify user emails with OTP codes sent directly to their inbox.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 7a2 2 0 012-2m0 0a2 2 0 012 2m-2-2v2m-5 7h10m-5-2v2m0 0v2m-8 4h16a1 1 0 001-1V8a1 1 0 00-1-1H6a1 1 0 00-1 1v10a1 1 0 001 1z"/>
                </svg>
              </div>
              <h3>Password Recovery</h3>
              <p>Easy password reset flow with secure OTP verification.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3>Fast & Reliable</h3>
              <p>Built with modern technologies for lightning-fast performance.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3>Mobile Responsive</h3>
              <p>Perfectly optimized for all devices and screen sizes.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3>Cookie Security</h3>
              <p>HTTP-only cookies protect against XSS and CSRF attacks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;