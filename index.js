const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();

// Дозволяє запити з будь-якого домену (наприклад, з твого сайту)
app.use(cors());
app.use(bodyParser.json());

// Ініціалізація OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Основний endpoint
app.post("/recipe", async (req, res) => {
  const { ingredients } = req.body;

  const prompt = `Navrhni jednoduchý a chutný recept na základě těchto ingrediencí: ${ingredients}.
Uveď název receptu, seznam ingrediencí a kroky přípravy.`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const recipe = chatResponse.choices[0].message.content;
    res.json({ recipe });
  } catch (error) {
    console.error("❌ Chyba GPT:", error.message || error);
    res.status(500).json({ error: "Chyba při generování receptu." });
  }
});

// Порт 3002 локально або значення з .env (на Render)
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server běží na portu ${PORT}`);
});
