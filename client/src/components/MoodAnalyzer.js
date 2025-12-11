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
        }
      );

      setMoodData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to analyze mood. Please try again.'
      );
      console.error('Error:', err);
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
                <p className="links-subtitle">Open these Spotify playlists to listen to music that matches your mood</p>
                <div className="links-grid">
                  {moodData.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-card spotify-card"
                    >
                      <span className="link-icon">{link.icon || '🎵'}</span>
                      <span className="link-title">{link.title}</span>
                      <span className="spotify-badge">🎧 Spotify</span>
                    </a>
                  ))}
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

