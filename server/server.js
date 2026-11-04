
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.APP_ORIGIN || false
}));

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    app: "AI Trading Pro",
    status: "online",
    mode: "TESTNET_ONLY",
    message: "Trading server is running"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    connected: true,
    tradingEnabled: false,
    environment: "BINANCE_FUTURES_TESTNET",
    message: "Real trading is disabled"
  });
});

app.get("/api/market/:symbol", async (req, res) => {
  try {
    const symbol = String(req.params.symbol).toUpperCase();

    if (!/^[A-Z0-9]{5,20}$/.test(symbol)) {
      return res.status(400).json({
        error: "Invalid trading symbol"
      });
    }

    const url = new URL(
      "https://testnet.binancefuture.com/fapi/v1/ticker/price"
    );

    url.searchParams.set("symbol", symbol);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        error: "Market data unavailable"
      });
    }

    const data = await response.json();

    res.json({
      symbol: data.symbol,
      price: data.price,
      environment: "TESTNET"
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.post("/api/trade", (req, res) => {
  return res.status(403).json({
    executed: false,
    message: "Order execution is disabled. Testnet validation is required."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Trading Pro server running on port ${PORT}`);
});
