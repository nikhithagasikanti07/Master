import React, { useState, useEffect } from 'react';
import './Solution.css'; // Import the CSS file

const Solution = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setNavHidden(true); // Hide on scroll down
      } else {
        setNavHidden(false); // Show on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <nav style={{ display: navHidden ? 'none' : 'flex' }}>
        <a href="/">Home</a>
        <a href="/health">Health</a>
        <a href="/solution">Solution</a>
        <a href="/predicta">Image</a>
        <a href="/predictb">Text</a>
        <a href="/predictc">History</a>
        <a href="/about">About</a>
        <a href="/logout">Logout</a>
      </nav>
      <div className="calorie-points-container">
        <ul className="calorie-points-list">
          <li className="calorie-point-item">
            Balanced Diet: Focus on a balanced intake of proteins, carbohydrates,
            and fats.
          </li>
          <li className="calorie-point-item">
            Detailed Activity: Advanced tracking captures daily nuances, even varied
            schedules.
          </li>
          <li className="calorie-point-item">
            Exercise: Practise yoga, walking and strength training.
          </li>
          <li className="calorie-point-item">
            Body Composition: Considers muscle-to-fat ratio, beyond just weight.
          </li>
          <li className="calorie-point-item">
            Goal-Driven: Calories tailored to specific weight or performance
            goals.
          </li>
          <li className="calorie-point-item">
            Calorie Awareness: Understand your daily calorie needs to manage
            weight effectively.
          </li>
          <li className="calorie-point-item">
            Portion Control: Be mindful of portion sizes to avoid overeating.
          </li>
          <li className="calorie-point-item">
            Hydration: Drink plenty of water throughout the day.
          </li>
          <li className="calorie-point-item">
            Whole Foods: Prioritize whole, unprocessed foods over processed
            options.
          </li>
        </ul>
      </div>
    </>
  );
};

export default Solution;
