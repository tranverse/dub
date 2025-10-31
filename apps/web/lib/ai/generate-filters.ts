"use server";

import { VALID_ANALYTICS_FILTERS } from "@/lib/analytics/constants";
import { analyticsQuerySchema } from "@/lib/zod/schemas/analytics";
import { COUNTRY_CODES } from "@dub/utils";
import z from "../zod";

export async function generateFilters(prompt: string) {
  const schema = analyticsQuerySchema
    .pick({
      ...(VALID_ANALYTICS_FILTERS.reduce((acc, filter) => {
        acc[filter] = true;
        return acc;
      }, {}) as any),
    })
    .merge(
      z.object({
        country: z
          .enum(COUNTRY_CODES)
          .optional()
          .describe("2-letter country code, e.g. US or VN."),
      }),
    );

  console.log("🧠 [generateFilters] Prompt gửi lên:", prompt);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      "X-Title": "Generate Filters",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that extracts structured analytics filters (country, device, referrer, etc.) from user queries. Return a JSON object only.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  console.log("📡 [generateFilters] Status:", res.status);
  const text = await res.text();
  console.log("📦 [generateFilters] Raw response:", text);

  let data;
  try {
    const json = JSON.parse(text);
    data = json?.choices?.[0]?.message?.content?.[0]?.text
      ? json.choices[0].message.content[0].text
      : json?.choices?.[0]?.message?.content;

    console.log("💬 [generateFilters] Extracted content:", data);
  } catch (err) {
    console.error("❌ [generateFilters] JSON parse error:", err);
    return {};
  }

  // Parse JSON mà AI trả về
  let parsedData;
  try {
    parsedData = JSON.parse(data);
    console.log("✅ [generateFilters] Parsed object:", parsedData);
  } catch (err) {
    console.error("⚠️ [generateFilters] Failed to parse AI JSON:", err);
    parsedData = {};
  }

  // Validate bằng schema (nếu cần)
  const validated = schema.safeParse(parsedData);
  if (!validated.success) {
    console.warn("⚠️ [generateFilters] Schema validation failed:", validated.error);
    return {};
  }

  console.log("🎯 [generateFilters] Final filters:", validated.data);

  return validated.data;
}
