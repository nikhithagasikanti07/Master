import React from 'react';

function History({ predictions }) {
  return (
    <>
      {predictions.map((row, index) => {
        const nutrients = JSON.parse(row.nutrients_json || '{}'); // Handle potential null or undefined

        return (
          <tr key={index}>
            <td>{row.prediction}</td>
            <td>{row.calories}</td>
            <td>{row.timestamp}</td>
            <td>
              <ul>
                {Object.entries(nutrients).map(([nutrient, value]) => (
                  <li key={nutrient}>
                    <strong>{nutrient}:</strong> {value}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default History;