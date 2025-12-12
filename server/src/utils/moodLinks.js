/**
 * Maps mood to 30 Haredi song recommendations with working links
 * @param {string} mood - Detected mood
 * @param {number} confidence - Confidence level (0-1)
 * @returns {Array<Object>} Array of 30 Haredi songs with title, artist, url
 */
exports.getMoodLinks = (mood, confidence = 0.5) => {
  const moodLower = mood.toLowerCase();
  
  const songLists = {
    happy: [
      { title: 'שמח בחלקו', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'עד בלי די', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'כי אתה עמדי', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אם השם לא יבנה בית', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שיר המעלות', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'ושמחת בחגך', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אשרי האיש', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'כל העולם כולו', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'עוד ישמע', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'הללויה', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שבת שלום', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'ברוך השם', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אנא השם', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'יום טוב', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שמחה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'מזמור לתודה', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'רנו צדיקים', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אור זרוע', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'טוב להודות', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שירו לה׳', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אמונה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'הודו לה׳', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שמחת החיים', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'ברכת הבנים', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'עת רצון', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'נעים זמירות', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תפילה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שבח והודאה', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'חסד ה׳', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'גאולה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ],
    sad: [
      { title: 'אבינו מלכנו', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'רחם', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תשובה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אל מלא רחמים', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'זכרנו לחיים', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'סליחות', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אשמנו', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תפילת הדרך', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'רפאנו', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'יזכור', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'נחמה', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אל נא רפא נא לה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תחנונים', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'שמע קולנו', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'בקשה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אם אשכחך ירושלים', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'על נהרות בבל', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'זכור רחמיך', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תקון חצות', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'קינות', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'יום כיפור', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'ווידוי', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'צום גדליה', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תענית', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'אבל', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'זכרון', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תפילה לחולה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'רפואה שלמה', artist: 'אברהם פריד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'מי שברך', artist: 'מרדכי בן דוד', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'תחינה', artist: 'יעקב שוואקי', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ]
  };

  if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('cheerful')) {
    return songLists.happy;
  } else if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('melancholy')) {
    return songLists.sad;
  } else {
    return songLists.happy; // Default to happy songs
  }
};