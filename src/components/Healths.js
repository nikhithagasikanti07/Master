import React, { useState } from 'react';
import './Healths.css';

const HealthForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    goals: [],
    reasons: [],
    motivation: '',
    willingToDo: [],
    gender: [],
    dateOfBirth: '',
    height: '',
    weight: '',
    dietaryRestrictions: [],
    dietaryOptions: [],
    medicalConditions: []
  });

  const steps = [
    'welcome',
    'muscleOrWeightGoal',
    'motivationLevel',
    'willingToDo',
    'profile',
    'dietaryRestrictions',
    'dietaryOptions',
    'medicalConditions',
    'completionStep'
  ];

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const backStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const finishForm = () => {
    setCurrentStepIndex(steps.indexOf('completionStep'));
  };

  const renderStep = () => {
    switch (steps[currentStepIndex]) {
      case 'welcome':
        return (
          <div className="form-step">
            <h2 style={{ color: 'black' }}>What brings you here?</h2>
            <div className="form-options">
              {[
                'Losing weight',
                'Gaining muscle and losing fat',
                'Gaining muscle, losing fat is secondary',
                'Eating healthier without losing weight'
              ].map((goal) => (
                <label key={goal} className="form-checkbox-label">
                  <span>{goal}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.goals.includes(goal)}
                    onChange={() => handleCheckboxChange('goals', goal)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'muscleOrWeightGoal':
        return (
          <div className="form-step">
            <h2 className="form-question">What are your reasons for this goal?</h2>
            <div className="form-options">
              {[
                'Feel better in my body',
                'Be healthier',
                'Get in shape',
                'Stop people from bothering me',
                'Fit in my old clothes',
                'Be more energetic',
                'Live longer',
                'For medical reason',
                'Other reasons'
              ].map((reason) => (
                <label key={reason} className="form-checkbox-label">
                  <span>{reason}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.reasons.includes(reason)}
                    onChange={() => handleCheckboxChange('reasons', reason)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'motivationLevel':
        return (
          <div className="form-step">
            <h2 className="form-question">How motivated are you to achieve your goal?</h2>
            <div className="form-options">
              {[
                'Very motivated',
                'Quite motivated',
                'Motivated',
                'Not motivated',
                'Not motivated at all'
              ].map((level) => (
                <label key={level} className="form-radio-label">
                  <span>{level}</span>
                  <input
                    type="radio"
                    name="motivation"
                    className="form-radio"
                    checked={formData.motivation === level}
                    onChange={() => handleRadioChange('motivation', level)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'willingToDo':
        return (
          <div className="form-step">
            <h2 className="form-question">What are you willing to do to achieve your goal?</h2>
            <div className="form-options">
              {[
                'Fast',
                'Follow a restrictive diet',
                'Do some physical activity',
                'Count calories'
              ].map((activity) => (
                <label key={activity} className="form-checkbox-label">
                  <span>{activity}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.willingToDo.includes(activity)}
                    onChange={() => handleCheckboxChange('willingToDo', activity)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="form-step">
            <h2 className="form-question">Tell us about yourself</h2>
            <div className="form-gender-options">
              {[
                'Male',
                'Female',
                'Non binary',
                'Prefer not to say',
                'Other'
              ].map((gender) => (
                <label key={gender} className="form-checkbox-label">
                  <span>{gender}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.gender.includes(gender)}
                    onChange={() => handleCheckboxChange('gender', gender)}
                  />
                </label>
              ))}
            </div>
            <label className="form-label">Date of Birth:</label>
            <input
              type="date"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-input"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
            />
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
            />
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'dietaryRestrictions':
        return (
          <div className="form-step">
            <h2 className="form-question">Do you have any dietary restrictions or food allergies?</h2>
            <div className="form-options">
              {['Yes', 'No'].map((option) => (
                <label key={option} className="form-checkbox-label">
                  <span>{option}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.dietaryRestrictions.includes(option)}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', option)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'dietaryOptions':
        return (
          <div className="form-step">
            <h2 className="form-question">Which restrictions/allergies do you have?</h2>
            <div className="form-options">
              {[
                'Veganism',
                'Vegetarianism',
                'Pescetarianism',
                'Gluten-Free',
                'Lactose intolerant',
                'Nut allergy',
                'Other',
                'None'
              ].map((option) => (
                <label key={option} className="form-checkbox-label">
                  <span>{option}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.dietaryOptions.includes(option)}
                    onChange={() => handleCheckboxChange('dietaryOptions', option)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        );

      case 'medicalConditions':
        return (
          <div className="form-step">
            <h2 className="form-question">Have you ever had any of the following conditions?</h2>
            <div className="form-options">
              {[
                'Diabetes',
                'Hypertension or high blood pressure',
                'Depression',
                'Eating disorders (Anorexia, Bulimia)',
                'Heart condition',
                'Kidney disease',
                'Liver disease',
                'Other',
                'None'
              ].map((condition) => (
                <label key={condition} className="form-checkbox-label">
                  <span>{condition}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.medicalConditions.includes(condition)}
                    onChange={() => handleCheckboxChange('medicalConditions', condition)}
                  />
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="form-nav-button form-nav-back" onClick={backStep}>
                ← Back
              </button>
              <button className="form-nav-button form-nav-next" onClick={finishForm}>
                Finish
              </button>
            </div>
          </div>
        );

      case 'completionStep':
        return (
          <div className="form-step">
            <h2 className="form-question">Thank you for completing the health survey!</h2>
            <p>What would you like to do next?</p>
            <div className="completion-options">
              <a
                href="https://play.google.com/store/search?q=diet+plan+app&c=apps"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Explore Diet Plan Apps (Google Play)
              </a>
              <a
                href="https://apps.apple.com/us/collection/best-health-fitness-apps/id1527715017"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Explore Diet Plan Apps (Apple App Store)
              </a>
              <a
                href="https://www.myfitnesspal.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                MyFitnessPal Website
              </a>
              <a
                href="https://www.noom.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Noom Website
              </a>
              <a
                href="https://lifesum.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Lifesum Website
              </a>
              <a
                href="https://www.yazio.com/en"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                YAZIO Website
              </a>
              <a
                href="https://www.loseit.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Lose It! Website
              </a>
              <a
                href="https://cronometer.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Cronometer Website
              </a>
              <a
                href="https://www.eatingwell.com/category/4286/meal-plans/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                EatingWell Meal Plans
              </a>
              <a
                href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/mayo-clinic-diet/art-20045460"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Mayo Clinic Diet
              </a>
              <a
                href="https://www.webmd.com/diet/default.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                WebMD Diet & Weight Mgmt.
              </a>
              <a
                href="https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/"
                target="_blank"
                rel="noopener noreferrer"
                className="completion-option-button diet-apps"
              >
                Harvard Nutrition Source
              </a>
              <a href="/menua" className="completion-option-button home-page">
                Go back to Home
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="health-app">
      <header>SNACKALYZER</header>

      <nav>
        <a href="/menua">Home</a>
        <a href="/healtha">Health</a>
        <a href="/sola">Solution</a>
        <a href="/predicta">Image</a>
        <a href="/predictb">Text</a>
        <a href="/predictc">History</a>
        <a href="/abouta">About</a>
        <a href="/logouta">Logout</a>
      </nav>

      <div className="container">
        <div className="health-form-container">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Healths;