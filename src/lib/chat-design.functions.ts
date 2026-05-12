import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

/**
 * Conversational assistant for the design wizard.
 * Lets the user ask the AI to tweak the design (colors, lighting, furniture, mood…).
 * Returns a friendly Arabic reply plus an optional `regenerate` payload with
 * extra instructions to merge into the next image-generation call.
 */
export const chatDesign = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      messages: z.array(messageSchema).min(1).max(40),
      context: z.object({
        room: z.string().max(50).optional(),
        style: z.string().max(50).optional(),
        prompt: z.string().max(800).optional(),
        chips: z.array(z.string().max(60)).max(20).optional(),
        hasImage: z.boolean().optional(),
      }),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { reply: "خدمة الذكاء الاصطناعي غير متاحة الآن.", regenerate: null, error: "no_key" };

    const ctx = data.context;
    const systemPrompt = `أنت مصمم ديكور ذكي يساعد المستخدم على تحسين تصميم غرفته.
- ردّ دائمًا باللغة العربية بأسلوب ودود ومختصر (٢-٤ جمل).
- السياق الحالي:
  • نوع الغرفة: ${ctx.room || "غير محدد"}
  • الأسلوب: ${ctx.style || "غير محدد"}
  • ملاحظات سابقة: ${ctx.prompt || "لا يوجد"}
  • تفضيلات: ${ctx.chips?.join("، ") || "لا يوجد"}
  • هل تم توليد صورة؟ ${ctx.hasImage ? "نعم" : "لا"}
- إذا طلب المستخدم تعديل التصميم (ألوان، إضاءة، أثاث، أجواء…)، استخدم أداة propose_edit
  لإرجاع تعليمات إضافية واضحة بالإنجليزية تُدمَج في طلب التوليد التالي.
- إذا كان السؤال نقاشيًا فقط (نصائح، شرح، اقتراحات)، أجب نصيًا فقط بدون استدعاء الأداة.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...data.messages,
          ],
          tools: [{
            type: "function",
            function: {
              name: "propose_edit",
              description: "Propose concrete tweaks to regenerate the room design.",
              parameters: {
                type: "object",
                properties: {
                  reply: { type: "string", description: "Short friendly Arabic reply confirming the change." },
                  extraInstructions: { type: "string", description: "Concrete English instructions to append to the image prompt (colors, materials, lighting, furniture changes…)." },
                },
                required: ["reply", "extraInstructions"],
                additionalProperties: false,
              },
            },
          }],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error(`chat AI ${res.status}: ${txt}`);
        if (res.status === 429) return { reply: "تم تجاوز الحد، جرّب بعد قليل.", regenerate: null, error: "rate" };
        if (res.status === 402) return { reply: "نفد رصيد الذكاء الاصطناعي.", regenerate: null, error: "credits" };
        return { reply: "تعذّر الرد، حاول مرة أخرى.", regenerate: null, error: "ai" };
      }

      const json = await res.json();
      const msg = json?.choices?.[0]?.message;
      const toolCall = msg?.tool_calls?.[0];

      if (toolCall?.function?.name === "propose_edit") {
        try {
          const args = JSON.parse(toolCall.function.arguments || "{}");
          return {
            reply: args.reply || "حدّثت التعليمات، اضغط لإعادة التوليد.",
            regenerate: { extraInstructions: String(args.extraInstructions || "") },
            error: null,
          };
        } catch {
          /* fall through */
        }
      }

      const text: string = msg?.content || "تمام.";
      return { reply: text, regenerate: null, error: null };
    } catch (err) {
      console.error("chatDesign failed:", err);
      return { reply: "خطأ في الاتصال بخدمة الذكاء الاصطناعي.", regenerate: null, error: "network" };
    }
  });
