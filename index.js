const express = require("express");
const cors = require("cors");
const { request } = require("http"); // for MJPEG streaming

const app = express();
app.use(cors());
app.use(express.json());

// List of all cameras
const cameras = [
  { id: "cam1", name: "139.64.168.120 cam 1", url: "http://139.64.168.120:8080/cam_1.cgi" },
  { id: "cam2", name: "139.64.168.120 cam 2", url: "http://139.64.168.120:8080/cam_2.cgi" },
  { id: "cam3", name: "139.64.168.120 cam 3", url: "http://139.64.168.120:8080/cam_3.cgi" },
  { id: "cam4", name: "139.64.168.120 cam 4", url: "http://139.64.168.120:8080/cam_4.cgi" },

  { id: "cam5", name: "72.199.200.5 cam 1", url: "http://72.199.200.5:8080/cam_1.cgi" },
  { id: "cam6", name: "72.199.200.5 cam 2", url: "http://72.199.200.5:8080/cam_2.cgi" },

  { id: "cam7", name: "76.151.170.119 cam 1", url: "http://76.151.170.119:10001/cam_1.cgi" },

  { id: "cam8", name: "73.170.86.90 cam 1", url: "http://73.170.86.90:8888/cam_1.cgi" },
  { id: "cam9", name: "73.170.86.90 cam 2", url: "http://73.170.86.90:8888/cam_2.cgi" },
  { id: "cam10", name: "73.170.86.90 cam 3", url: "http://73.170.86.90:8888/cam_3.cgi" },
  { id: "cam11", name: "73.170.86.90 cam 4", url: "http://73.170.86.90:8888/cam_4.cgi" },
  { id: "cam12", name: "73.170.86.90 cam 5", url: "http://73.170.86.90:8888/cam_5.cgi" },
  { id: "cam13", name: "73.170.86.90 cam 6", url: "http://73.170.86.90:8888/cam_6.cgi" },
  { id: "cam14", name: "73.170.86.90 cam 7", url: "http://73.170.86.90:8888/cam_7.cgi" },

  { id: "cam15", name: "213.144.145.239 cam 1", url: "http://213.144.145.239:8090/cam_1.cgi" },
  { id: "cam16", name: "213.144.145.239 cam 2", url: "http://213.144.145.239:8090/cam_2.cgi" },

  { id: "cam17", name: "158.174.215.151 cam 1", url: "http://158.174.215.151:8203/cam_1.cgi" },

  { id: "cam18", name: "61.78.164.58 cam 1", url: "http://61.78.164.58:8089/cam_1.cgi" },

  { id: "cam19", name: "fanfulla.ddns.net cam 1", url: "http://fanfulla.ddns.net:8080/cam_1.cgi" },
  { id: "cam20", name: "fanfulla.ddns.net cam 2", url: "http://fanfulla.ddns.net:8080/cam_2.cgi" },
  { id: "cam21", name: "fanfulla.ddns.net cam 3", url: "http://fanfulla.ddns.net:8080/cam_3.cgi" },

  { id: "cam22", name: "85.93.53.175 cam 1", url: "http://85.93.53.175:8080/cam_1.cgi" },
  { id: "cam23", name: "85.93.53.175 cam 2", url: "http://85.93.53.175:8080/cam_2.cgi" },
];

// Root
app.get("/", (req, res) => {
  res.send("Live Camera Backend Running");
});

// List all cameras
app.get("/live-cameras", (req, res) => {
  res.json(cameras);
});

// Stream individual camera by ID
app.get("/live/:id", (req, res) => {
  const cam = cameras.find(c => c.id === req.params.id);
  if (!cam) return res.status(404).send("Camera not found");

  try {
    request(cam.url, (response) => {
      res.setHeader("Content-Type", "multipart/x-mixed-replace; boundary=--myboundary");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      response.pipe(res);
    }).on("error", (err) => {
      console.error(err);
      res.status(500).send("Camera offline");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Camera offline");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
