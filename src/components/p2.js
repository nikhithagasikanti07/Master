import React from 'react';
import './p2.css'; // Import the CSS

function P2() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
        <a href="/health">Health</a>
        <a href="/solution">Solution</a>
        <a href="/predicta">Image</a>
        <a href="/predictb">Text</a>
        <a href="/predictc">History</a>
        <a href="/about">About</a>
        <a href="/logout">Logout</a>
      </nav>

      <div className="container">
        <h1>Food Name for Prediction</h1>
        <form id="uploadForm" className="upload-form" action="/predict2" method="POST" encType="multipart/form-data">
          <label htmlFor="dishname">Enter Dish Name:</label>
          <input type="text" name="dishname" required />
          <div className="upload-btn">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </>
  );
}

export default P2;
