const express = require("express");
const cors = require("cors");
const eventRoutes = require("./src/routes/event.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.use("/api/events", eventRoutes);

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
