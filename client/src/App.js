import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import RoomVisualizer from './components/RoomVisualizer';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>🛋️ Room Furniture Visualizer</h1>
        <p>Upload your room and see how furniture looks in your space</p>
      </header>
      <main className="main">
        <RoomVisualizer />
      </main>
    </div>
  );
}

export default App;
