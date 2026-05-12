import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Generates an interior design image using Lovable AI Gateway.
 * Uses Google's Gemini image preview model — no API key needed from user.
 * Returns a data-URL ready to render in <img src="...">.
 */
export const generateDesign = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      room: z.string().min(1).max(50),
      style: z.string().min(1).max(50),
      prompt: z.string().max(800).optional(),
      chips: z.array(z.string().max(60)).max(20).optional(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { imageUrl: null, error: "AI service not configured" };
    }

    const roomLabels: Record<string, string> = {
      living: "modern living room", bedroom: "bedroom",
      kitchen: "kitchen", office: "home office", bath: "bathroom",
    };
    const styleLabels: Record<string, string> = {
      modern: "contemporary modern", classic: "classic Arabic with traditional details",
      minimal: "minimal Scandinavian", luxury: "luxurious with gold and marble accents",
      scandinavian: "Scandinavian with light wood",
      industrial: "industrial with exposed brick and metal",
    };

    const chipsLine = data.chips?.length ? `Must include: ${data.chips.join(", ")}.` : "";
    const userLine = data.prompt ? `Notes: ${data.prompt}.` : "";

    const fullPrompt = [
      `Photorealistic interior design photograph of a ${roomLabels[data.room] ?? data.room}`,
      `in ${styleLabels[data.style] ?? data.style} style.`,
      "Warm cinematic lighting, magazine quality, ultra detailed, 8k.",
      "Cream and wood-brown palette with soft gold accents and nile blue cushions.",
      chipsLine, userLine,
    ].filter(Boolean).join(" ");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages: [{ role: "user", content: fullPrompt }],
          modalities: ["image", "text"],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error(`AI Gateway ${res.status}: ${txt}`);
        if (res.status === 429) return { imageUrl: null, error: "تم تجاوز الحد، جرّب بعد قليل" };
        if (res.status === 402) return { imageUrl: null, error: "نفد الرصيد، أضف رصيداً للذكاء الاصطناعي" };
        return { imageUrl: null, error: "تعذّر التوليد، حاول مرة أخرى" };
      }

      const json = await res.json();
      const url: string | undefined =
        json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!url) {
        console.error("AI Gateway returned no image:", JSON.stringify(json).slice(0, 500));
        return { imageUrl: null, error: "لم يصل تصميم — حاول مرة أخرى" };
      }
      return { imageUrl: url, error: null };
    } catch (err) {
      console.error("generateDesign failed:", err);
      return { imageUrl: null, error: "خطأ في الاتصال بخدمة الذكاء الاصطناعي" };
    }
  });
