import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //  useNavigate for redirection
import './Health.css'; // Import the CSS file

const Health = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

  const steps = [
    'welcome',
    'muscleOrWeightGoal',
    'motivationLevel',
    'willingToDo',
    'profile',
    'dietaryRestrictions',
    'dietaryOptions',
    'medicalConditions',
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Redirect to /menua when the form is finished.  Use navigate here.
      navigate('/menua');
    }
  };

  const backStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
        switch (steps[currentStep]) {
            case 'welcome':
                return (
                    <>
                        <h2 style={{ color: 'black' }}>what brings you here?</h2>
                        <div className="form-options">
                            <label className="form-checkbox-label">
                                <span>Losing weight</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Gaining muscle and losing fat</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Gaining muscle, losing fat is secondary</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Eating healthier without losing weight</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                        </div>
                        <div className="form-navigation">
                            <button className="form-nav-button form-nav-next" onClick={nextStep}>
                                Next →
                            </button>
                        </div>
                    </>
                );
            case 'muscleOrWeightGoal':
                return (
                    <>
                        <h2 className="form-question">What are your reasons for this goal?</h2>
                        <div className="form-options">
                            <label className="form-checkbox-label">
                                <span>Feel better in my body</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Be healthier</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Get in shape</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Stop people from bothering me</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Fit in my old clothes</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Be more energetic</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Live longer</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>For medical reason</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                            <label className="form-checkbox-label">
                                <span>Other reasons</span>
                                <input type="checkbox" className="form-checkbox" />
                            </label>
                        </div>
                        <div className="form-navigation">
                            <button className="form-nav-button form-nav-back" onClick={backStep}>
                                ← Back
                            </button>
                            <button className="form-nav-button form-nav-next" onClick={nextStep}>
                                Next →
                            </button>
                        </div>
                    </>
                );
            case 'motivationLevel':
                return (
                    <>
                        <h2 className="form-question">How motivated are you to achieve your goal?</h2>
                        <div className="form-options">
                            <label className="form-radio-label">
                                <span>Very motivated</span>
                                <input type="radio" name="motivation" className="form-radio" />
                            </label>
                            <label className="form-radio-label">
                                <span>Quite motivated</span>
                                <input type="radio" name="motivation" className="form-radio" />
                            </label>
                            <label className="form-radio-label">
                                <span>Motivated</span>
                                <input type="radio" name="motivation" className="form-radio" />
                            </label>
                            <label className="form-radio-label">
                                <span>Not motivated</span>
                                <input type="radio" name="motivation" className="form-radio" />
                            </label>
                            <label className="form-radio-label">
                                <span>Not motivated at all</span>
                                <input type="radio" name="motivation" className="form-radio" />
                            </label>
                        </div>
                        <div className="form-navigation">
                            <button className="form-nav-button form-nav-back" onClick={backStep}>
                                ← Back
                            </button>
                            <button className="form-nav-button form-nav-next" onClick={nextStep}>
                                Next →
                            </button>
                        </div>
                    </>
                );
            case 'willingToDo':
                return (
                  <>
                    <h2 className="form-question">What are you willing to do to achieve your goal?</h2>
                    <div className="form-options">
                      <label className="form-checkbox-label">
                        <span>Fast</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Follow a restrictive diet</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Do some physical activity</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Count calories</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                    </div>
                    <div className="form-navigation">
                      <button className="form-nav-button form-nav-back" onClick={backStep}>
                        ← Back
                      </button>
                      <button className="form-nav-button form-nav-next" onClick={nextStep}>
                        Next →
                      </button>
                    </div>
                  </>
                );
            case 'profile':
                return (
                  <>
                    <h2 className="form-question">Tell us about yourself</h2>
                    <div className="form-gender-options">
                      <label className="form-checkbox-label">
                        <span>Male</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Female</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Non binary</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Prefer not to say</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Other</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                    </div>
                    <label className="form-label">Date of Birth:</label>
                    <input type="date" className="form-input" />
                    <label className="form-label">Height (cm)</label>
                    <input type="number" className="form-input" />
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="form-input" />
                    <div className="form-navigation">
                      <button className="form-nav-button form-nav-back" onClick={backStep}>
                        ← Back
                      </button>
                      <button className="form-nav-button form-nav-next" onClick={nextStep}>
                        Next →
                      </button>
                    </div>
                  </>
                );
              case 'dietaryRestrictions':
                return (
                  <>
                    <h2 className="form-question">
                      Do you have any dietary restrictions or food allergies?
                    </h2>
                    <div className="form-options">
                      <label className="form-checkbox-label">
                        <span>Yes</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>No</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                    </div>
                    <div className="form-navigation">
                      <button className="form-nav-button form-nav-back" onClick={backStep}>
                        ← Back
                      </button>
                      <button className="form-nav-button form-nav-next" onClick={nextStep}>
                        Next →
                      </button>
                    </div>
                  </>
                );
              case 'dietaryOptions':
                return (
                  <>
                    <h2 className="form-question">Which restrictions/allergies do you have?</h2>
                    <div className="form-options">
                      <label className="form-checkbox-label">
                        <span>Veganism</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Vegetarianism</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Pescetarianism</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Gluten-Free</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Lactose intolerant</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Nut allergy</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Other</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>None</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                    </div>
                    <div className="form-navigation">
                      <button className="form-nav-button form-nav-back" onClick={backStep}>
                        ← Back
                      </button>
                      <button className="form-nav-button form-nav-next" onClick={nextStep}>
                        Next →
                      </button>
                    </div>
                  </>
                );
              case 'medicalConditions':
                return (
                  <>
                    <h2 className="form-question">
                      Have you ever had any of the following conditions?
                    </h2>
                    <div className="form-options">
                      <label className="form-checkbox-label">
                        <span>Diabetes</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Hypertension or high blood pressure</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Depression</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Eating disorders (Anorexia, Bulimia)</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Heart condition</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Kidney disease</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Liver disease</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>Other</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                      <label className="form-checkbox-label">
                        <span>None</span>
                        <input type="checkbox" className="form-checkbox" />
                      </label>
                    </div>
                    <div className="form-navigation">
                      <button className="form-nav-button form-nav-back" onClick={backStep}>
                        ← Back
                      </button>
                      <button className="form-nav-button form-nav-next" onClick={nextStep}>
                        Finish
                      </button>
                    </div>
                  </>
                );
            default:
                return null;
        }
    };

  return (
    <>
      <header></header>
      <nav>
        <a href="/">Home</a>
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
    </>
  );
};

export default Health;
