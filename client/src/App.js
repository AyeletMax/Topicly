import React from 'react';
import './App.css';
import MoodAnalyzer from './components/MoodAnalyzer';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎭 Mood Analyzer</h1>
        <p>Upload your photo and discover content that matches your mood</p>
      </header>
      <main className="app-main">
        <MoodAnalyzer />
      </main>
    </div>
  );
}

export default App;

