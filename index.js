const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const CAMERA_URL = "http://75.149.26.30:1024/cam_1.cgi";

app.get("/", (req, res) => {
  res.send("Live camera backend running");
});

app.get("/live", async (req, res) => {
  try {
    const response = await fetch(CAMERA_URL);

    // MJPEG stream headers
    res.setHeader("Content-Type", "multipart/x-mixed-replace; boundary=--myboundary");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Camera offline");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
