import React from 'react';
import './menu.css'; // Import the CSS file

function Menu() {
  return (
    <div className="home-page">
      <header>
        {/* <h1>SNACKALYZER</h1> */}
      </header>

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

      <div className="container3">
        <h1>Welcome To Scankalayzer</h1>
      </div>
    </div>
  );
}

export default Menu;
