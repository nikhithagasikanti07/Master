import React from 'react';
import './About.css'; // Import the CSS file

function About() {
  return (
    <div className="about-us-page">
      <nav>
        <a href="/">Home</a>
        <a href="/health">Health</a>
        <a href="/solution">Solution</a>
        <a href="/image">Image</a>
        <a href="/text">Text</a>
        <a href="/history">History</a>
        <a href="/about">About</a>
        <a href="/logout">Logout</a>
      </nav>

      <div className="about-container">
        <h1>ABOUT US</h1>

        <div className="box-container">
          <section className="box">
            <h2>Our Mission</h2>
            <p>
              Our mission is to empower individuals with AI-driven nutritional insights,
              helping them make healthier food choices through innovative technology.
            </p>
          </section>
        </div>

        <div className="box-container">
          <section className="box">
            <h2>Our Vision</h2>
            <p>
              At <strong>SNACKALYZER</strong>, we envision a world where health and nutrition are accessible,
              personalized, and effortless for everyone.
            </p>
            <p>
              With the power of <strong>AI and machine learning</strong>, we aim to revolutionize how people track
              calorie intake and understand nutrition.
            </p>
          </section>
        </div>

        <div className="box-container">
          <section className="box">
            <h2>Our Core Values</h2>
            <ul>
              <li><strong>Empower Users:</strong> AI-powered insights for better dietary decisions.</li>
              <li><strong>Simplify Nutrition:</strong> Smart food recognition for effortless tracking.</li>
              <li><strong>Promote Wellness:</strong> Support weight loss, muscle gain, and balanced eating.</li>
            </ul>
          </section>
        </div>

        <div className="box-container">
          <section className="box">
            <h2>Our Commitment</h2>
            <p>
              By blending <strong>innovation with nutrition</strong>, we’re building a smarter, healthier future—one meal at a time.
            </p>
          </section>
        </div>

        <div className="about-section">
          <div className="faq-with-image">
            <div className="faq-container">
              <h2 className="faq-heading">Frequently Asked Questions</h2>
              <div className="faq-list">
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>What is AI-Powered Calorie and Nutrition Estimation?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>It uses AI to identify food items and estimate their calorie and nutrient content.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>Can users input food images or names manually?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>Yes, users can either upload an image or manually enter the name.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>Is this platform free to use?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>Yes, our platform is free for all users to explore.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>Which AI tool is used in this?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>Convolutional Neural Network (CNN) for food image classification due to its accuracy in visual pattern recognition.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>What kind of foods are supported?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>The system supports common food items available in public datasets or APIs. It may not work accurately with complex or rare dishes.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>Can it identify homemade or mixed dishes?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>Not accurately. The model struggles with mixed or multi-item dishes, especially if they are not visually distinct or labeled.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>How accurate is the calorie estimation?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>For individual food items, the system provides reasonably accurate results (approx. 65–75%) based on standard nutritional databases.</p>
                </div>
                <div className="faq">
                  <div className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                    <h3>Can this project be used in mobile apps or health platforms?</h3><span className="toggle-icon">+</span>
                  </div>
                  <p>Yes, it can be integrated into mobile apps or web platforms with further development and API support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-column">
            <h3>Solutions</h3>
            <ul>
              <li>Food Recognition API</li>
              <li>Azumio 360 API</li>
              <li>Instant Diabetes Test</li>
              <li>Diabetes Management</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li>About</li>
              <li>Team</li>
              <li>Jobs</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>More</h3>
            <ul>
              <li>Contact</li>
              <li>Blog</li>
              <li>Privacy Policy & Terms of Use</li>
            </ul>
          </div>
        </footer>
      </div>

      <script>
        {`
          function toggleFAQ(el) {
            const faq = el.parentElement;
            const isActive = faq.classList.contains("active");
            document.querySelectorAll(".faq").forEach(f => f.classList.remove("active"));
            if (!isActive) faq.classList.add("active");
          }
        `}
      </script>
    </div>
  );
}

function toggleFAQ(el) {
  const faq = el.parentElement;
  const isActive = faq.classList.contains("active");
  document.querySelectorAll(".faq").forEach(f => f.classList.remove("active"));
  if (!isActive) faq.classList.add("active");
}

export default About;