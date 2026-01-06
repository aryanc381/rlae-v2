import { SarvamAIClient } from "sarvamai";
import dotenv from "dotenv";

dotenv.config();

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY!,
});

export async function callSarvam(PROMPT: string) {
  const response = await client.chat.completions({
    messages: [
      {
        role: "user",
        content: PROMPT,
      },
    ],
  });

  const raw = response.choices[0]?.message.content?.trim();

  if (!raw) {
    throw new Error("Sarvam returned empty response");
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Sarvam returned invalid JSON:");
    console.error(raw);

    throw new Error("Metric evaluator returned invalid JSON");
  }
}
