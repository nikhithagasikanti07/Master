import React from 'react';
import './predict2.css'; // Import the CSS

function Predict2({ predictions, predictions2 }) {
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
        <h1>History</h1>

        <h2>📸 Image-Based Predictions</h2>
        {predictions && predictions.length > 0 ? (
          <table border="1" cellPadding="10" cellSpacing="0" style={{ background: 'white', color: 'black', width: '80%', margin: 'auto' }}>
            <thead>
              <tr>
                <th>Prediction</th>
                <th>Image</th>
                <th>Nutrients</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((row, index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>
                    <img src={row[1]} alt="Image" width="100" />
                  </td>
                  <td>
                    <pre>{row[2]}</pre>
                  </td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No image-based predictions found.</p>
        )}

        <h2>📝 Text-Based Predictions</h2>
        {predictions2 && predictions2.length > 0 ? (
          <table border="1" cellPadding="10" cellSpacing="0" style={{ background: 'white', color: 'black', width: '80%', margin: 'auto', marginTop: '30px' }}>
            <thead>
              <tr>
                <th>Dish Name</th>
                <th>Nutrients</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {predictions2.map((row, index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>
                    <pre>{row[1]}</pre>
                  </td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No text-based predictions found.</p>
        )}
      </div>
    </>
  );
}

export default Predict2;
