# 🚀 Quick Start Guide

## הפעלת המערכת - שלב אחר שלב

### 1. ודא שיש לך API Key
צור קובץ `server/.env`:
```env
GEMINI_API_KEY=הכנס_כאן_את_המפתח_שלך
PORT=3001
NODE_ENV=development
```

קבל מפתח מ: https://aistudio.google.com/app/apikey

### 2. התקן תלויות

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. הפעל את השרת

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

אמור לראות:
```
✅ Server running on http://localhost:3001
📁 Uploads directory: ...
```

### 4. הפעל את הפרונט

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

הדפדפן אמור להיפתח אוטומטית ב: http://localhost:3000

### 5. בדוק שהכל עובד

1. פתח http://localhost:3000 בדפדפן
2. לחץ על "Upload Your Photo"
3. בחר תמונה
4. לחץ "✨ Analyze Mood"
5. חכה לתוצאות

## פתרון בעיות

### השרת לא נפתח?
- בדוק שהפורט 3001 פנוי: `netstat -ano | findstr :3001`
- אם תפוס, הרוג את התהליך: `taskkill /PID <מספר> /F`

### הפרונט לא נפתח?
- בדוק שהפורט 3000 פנוי
- נסה לרענן את הדף

### שגיאת API?
- ודא ש-GEMINI_API_KEY נכון ב-`.env`
- ודא שהשרת רץ על פורט 3001
- בדוק את הקונסול לשגיאות

### "Cannot connect to server"?
- ודא שהשרת רץ
- בדוק שהכתובת היא `http://localhost:3001`
- בדוק שאין firewall חוסם

## בדיקה מהירה

פתח בדפדפן: http://localhost:3001

אמור לראות:
```json
{
  "message": "Mood Analyzer API Server",
  "version": "1.0.0",
  "status": "running"
}
```

אם אתה רואה את זה - השרת עובד! ✅

