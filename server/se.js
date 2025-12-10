require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models?key=${API_KEY}`,
  method: 'GET',
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("📌 Available models:");
      json.models.forEach((m) => console.log("•", m.name));
    } catch (err) {
      console.error("Parsing error:", err);
    }
  });
});

req.on('error', (err) => {
  console.error("Request error:", err);
});

req.end();
