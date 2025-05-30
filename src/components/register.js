import React from 'react';
import './register.css'; // Import the CSS file

function Register() {
  return (
    <div className="container">
      <h2>Register</h2>
      <form action="./register" method="post">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <input type="submit" id="signup" value="Register" />

        <div>
          <p>
            Already have an account? <a href="/logina">Login here</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
