const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Camera URLs (only cam_1 for cameras 3, 6, 7 as requested)
const CAMERA_URLS = {
  1: "http://75.149.26.30:1024/cam_1.cgi",
  2: "http://139.64.168.120:8080/cam_1.cgi",
  3: "http://72.199.200.5:8080/cam_1.cgi",      // cam_1 only
  4: "http://76.151.170.119:10001/cam_1.cgi",
  5: "http://73.170.86.90:8888/cam_1.cgi",
  6: "http://213.144.145.239:8090/cam_1.cgi",   // cam_1 only
  7: "http://158.174.215.151:8203/cam_1.cgi",   // cam_1 only
  8: "http://61.78.164.58:8089/cam_1.cgi",
  9: "http://fanfulla.ddns.net:8080/cam_1.cgi",
 10: "http://85.93.53.175:8080/cam_1.cgi"
};

app.get("/", (req, res) => {
  res.send("Live camera backend running. Use /live?camera=1-10");
});

app.get("/live", async (req, res) => {
  try {
    const camId = req.query.camera || "1"; // default to camera 1
    const CAMERA_URL = CAMERA_URLS[camId];

    if (!CAMERA_URL) return res.status(404).send("Camera not found");

    const response = await fetch(CAMERA_URL);

    // Set headers for MJPEG streaming
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
  console.log(`Server running on port ${PORT}`);
});
