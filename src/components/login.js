import React from 'react';
import './login.css'; // Import the CSS file

function Login() {
  return (
    <div className="login-container">
      <header>SNACKALYZER</header>
      <h2>Login</h2>
      <form action="/login" method="post">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <input type="submit" value="Login" />

        <div className="forgot-password">
          <p>
            <a href="/ForgotPassword">Forgot Password?</a>
          </p>
        </div>

        <div className="register-link">
          <p>
            Don't have an account? <a href="/registera">Create New Account</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;