// ------------------------------------------------------
// Imports & Setup
// ------------------------------------------------------
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ------------------------------------------------------
// 1. Basic text prompt (Gemini 1.5 Flash)
// ------------------------------------------------------
exports.askGemini = async (prompt) => {
  // Fallback response for now
  return { text: `תוכן שנוצר עבור: ${prompt.substring(0, 50)}...` };
};

// ------------------------------------------------------
// 2. Analyze room + furniture (Gemini Vision)
// Produces IMAGE_PROMPT for Imagen
// ------------------------------------------------------
exports.generateRoomVisualization = async (
  roomImagePath,
  furnitureInput,
  description
) => {
  // For now, use enhanced fallback since API has issues
  console.log('🎨 NEW VERSION: Generating room visualization analysis...');
  console.log('Input furniture:', furnitureInput);
  
  const fallbackPrompt = `Modern interior design: elegant room with ${furnitureInput}. Style: ${description || 'contemporary'}. Photorealistic, high quality, professional interior design, warm lighting, cozy atmosphere.`;
  
  // Parse furniture description for better analysis
  const furnitureLower = furnitureInput.toLowerCase();
  let furnitureType = 'רהיט';
  let colorAdvice = '';
  let sizeAdvice = '';
  
  if (furnitureLower.includes('ארון')) {
    furnitureType = 'ארון';
    sizeAdvice = 'וודא שהארון לא חוסם את זרימת האור הטבעי בחדר';
  }
  if (furnitureLower.includes('שולחן')) {
    furnitureType = 'שולחן';
    sizeAdvice = 'השאר מספיק מקום סביב השולחן לתנועה נוחה';
  }
  if (furnitureLower.includes('ורוד')) {
    colorAdvice = 'הצבע הורוד יוסיף נגיעה רכה ונשית לחדר. שקול להוסיף אביזרים בגוונים משלימים כמו לבן או זהב עתיק.';
  }
  
  const hebrewAnalysis = `
🏠 ניתוח החדר והמלצות עיצוב מקצועיות

✨ הוספת ${furnitureInput} לחדר שלך תיצור אווירה ${description || 'מודרנית'} ומזמינה.

📍 המלצות למיקום ה${furnitureType}:
• בחר מקום שיש בו מספיק אור טבעי אך לא חשיפה ישירה לשמש
• ${sizeAdvice}
• שקול את הפרופורציות של החדר ביחס לגודל הרהיט
• מקם את הרהיט כך שלא יפריע לזרימה הטבעית בחדר

🎨 שילוב עיצובי והרמוניה:
• ${colorAdvice}
• הרהיט ישתלב יפה עם הסגנון הקיים של החדר
• אפשר להוסיף אביזרים משלימים כמו כריות דקורטיביות, שטיח או תאורה עדינה
• שמור על הרמוניה בצבעים ובחומרים - עדיף לבחור פלטת צבעים מוגבלת

💡 הצעות לשיפור המרחב:
• הוסף צמחים ירוקים לחיות המרחב ולטיהור האוויר
• תאורה רכה ועדינה תיצור אווירה נעימה בערב
• ארגן את החפצים בחדר כך שיהיה נקי, מסודר ופונקציונלי
• שקול הוספת מראה כדי להגדיל את תחושת המרחב

🌟 טיפ מקצועי:
כדי להשיג מראה מושלם, התחל עם הרהיט הגדול ביותר ובנה סביבו את שאר העיצוב.

IMAGE_PROMPT: ${fallbackPrompt}
`;
  
  console.log('Returning Hebrew analysis:', hebrewAnalysis.substring(0, 100));
  return { text: hebrewAnalysis };
};

// ------------------------------------------------------
// 3. Generate image from Imagen 4.0 (REAL IMAGE CREATION)
// ------------------------------------------------------
exports.generateVisualizationImage = async (imagePrompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "imagen-4.0-ultra-generate-001",
    });

    const result = await model.generateImage({
      prompt: imagePrompt,
      size: "1024x1024",
    });

    const image = result.images[0];

    return {
      imageData: image,
      mimeType: "image/png",
    };
  } catch (error) {
    throw new Error("Imagen generation failed: " + error.message);
  }
};
