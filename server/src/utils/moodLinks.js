/**
 * Maps mood to relevant links/content recommendations
 * @param {string} mood - Detected mood
 * @param {number} confidence - Confidence level (0-1)
 * @returns {Array<Object>} Array of link objects with title, url, type, icon
 */
exports.getMoodLinks = (mood, confidence = 0.5) => {
  const moodLower = mood.toLowerCase();
  
  // Base link templates by mood category
  const linkTemplates = {
    happy: [
      { title: 'Upbeat Music Playlist', url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTABCs', type: 'Music', icon: '🎵' },
      { title: 'Funny Videos', url: 'https://www.youtube.com/results?search_query=funny+videos', type: 'Video', icon: '📺' },
      { title: 'Positive Quotes', url: 'https://www.goodreads.com/quotes/tag/positive', type: 'Reading', icon: '📖' },
      { title: 'Dance Workout', url: 'https://www.youtube.com/results?search_query=dance+workout', type: 'Fitness', icon: '💃' }
    ],
    sad: [
      { title: 'Calming Music', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadg8KxB', type: 'Music', icon: '🎵' },
      { title: 'Inspirational Stories', url: 'https://www.ted.com/talks', type: 'Video', icon: '📺' },
      { title: 'Self-Care Tips', url: 'https://www.helpguide.org/articles/mental-health/self-care-for-anxiety-depression-and-stress.htm', type: 'Reading', icon: '📖' },
      { title: 'Meditation Guide', url: 'https://www.headspace.com/meditation/meditation-for-beginners', type: 'Wellness', icon: '🧘' }
    ],
    excited: [
      { title: 'Energetic Music', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76t638V6CA8', type: 'Music', icon: '🎵' },
      { title: 'Adventure Ideas', url: 'https://www.buzzfeed.com/tag/adventure', type: 'Reading', icon: '📖' },
      { title: 'Motivational Videos', url: 'https://www.youtube.com/results?search_query=motivational+speeches', type: 'Video', icon: '📺' },
      { title: 'Productivity Tips', url: 'https://todoist.com/productivity-methods', type: 'Productivity', icon: '⚡' }
    ],
    calm: [
      { title: 'Peaceful Music', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'Music', icon: '🎵' },
      { title: 'Nature Sounds', url: 'https://www.youtube.com/results?search_query=nature+sounds', type: 'Audio', icon: '🌿' },
      { title: 'Mindfulness Exercises', url: 'https://www.mindful.org/meditation/mindfulness-getting-started/', type: 'Wellness', icon: '🧘' },
      { title: 'Reading Recommendations', url: 'https://www.goodreads.com/genre/calm', type: 'Reading', icon: '📖' }
    ],
    anxious: [
      { title: 'Calming Sounds', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'Music', icon: '🎵' },
      { title: 'Breathing Exercises', url: 'https://www.healthline.com/health/breathing-exercise', type: 'Wellness', icon: '🫁' },
      { title: 'Stress Relief Techniques', url: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-relief/art-20044457', type: 'Reading', icon: '📖' },
      { title: 'Guided Meditation', url: 'https://www.headspace.com/meditation/meditation-for-anxiety', type: 'Wellness', icon: '🧘' }
    ],
    tired: [
      { title: 'Relaxing Music', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'Music', icon: '🎵' },
      { title: 'Sleep Stories', url: 'https://www.calm.com/sleep', type: 'Audio', icon: '😴' },
      { title: 'Rest Tips', url: 'https://www.sleepfoundation.org/sleep-hygiene', type: 'Reading', icon: '📖' },
      { title: 'Power Nap Guide', url: 'https://www.healthline.com/health/power-nap', type: 'Wellness', icon: '💤' }
    ],
    energetic: [
      { title: 'Workout Playlist', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76t638V6CA8', type: 'Music', icon: '🎵' },
      { title: 'Fitness Routines', url: 'https://www.youtube.com/results?search_query=home+workout', type: 'Video', icon: '💪' },
      { title: 'Energy Boost Tips', url: 'https://www.healthline.com/nutrition/how-to-increase-energy', type: 'Reading', icon: '📖' },
      { title: 'Active Games', url: 'https://www.nintendo.com/games/', type: 'Entertainment', icon: '🎮' }
    ]
  };

  // Determine mood category
  let selectedLinks = [];
  if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('cheerful')) {
    selectedLinks = linkTemplates.happy;
  } else if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('melancholy')) {
    selectedLinks = linkTemplates.sad;
  } else if (moodLower.includes('excited') || moodLower.includes('enthusiastic') || moodLower.includes('thrilled')) {
    selectedLinks = linkTemplates.excited;
  } else if (moodLower.includes('calm') || moodLower.includes('peaceful') || moodLower.includes('serene')) {
    selectedLinks = linkTemplates.calm;
  } else if (moodLower.includes('anxious') || moodLower.includes('worried') || moodLower.includes('nervous')) {
    selectedLinks = linkTemplates.anxious;
  } else if (moodLower.includes('tired') || moodLower.includes('exhausted') || moodLower.includes('sleepy')) {
    selectedLinks = linkTemplates.tired;
  } else if (moodLower.includes('energetic') || moodLower.includes('active') || moodLower.includes('vibrant')) {
    selectedLinks = linkTemplates.energetic;
  } else {
    // Default/neutral mood
    selectedLinks = [
      { title: 'Discover Music', url: 'https://open.spotify.com/browse', type: 'Music', icon: '🎵' },
      { title: 'Explore Videos', url: 'https://www.youtube.com', type: 'Video', icon: '📺' },
      { title: 'Read Articles', url: 'https://medium.com', type: 'Reading', icon: '📖' },
      { title: 'Wellness Resources', url: 'https://www.headspace.com', type: 'Wellness', icon: '🧘' }
    ];
  }

  // Adjust number of links based on confidence
  const numLinks = confidence > 0.7 ? selectedLinks.length : Math.max(2, Math.floor(selectedLinks.length * confidence));
  
  return selectedLinks.slice(0, numLinks);
};

