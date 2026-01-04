const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const WINDY_KEY = "PUT_KEY_LATER";

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/webcams", async (req, res) => {
  try {
    const url = new URL("https://api.windy.com/webcams/api/v3/webcams");

    url.searchParams.set("limit", "10");
    url.searchParams.set("sortKey", "popularity");
    url.searchParams.set("sortDirection", "desc");
    url.searchParams.set("include", "images,player");
    url.searchParams.set("countries", "US");
    url.searchParams.set("categories", "city");

    const response = await fetch(url.toString(), {
      headers: {
        "x-windy-api-key": WINDY_KEY
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
