import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Index1 from './component/index1';
import History from './component/history';
import History1 from './component/history1';
import Login from './components/login';
import Register from './components/register';
import Menu from './components/menu';
import P2 from './component/p2';
import Predict from './component/predict';
import Predict2 from './component/predict2';
import Results from './component/results';
import Results2 from './component/results2';
import ForgotPassword from './components/ForgotPassword';
import About from './components/About';
import Health from './components/Health';
import Solution from './components/Solution';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/index1">Index</Link></li>
            <li><Link to="/menua">Menu</Link></li>
            <li><Link to="/predict/image">Predict Image</Link></li>
            <li><Link to="/predict/text">Predict Text</Link></li>
            <li><Link to="/history1">Prediction History</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/health">Health</Link></li>
            <li><Link to="/solution">Solution</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/index1" element={<Index1 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menua" element={<Menu />} />
          <Route path="/predict/image" element={<Predict />} />
          <Route path="/predict/text" element={<P2 />} />
          <Route path="/history1" element={<Predict2 />} />
          <Route path="/results/image" element={<Results />} />
          <Route path="/results/text" element={<Results2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/health" element={<Health />} />
          <Route path="/solution" element={<Solution />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

