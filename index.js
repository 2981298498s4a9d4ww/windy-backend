const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Map of cameras to their IPs and available sources
const CAMERAS = {
  "camera1": { ip: "139.64.168.120:8080", sources: [1,2,3,4] },
  "camera2": { ip: "72.199.200.5:8080", sources: [1,2] },
  "camera3": { ip: "76.151.170.119:10001", sources: [1] },
  "camera4": { ip: "73.170.86.90:8888", sources: [1,2,3,4,5,6,7] },
  "camera5": { ip: "213.144.145.239:8090", sources: [1,2] },
  "camera6": { ip: "158.174.215.151:8203", sources: [1] },
  "camera7": { ip: "61.78.164.58:8089", sources: [1] },
  "camera8": { ip: "fanfulla.ddns.net:8080", sources: [1] },
  "camera9": { ip: "85.93.53.175:8080", sources: [1,2] }
};

app.get("/", (req, res) => {
  res.send("Live Camera Backend running");
});

// /live endpoint with camera selection & source
app.get("/live", async (req, res) => {
  try {
    const { camera = "camera1", source = 1 } = req.query;

    if (!CAMERAS[camera]) return res.status(400).send("Invalid camera ID");
    if (!CAMERAS[camera].sources.includes(Number(source))) return res.status(400).send("Invalid source for this camera");

    const url = `http://${CAMERAS[camera].ip}/cam_${source}.cgi`;
    const response = await fetch(url);

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
