export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, difficulty } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic required" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: "GROQ_API_KEY not set on server" });

  const prompt = `You are a pub quiz master. Generate exactly 10 trivia questions about "${topic}" at ${difficulty || "medium"} difficulty.

Return ONLY a valid JSON array, no markdown, no explanation, no extra text:
[
  {
    "q": "Question text here?",
    "options": ["A) option one", "B) option two", "C) option three", "D) option four"],
    "answer": "A",
    "fact": "A short interesting fact about the answer (1 sentence)."
  }
]

Rules:
- Each question must have exactly 4 options labeled A) B) C) D)
- The "answer" field is just the letter: A, B, C, or D
- Make questions fun, surprising, and genuinely challenging for a bar setting
- The fact should be something people would want to share with the table`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        temperature: 0.8,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || "Groq error" });

    const text = data.choices?.[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(clean);
    res.status(200).json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate trivia: " + err.message });
  }
}
