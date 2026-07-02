import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or uses the placeholder. Using demo mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Coach endpoint
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const client = getGeminiClient();
    if (!client) {
      // High-quality mock responses for offline testing
      const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "Consistency is the bridge between goals and accomplishment. Alex, remember that your body adapts to the demands you place on it. What's our primary focus today?";
      
      if (lastMessage.includes("workout") || lastMessage.includes("exercise") || lastMessage.includes("push") || lastMessage.includes("pull")) {
        reply = "Looking at your Level 42 Strength profile, your Push Day A workout is highly optimized. I recommend keeping rest periods to exactly 90 seconds on compound moves to maximize metabolic stress. Let's get that work in!";
      } else if (lastMessage.includes("eat") || lastMessage.includes("food") || lastMessage.includes("meal") || lastMessage.includes("protein") || lastMessage.includes("calorie")) {
        reply = "Your target for today is 2,500 kCal with at least 180g of protein. Your lunch of Quinoa Chicken Salad was spot on. For dinner, aim for lean turkey or salmon to hit your final protein threshold without spilling over your fat cap.";
      } else if (lastMessage.includes("sleep") || lastMessage.includes("rest") || lastMessage.includes("tired")) {
        reply = "Your resting heart rate spike this morning indicates a elevated systemic stress level. Prioritize 8 hours of deep, high-quality sleep tonight. Keep the hydration high (3.0L goal) to aid fast neural recovery.";
      }
      
      return res.json({ text: reply + "\n\n*(Coach AI is currently running in offline preview mode. Connect a real Gemini API Key in Settings > Secrets to unlock full conversational power!)*" });
    }

    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: "You are Coach AI, the digital elite trainer for AIFit Elite, a premium fitness platform. Your voice is authoritative, motivational, highly scientific, and focused on peak physical optimization. You give highly structured, analytical responses about workouts, nutrition, recovery, and bio-hacking. Keep your tone direct, energetic, and professional. Always refer to the user as Alex, a level 42 athlete. Limit responses to 3-4 concise, punchy paragraphs.",
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: err.message || "Error generating content" });
  }
});

// Serve static assets or mount Vite in development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite startup failed:", err);
});
