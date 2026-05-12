import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Send, Loader2, Wand2, X, MessageCircle } from "lucide-react";
import { chatDesign } from "@/lib/chat-design.functions";
import { Button } from "@/components/ui/button";

export type ChatMsg = { role: "user" | "assistant"; content: string };

interface AIChatProps {
  context: {
    room?: string;
    style?: string;
    prompt?: string;
    chips?: string[];
    hasImage?: boolean;
  };
  /** Called when the AI proposes concrete edits. The parent should re-run generation. */
  onApplyEdit: (extraInstructions: string) => void | Promise<void>;
  applying?: boolean;
}

export function AIChat({ context, onApplyEdit, applying }: AIChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "مرحبًا 👋 أخبرني بأي تعديل تريده على التصميم — مثلاً: «خلّي الإضاءة أدفأ» أو «ضيف نباتات».وأنا هاحدّث الطلب وأعيد التوليد." },
  ]);
  const [pending, setPending] = useState<{ reply: string; extra: string } | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chat = useServerFn(chatDesign);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, pending]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next, context } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      if (res.regenerate?.extraInstructions) {
        setPending({ reply: res.reply, extra: res.regenerate.extraInstructions });
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "تعذّر الرد، حاول مرة أخرى." }]);
    } finally {
      setLoading(false);
    }
  };

  const apply = async () => {
    if (!pending) return;
    await onApplyEdit(pending.extra);
    setPending(null);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-40 size-14 rounded-2xl bg-gradient-gold text-gold-foreground shadow-glow grid place-items-center hover:scale-105 transition-transform"
        aria-label="افتح المحادثة"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-40 w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-10rem))] rounded-3xl bg-card border border-border/60 shadow-elegant flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-gradient-hero flex items-center gap-2">
            <div className="size-8 rounded-xl bg-gradient-gold grid place-items-center">
              <Sparkles className="size-4 text-gold-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">المساعد الذكي</p>
              <p className="text-[11px] text-muted-foreground">اطلب أي تعديل على التصميم</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-gradient-gold text-gold-foreground rounded-bl-sm"
                      : "bg-secondary text-foreground rounded-br-sm",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-secondary rounded-2xl px-3.5 py-2 text-sm flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" />
                  يفكر…
                </div>
              </div>
            )}
            {pending && (
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-3 space-y-2 animate-fade-in">
                <p className="text-xs font-semibold text-foreground">جاهز لتطبيق التعديل؟</p>
                <p className="text-[11px] text-muted-foreground line-clamp-3">{pending.extra}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="gold" onClick={apply} disabled={applying} className="flex-1">
                    {applying ? <><Loader2 className="size-3.5 animate-spin" /> يولّد…</> : <><Wand2 className="size-3.5" /> طبّق وأعد التوليد</>}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPending(null)} disabled={applying}>
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-background/50">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="مثلاً: خلّي الجدار أزرق غامق…"
                rows={1}
                className="flex-1 resize-none rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 max-h-28"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="size-10 rounded-xl bg-gradient-gold text-gold-foreground grid place-items-center disabled:opacity-50 hover:shadow-glow transition-shadow shrink-0"
                aria-label="إرسال"
              >
                <Send className="size-4 -scale-x-100" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
