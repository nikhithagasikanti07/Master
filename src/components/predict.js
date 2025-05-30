import React from 'react';
import './predict.css'; // Import the CSS

function Predict() {
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
        <h1>Upload Food Image for Prediction</h1>
        <form id="uploadForm" className="upload-form" action="/predict" method="POST" encType="multipart/form-data">
          <input type="file" id="imageInput" name="image" required />
          <div className="upload-btn">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Predict;
