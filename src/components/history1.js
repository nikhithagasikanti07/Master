import React from 'react';
import history from './history'; // Adjust the path as needed

function History1({ apiPredictionsData }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Prediction</th>
          <th>Calories</th>
          <th>Timestamp</th>
          <th>Nutrients</th>
        </tr>
      </thead>
      <tbody>
        <PredictionTable predictions={apiPredictionsData} />
      </tbody>
    </table>
  );
}

export default History1;