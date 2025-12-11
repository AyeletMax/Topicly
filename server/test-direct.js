const { generateRoomVisualization } = require('./src/services/gemini.service.js');

async function testDirect() {
  console.log('🧪 Testing direct function call...');
  
  const result = await generateRoomVisualization(
    'dummy-path.jpg',
    'אני רוצה שתוסיף לי ארון לחדר בצבע ורוד עתיק אורך מטר גובה חצי מטר וכן שולחן מתאים',
    'מודרני'
  );
  
  console.log('Result:', result.text.substring(0, 200));
}

testDirect();