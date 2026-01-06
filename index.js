const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// WebcamXP5 cameras + sources
const CAMERAS = {
  camera1: { ip: "86.81.113.229:8080", sources: [1] },
  camera2: { ip: "184.57.102.6:9550", sources: [1] },
  camera3: { ip: "184.57.102.6:5432", sources: [1] },
  camera4: { ip: "92.30.143.168:9080", sources: [1] },
  camera5: { ip: "184.57.102.6:7070", sources: [1] },
  camera6: { ip: "109.233.191.130:8090", sources: [1,2,5,6,7,8,9] },
  camera7: { ip: "223.19.67.97:888", sources: [1] },
  camera8: { ip: "188.233.189.119:8085", sources: [1] },
  camera9: { ip: "73.235.161.152:81", sources: [1] },
  camera10: { ip: "90.25.59.114:8086", sources: [6] },
  camera11: { ip: "69.140.27.58:10001", sources: [1] },
  camera12: { ip: "212.107.227.117:8081", sources: [1] },
  camera13: { ip: "172.218.186.243:8082", sources: [1] },
  camera14: { ip: "31.34.72.4:8090", sources: [1,2] },
  camera15: { ip: "184.57.102.6:9090", sources: [1] },
  camera16: { ip: "139.64.168.120:8080", sources: [1,2,3,4] },
  camera17: { ip: "76.151.170.119:10001", sources: [1] },
  camera18: { ip: "73.170.86.90:8888", sources: [1,2,3,4,5,6,7] },
  camera19: { ip: "213.144.145.239:8090", sources: [1,2] },
  camera20: { ip: "158.174.215.151:8203", sources: [1] },
  camera21: { ip: "61.78.164.58:8089", sources: [1] },
  camera22: { ip: "85.93.53.175:8080", sources: [1,2] }
};

// Track active streams per user (optional)
const activeStreams = new Map();

app.get("/", (req, res) => res.send("Live Camera Backend running"));

// Live MJPEG proxy endpoint
app.get("/live", async (req, res) => {
  try {
    const { camera, source = 1, user = "default" } = req.query;

    if (!CAMERAS[camera]) return res.status(400).send("Invalid camera ID");
    if (!CAMERAS[camera].sources.includes(Number(source)))
      return res.status(400).send("Invalid source for this camera");

    const streamUrl = `http://${CAMERAS[camera].ip}/cam_${source}.cgi`;

    // Kill previous stream for this user
    if (activeStreams.has(user)) {
      const prev = activeStreams.get(user);
      if (!prev.destroyed) prev.destroy();
      activeStreams.delete(user);
    }

    const response = await fetch(streamUrl);
    if (!response.ok) return res.status(502).send("Camera stream not reachable");

    res.setHeader("Content-Type", "multipart/x-mixed-replace; boundary=--myboundary");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    activeStreams.set(user, response.body);
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Camera offline");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
