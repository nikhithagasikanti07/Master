import React, { useEffect } from 'react';
import './Home.css'; // Assuming you'll name your main CSS file App.css

function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll('.scroll-animation');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect(); // Clean up the observer on unmount
    };
  }, []);

  return (
    <div className="app-container">
      <header className="header-container">
        <h1>SNACKALYZER</h1>
      </header>

      <main className="main-content">
        <section className="hero-section scroll-animation header">
          <div className="right-section">
            <h2 className="tagline">Your AI-powered nutrition companion for a healthier lifestyle</h2>
            <a href="/logina" className="start-btn get-started-button">
              Get Started
            </a>
          </div>
        </section>

        <section className="features-section scroll-animation">
          <h2>Why Choose SNACKALYZER</h2>
          <div className="features">
            <div className="feature-card scroll-animation">
              <img src="public\download.png" alt="AI Food Detection" className="feature-icon" />
              <h3>AI Food Detection</h3>
              <p>Simply take a photo of your meal and let our AI identify and analyze it for you.</p>
            </div>
            <div className="feature-card scroll-animation">
              <img src="public\goles.png" alt="Personalized Diet Plans" className="feature-icon" />
              <h3>Personalized Diet Plans</h3>
              <p>Get customized meal plans based on your goals and preferences.</p>
            </div>
            <div className="feature-card scroll-animation">
              <img src="public\support.png" alt="Progress Tracking" className="feature-icon" />
              <h3>Progress Tracking</h3>
              <p>Monitor your nutrition goals and track your progress over time.</p>
            </div>
            <div className="feature-card scroll-animation">
              <img src="public\ai.jpg" alt="AI Nutrition Assistant" className="feature-icon" />
              <h3>AI Nutrition Assistant</h3>
              <p>Get real-time advice and answers to your nutrition questions.</p>
            </div>
            <div className="feature-card scroll-animation">
              <img src="public\health.png" alt="Health Monitoring" className="feature-icon" />
              <h3>Health Monitoring</h3>
              <p>Track calories, macros, and other important health metrics.</p>
            </div>
            <div className="feature-card scroll-animation">
              <img src="public\smart.jpg" alt="Smart Reminders" className="feature-icon" />
              <h3>Smart Reminders</h3>
              <p>Get timely reminders for meals and water intake.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer scroll-animation">
        <p>© 2025 SNACKALYZER. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;