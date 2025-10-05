// Simple OpenRouter API key monitor with Telegram notification
// 1. Install dependencies: npm install node-fetch@2 node-telegram-bot-api
// 2. Set your API key dan Telegram bot token/chat id di bawah

const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");

const OPENROUTER_KEY =
  "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";
const TELEGRAM_BOT_TOKEN = "8472362995:AAFwj-Bo3EVZfNK4o9yWfw27-O6-JrzwyJc";
const TELEGRAM_CHAT_ID = "7657158992";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

async function checkOpenRouter() {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    if (res.status !== 200) {
      const text = await res.text();
      await bot.sendMessage(
        TELEGRAM_CHAT_ID,
        `OpenRouter API error: ${res.status}\n${text}`
      );
      console.log("API error, notification sent.");
    } else {
      console.log("OpenRouter API OK");
    }
  } catch (err) {
    await bot.sendMessage(
      TELEGRAM_CHAT_ID,
      `OpenRouter API monitoring error: ${err.message}`
    );
    console.error("Monitoring error:", err);
  }
}

// Jalankan monitoring setiap 1 menit
checkOpenRouter();
setInterval(checkOpenRouter, 1 * 60 * 1000);
