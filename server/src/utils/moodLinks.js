/**
 * Maps mood to Spotify music playlists (audio only)
 * @param {string} mood - Detected mood
 * @param {number} confidence - Confidence level (0-1)
 * @returns {Array<Object>} Array of Spotify playlist links
 */
exports.getMoodLinks = (mood, confidence = 0.5) => {
  const moodLower = mood.toLowerCase();
  
  // Spotify playlists by mood category (audio only - no video)
  const spotifyPlaylists = {
    happy: [
      { title: 'Happy Hits', url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTABCs', type: 'Music', icon: '🎵' },
      { title: 'Feel Good Pop', url: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9bkj5AkUo', type: 'Music', icon: '😊' },
      { title: 'Upbeat Indie', url: 'https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL', type: 'Music', icon: '🎸' },
      { title: 'Dance Party', url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', type: 'Music', icon: '💃' }
    ],
    sad: [
      { title: 'Sad Songs', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634', type: 'Music', icon: '😢' },
      { title: 'Melancholy Vibes', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadg8KxB', type: 'Music', icon: '🎹' },
      { title: 'Emotional Ballads', url: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1', type: 'Music', icon: '🎤' },
      { title: 'Chill & Reflective', url: 'https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj', type: 'Music', icon: '🌙' }
    ],
    excited: [
      { title: 'Energy Boost', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76t638V6CA8', type: 'Music', icon: '⚡' },
      { title: 'Workout Motivation', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfd25lzL', type: 'Music', icon: '💪' },
      { title: 'High Energy Pop', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', type: 'Music', icon: '🔥' },
      { title: 'Pump Up Songs', url: 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda', type: 'Music', icon: '🎧' }
    ],
    calm: [
      { title: 'Peaceful Piano', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'Music', icon: '🎹' },
      { title: 'Calm & Focused', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadg8KxB', type: 'Music', icon: '🧘' },
      { title: 'Ambient Relaxation', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4u5kfs0cCFN', type: 'Music', icon: '🌊' },
      { title: 'Soft Acoustic', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', type: 'Music', icon: '🎸' }
    ],
    anxious: [
      { title: 'Calming Sounds', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'Music', icon: '🫁' },
      { title: 'Stress Relief', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadg8KxB', type: 'Music', icon: '🌿' },
      { title: 'Meditation Music', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4u5kfs0cCFN', type: 'Music', icon: '🧘' },
      { title: 'Nature Sounds', url: 'https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj', type: 'Music', icon: '🌲' }
    ],
    tired: [
      { title: 'Sleep & Relax', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'Music', icon: '😴' },
      { title: 'Bedtime Stories', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadg8KxB', type: 'Music', icon: '🌙' },
      { title: 'Deep Sleep', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4u5kfs0cCFN', type: 'Music', icon: '💤' },
      { title: 'Peaceful Night', url: 'https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj', type: 'Music', icon: '⭐' }
    ],
    energetic: [
      { title: 'Workout Mix', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76t638V6CA8', type: 'Music', icon: '💪' },
      { title: 'Power Hour', url: 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda', type: 'Music', icon: '⚡' },
      { title: 'High Energy', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', type: 'Music', icon: '🔥' },
      { title: 'Pump It Up', url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', type: 'Music', icon: '🎧' }
    ]
  };

  // Determine mood category
  let selectedPlaylists = [];
  if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('cheerful')) {
    selectedPlaylists = spotifyPlaylists.happy;
  } else if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('melancholy')) {
    selectedPlaylists = spotifyPlaylists.sad;
  } else if (moodLower.includes('excited') || moodLower.includes('enthusiastic') || moodLower.includes('thrilled')) {
    selectedPlaylists = spotifyPlaylists.excited;
  } else if (moodLower.includes('calm') || moodLower.includes('peaceful') || moodLower.includes('serene')) {
    selectedPlaylists = spotifyPlaylists.calm;
  } else if (moodLower.includes('anxious') || moodLower.includes('worried') || moodLower.includes('nervous')) {
    selectedPlaylists = spotifyPlaylists.anxious;
  } else if (moodLower.includes('tired') || moodLower.includes('exhausted') || moodLower.includes('sleepy')) {
    selectedPlaylists = spotifyPlaylists.tired;
  } else if (moodLower.includes('energetic') || moodLower.includes('active') || moodLower.includes('vibrant')) {
    selectedPlaylists = spotifyPlaylists.energetic;
  } else {
    // Default/neutral mood - general music discovery
    selectedPlaylists = [
      { title: 'Discover Weekly', url: 'https://open.spotify.com/playlist/37i9dQZ1DXcBWIGoYBM5M', type: 'Music', icon: '🎵' },
      { title: 'Today\'s Top Hits', url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', type: 'Music', icon: '🔥' },
      { title: 'Chill Hits', url: 'https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj', type: 'Music', icon: '🌊' },
      { title: 'Pop Mix', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', type: 'Music', icon: '🎤' }
    ];
  }

  // Adjust number of playlists based on confidence (minimum 2, maximum all)
  const numPlaylists = confidence > 0.7 ? selectedPlaylists.length : Math.max(2, Math.floor(selectedPlaylists.length * confidence));
  
  return selectedPlaylists.slice(0, numPlaylists);
};

