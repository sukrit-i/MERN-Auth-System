import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { verifyEmail, sendVerifyOtp, user } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    setSendingOtp(true);

    const result = await sendVerifyOtp();
    
    if (result.success) {
      setSuccess('Verification code sent to your email!');
    } else {
      setError(result.message);
    }
    
    setSendingOtp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    const result = await verifyEmail(otp);
    
    if (result.success) {
      setSuccess('Email verified successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
            <h1>Verify Your Email</h1>
            <p>We've sent a verification code to <strong>{user?.email}</strong></p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button 
              type="button"
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              onClick={handleSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? 'Sending...' : 'Resend Code'}
            </button>
          </form>

          <div className="form-footer">
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ 
                background: 'none', 
                color: 'var(--text-muted)', 
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;