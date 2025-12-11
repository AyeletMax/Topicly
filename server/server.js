require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const eventRoutes = require("./src/routes/event.routes");
const roomRoutes = require("./src/routes/room.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.use("/api/events", eventRoutes);
app.use("/api/rooms", roomRoutes);

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
