import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './results.css'; // Import the CSS file
Chart.register(...registerables);

function Results({ prediction, image_path, nutrients }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (nutrients && chartRef.current) {
      const nutrientLabels = Object.keys(nutrients);
      const nutrientValues = Object.values(nutrients);

      const chartCtx = chartRef.current.getContext('2d');
        if (chartCtx) {
        new Chart(chartCtx, {
            type: 'bar',
            data: {
              labels: nutrientLabels,
              datasets: [{
                label: '',
                data: nutrientValues,
                backgroundColor: '#00b894'
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Nutritional Breakdown'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
    }
  }, [nutrients]);

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
        <h1>Prediction: {prediction}</h1>

        <div className="image-container">
          <h2>Uploaded Image</h2>
          <img src={image_path} alt="Uploaded Food Image" />
        </div>

        <div className="nutrient-text">
          <h2>Nutritional Information</h2>
          {nutrients &&
            Object.entries(nutrients).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
        </div>

        <div className="graph-container">
          <h2>Bar Chart</h2>
          <canvas id="barChart" ref={chartRef} />
        </div>
      </div>
    </>
  );
}

export default Results;
