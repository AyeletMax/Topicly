import React, { useState } from 'react';
import axios from 'axios';
import './MoodAnalyzer.css';

const MoodAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moodData, setMoodData] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMoodData(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setMoodData(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post(
        'http://localhost:3001/api/analyze-mood',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds timeout for AI analysis
        }
      );

      if (response.data && response.data.success !== false) {
        setMoodData(response.data);
        setError(null);
      } else {
        throw new Error(response.data?.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Full error:', err);
      let errorMessage = 'Failed to analyze mood. ';
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage += 'Cannot connect to server. Make sure the backend is running on port 3001.';
      } else if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
        errorMessage += 'Request timed out. The analysis is taking too long.';
      } else if (err.response?.status === 400) {
        errorMessage += err.response.data?.error || 'Invalid request. Please check your image.';
      } else if (err.response?.status === 500) {
        errorMessage += err.response.data?.message || 'Server error. Please try again.';
      } else {
        errorMessage += err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setMoodData(null);
    setError(null);
  };

  return (
    <div className="mood-analyzer">
      <div className="analyzer-container">
        <div className="upload-section">
          <h2>📸 Upload Your Photo</h2>
          <div className="upload-area">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="file-input"
            />
            <label htmlFor="imageUpload" className="upload-label">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="preview-image"
                />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload image</span>
                </div>
              )}
            </label>
          </div>
          {image && (
            <p className="file-name">✓ {image.name}</p>
          )}
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="button-group">
          <button
            onClick={handleAnalyze}
            disabled={loading || !image}
            className="btn btn-primary"
          >
            {loading ? '⏳ Analyzing...' : '✨ Analyze Mood'}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="btn btn-secondary"
          >
            🔄 Reset
          </button>
        </div>

        {moodData && (
          <div className="results-section">
            <h2>🎭 Mood Analysis Results</h2>
            <div className="mood-info">
              <div className="mood-badge">
                <span className="mood-emoji">{moodData.moodEmoji || '😊'}</span>
                <span className="mood-label">{moodData.mood || 'Unknown'}</span>
              </div>
              {moodData.confidence && (
                <p className="confidence">
                  Confidence: {Math.round(moodData.confidence * 100)}%
                </p>
              )}
            </div>

            {moodData.description && (
              <div className="mood-description">
                <h3>Analysis:</h3>
                <p>{moodData.description}</p>
              </div>
            )}

            {moodData.links && moodData.links.length > 0 && (
              <div className="links-section">
                <h3>🎵 Recommended Songs for Your Mood:</h3>
                <div className="links-grid">
                  {moodData.links.map((raw, index) => {
                    // הדפסה לדיבאג
                    console.log('Raw Gemini link:', raw);
                    // ניקוי והפקה
                    let line = String(raw).trim();
                    // נסה למצוא לינק
                    let url = '';
                    const urlMatch = line.match(/(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^\s]*)/i);
                    if (urlMatch) url = urlMatch[1];
                    // נחלץ title אם יש
                    let title = `Song #${index + 1}`;
                    const titleMatch = line.match(/Title:([^\n\r]*)/i);
                    if (titleMatch) title = titleMatch[1].trim();
                    // YouTube video ID
                    let embedId = null;
                    if (url) {
                      // youtube.com/watch?v=VIDEO_ID&... or youtu.be/VIDEO_ID
                      const ytIdMatch = url.match(/(?:v=|be\/)([a-zA-Z0-9_-]{11})/);
                      if (ytIdMatch) embedId = ytIdMatch[1];
                    }
                    return (
                      <div key={index} className="yt-embed-card">
                        <div className="yt-title">{title}</div>
                        {embedId ? (
                          <iframe
                            width="340"
                            height="192"
                            src={`https://www.youtube.com/embed/${embedId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`YouTube Song ${index+1}`}
                            className="yt-iframe"
                          />
                        ) : (
                          <div style={{ color: 'red', minHeight: 32 }}>
                            ⚠️ Unable to display song preview
                            <br />
                            {url ? (
                              <span style={{fontSize:'90%'}}>The link is not a valid YouTube song link.<br/>{url}</span>
                            ) : (
                              <span style={{fontSize:'90%'}}>No YouTube link detected in Gemini reply.<br/>{raw}</span>
                            )}
                          </div>
                        )}
                        <div>
                          <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="link-card">
                            🎬 Open on YouTube
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodAnalyzer;

