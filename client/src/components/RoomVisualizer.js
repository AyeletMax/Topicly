import React, { useState } from 'react';
import axios from 'axios';
import './RoomVisualizer.css';

const RoomVisualizer = () => {
  const [roomImage, setRoomImage] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [furnitureImage, setFurnitureImage] = useState(null);
  const [furnitureImagePreview, setFurnitureImagePreview] = useState(null);
  const [furnitureDescription, setFurnitureDescription] = useState('');
  const [useFurnitureImage, setUseFurnitureImage] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const [visualizationImage, setVisualizationImage] = useState(null);
  const [error, setError] = useState(null);

  const handleRoomImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFurnitureImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFurnitureImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFurnitureImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomImage) {
      setError('Please upload a room image');
      return;
    }

    if (useFurnitureImage && !furnitureImage) {
      setError('Please upload a furniture image');
      return;
    }

    if (!useFurnitureImage && !furnitureDescription.trim()) {
      setError('Please describe the furniture or upload an image');
      return;
    }

    setLoading(true);
    setError(null);
    setVisualization(null);

    try {
      const formData = new FormData();
      formData.append('roomImage', roomImage);
      
      if (useFurnitureImage && furnitureImage) {
        formData.append('furnitureImage', furnitureImage);
      } else {
        formData.append('furnitureDescription', furnitureDescription);
      }

      if (additionalNotes.trim()) {
        formData.append('description', additionalNotes);
      }

      const response = await axios.post(
        'http://localhost:3001/api/rooms/visualize',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setVisualization(response.data.analysis || response.data.visualization);
      // If image data exists, set it
      if (response.data.visualizationImage) {
        setVisualizationImage(response.data.visualizationImage);
      }
      
      console.log('Response data:', response.data); // Debug log
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to generate visualization'
      );
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoomImage(null);
    setRoomImagePreview(null);
    setFurnitureImage(null);
    setFurnitureImagePreview(null);
    setFurnitureDescription('');
    setAdditionalNotes('');
    setVisualization(null);
    setVisualizationImage(null);
    setError(null);
    setUseFurnitureImage(false);
  };

  return (
    <div className="visualizer-container">
      <form className="visualizer-form" onSubmit={handleSubmit}>
        {/* Room Image Section */}
        <div className="form-section">
          <h2>📸 Step 1: Upload Your Room</h2>
          <div className="upload-area">
            <input
              type="file"
              id="roomImage"
              accept="image/*"
              onChange={handleRoomImageChange}
              disabled={loading}
              className="file-input"
            />
            <label htmlFor="roomImage" className="upload-label">
              {roomImagePreview ? (
                <img src={roomImagePreview} alt="Room preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload room image</span>
                </div>
              )}
            </label>
            {roomImage && <p className="file-name">✓ {roomImage.name}</p>}
          </div>
        </div>

        {/* Furniture Input Section */}
        <div className="form-section">
          <h2>🛏️ Step 2: Add Furniture</h2>
          
          <div className="toggle-group">
            <label className="toggle-option">
              <input
                type="radio"
                name="furnitureInput"
                checked={!useFurnitureImage}
                onChange={() => setUseFurnitureImage(false)}
                disabled={loading}
              />
              <span>Describe Furniture</span>
            </label>
            <label className="toggle-option">
              <input
                type="radio"
                name="furnitureInput"
                checked={useFurnitureImage}
                onChange={() => setUseFurnitureImage(true)}
                disabled={loading}
              />
              <span>Upload Furniture Image</span>
            </label>
          </div>

          {!useFurnitureImage ? (
            <div className="input-group">
              <textarea
                value={furnitureDescription}
                onChange={(e) => setFurnitureDescription(e.target.value)}
                placeholder="e.g., 'Modern gray sofa with cushions, 8 feet wide' or 'Wooden dining table for 6 people with chairs'"
                disabled={loading}
                className="textarea"
              />
            </div>
          ) : (
            <div className="upload-area">
              <input
                type="file"
                id="furnitureImage"
                accept="image/*"
                onChange={handleFurnitureImageChange}
                disabled={loading}
                className="file-input"
              />
              <label htmlFor="furnitureImage" className="upload-label">
                {furnitureImagePreview ? (
                  <img src={furnitureImagePreview} alt="Furniture preview" className="preview-image" />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">🛋️</span>
                    <span>Click to upload furniture image</span>
                  </div>
                )}
              </label>
              {furnitureImage && <p className="file-name">✓ {furnitureImage.name}</p>}
            </div>
          )}
        </div>

        {/* Additional Notes Section */}
        <div className="form-section">
          <h2>💭 Step 3: Additional Details (Optional)</h2>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g., 'Modern style', 'Warm colors', 'Minimal design'"
            disabled={loading}
            className="input"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Buttons */}
        <div className="button-group">
          <button
            type="submit"
            disabled={loading || !roomImage}
            className="btn btn-primary"
          >
            {loading ? '⏳ Generating...' : '✨ Generate Visualization'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="btn btn-secondary"
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {/* Visualization Result */}
      {visualization && (
        <div className="visualization-result">
          <h2>✨ תיאור הוויזואליזציה</h2>
          {visualizationImage && (
            <div className="result-image-container">
              <img 
                src={visualizationImage.url || visualizationImage.imageUrl || `data:${visualizationImage.mimeType || 'image/png'};base64,${visualizationImage.data || visualizationImage.imageData}`}
                alt="Generated room visualization"
                className="generated-image"
                onError={(e) => {
                  console.log('Image load error:', e);
                  e.target.style.display = 'none';
                }}
              />
              {visualizationImage.isPlaceholder && (
                <p className="placeholder-note">📝 This is a placeholder image. The actual AI-generated image will appear here when the service is fully configured.</p>
              )}
            </div>
          )}
          <div className="result-content">
            <div className="visualization-text">
              {visualization.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomVisualizer;
