const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    console.error("Chyba GPT:", error);
    res.status(500).json({ error: "Chyba při generování receptu." });
  }
});

app.listen(3002, () => {
  console.log("🚀 Server běží na portu 3002");
});
