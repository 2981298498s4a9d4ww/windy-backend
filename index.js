const express = require("express");
const cors = require("cors");

// Node 18+ already has fetch built-in
// ❌ DO NOT use node-fetch on Render
// const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Put your REAL Windy API key here
const WINDY_KEY = "4o8vYbMixTgzP00zWvZaLKxM5nZByrb0";

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/webcams", async (req, res) => {
  try {
    const url = new URL("https://api.windy.com/webcams/api/v3/webcams");

    // ✅ CORRECT Windy v3 params
    url.searchParams.set("limit", "10");
    url.searchParams.set("include", "images,player,urls");
    url.searchParams.set("sort", "popularity");
    url.searchParams.set("countries", "US");
    url.searchParams.set("categories", "city");

    const response = await fetch(url.toString(), {
      headers: {
        "x-windy-api-key": WINDY_KEY
      }
    });

    const data = await response.json();

    // ✅ Windy response structure check
    if (!data || !data.webcams) {
      return res.status(500).json({
        error: "Invalid Windy API response",
        raw: data
      });
    }

    // ✅ Send ONLY what frontend needs
    res.json(data.webcams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
