import React, { useState } from 'react';
import './ForgotPassword.css'; // Import the CSS file

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = () => {
    // In a real application, you would send a reset code to the email.
    // For this example, we'll simulate it.
    setMessage({ text: 'A reset code has been sent to your email (use: 123456)', type: 'success' });
    sessionStorage.setItem('resetCode', '123456');
    setTimeout(() => setStep(2), 1000);
  };

  const handleCodeSubmit = () => {
    const storedCode = sessionStorage.getItem('resetCode');
    if (code === storedCode) {
      setMessage({ text: 'Code verified. Please enter your new password.', type: 'success' });
      setTimeout(() => setStep(3), 1000);
    } else {
      setMessage({ text: 'Invalid code. Please try again.', type: 'error' });
    }
  };

  const handlePasswordSubmit = () => {
    if (newPassword.length >= 6) {
      setMessage({ text: 'Password reset successfully!', type: 'success' });
      sessionStorage.removeItem('resetCode');
      setTimeout(() => {
        setStep(4);
        setTimeout(() => {
          window.location.href = "/logina"; // Replace with your actual login route
        }, 2000);
      }, 1000);
    } else {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="forgot-password-form">
            <h2>Forgot Password</h2>
            {message.text && <p className={message.type}>{message.text}</p>}
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleEmailSubmit}>Next</button>
          </div>
        );
      case 2:
        return (
          <div className="forgot-password-form">
            <h2>Enter Code</h2>
            {message.text && <p className={message.type}>{message.text}</p>}
            <input
              type="text"
              id="code"
              placeholder="Enter reset code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button onClick={handleCodeSubmit}>Verify</button>
          </div>
        );
      case 3:
        return (
          <div className="forgot-password-form">
            <h2>New Password</h2>
            {message.text && <p className={message.type}>{message.text}</p>}
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={handlePasswordSubmit}>Reset Password</button>
          </div>
        );
      case 4:
        return (
          <div className="forgot-password-form">
            <h2>Password Reset Successful</h2>
            {/* You can add a message or a link to the login page here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-container">
      {renderStep()}
    </div>
  );
}

export default ForgotPassword;