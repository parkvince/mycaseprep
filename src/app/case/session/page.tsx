"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Mode, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { ArrowRight, Clock, Lightbulb, X } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const FIRM_SHORT: Record<string, string> = {
  mckinsey: "McKinsey", bain: "Bain", bcg: "BCG", ey: "EY-Parthenon",
  deloitte: "Deloitte", kpmg: "KPMG", pwc: "PwC", rolandberger: "Roland Berger",
  accenture: "Accenture", "oliver-wyman": "Oliver Wyman", kearney: "Kearney",
  lek: "L.E.K.", "monitor-deloitte": "Monitor Deloitte", ibm: "IBM",
  "capital-one": "Capital One", huron: "Huron",
};

function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong> : part
  );
}

function SessionInner() {
  const router = useRouter();

  const [firm, setFirm] = useState<FirmKey>("mckinsey");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [mode, setMode] = useState<Mode>("text");
  const [personality, setPersonality] = useState<"strict" | "friendly">("strict");
  const [caseTitle, setCaseTitle] = useState("Case Interview");
  const [casePrompt, setCasePrompt] = useState("");
  const [caseContext, setCaseContext] = useState("");
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("caseData");
    if (raw) {
      const data = JSON.parse(raw);
      setFirm(data.firm ?? "mckinsey");
      setDifficulty(data.difficulty ?? "intermediate");
      setMode(data.mode ?? "text");
      setPersonality(data.personality ?? "strict");
      setCaseTitle(data.title ?? "Case Interview");
      setCasePrompt(data.prompt ?? "");
      setCaseContext(data.context ?? "");
      setAiProvider(data.aiProvider ?? null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !casePrompt) return;
    setTranscript([{
      role: "assistant",
      content: `Welcome. I'm your ${FIRM_CONFIGS[firm].name} interviewer today.\n\n${casePrompt}\n\nTake a moment to read through the prompt. When you're ready, feel free to ask any clarifying questions.`,
      timestamp: new Date(),
    }]);
  }, [ready, casePrompt, firm]);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, loading]);

  const firmConfig = FIRM_CONFIGS[firm];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    const userMessage: Message = { role: "user", content: content.trim(), timestamp: new Date() };
    const newTranscript = [...transcript, userMessage];
    setTranscript(newTranscript);
    setInput("");
    setInterimText("");
    setLoading(true);
    try {
      const res = await fetch("/api/case/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firm, casePrompt, difficulty, transcript: newTranscript, hintsUsed, personality, preferredProvider: aiProvider }),
      });
      const data = await res.json();
      if (data.provider) setAiProvider(data.provider);
      setTranscript(prev => [...prev, { role: "assistant", content: data.response, timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setTranscript(prev => [...prev, { role: "assistant", content: "Sorry — something went wrong generating a reply. Please try sending your response again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sessionStorage.setItem("transcriptData", JSON.stringify({
      firm, difficulty, hintsUsed, duration: elapsedTime, transcript, caseTitle, aiProvider,
    }));
    router.push("/case/feedback");
  };

  const startRecording = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { alert("Voice input requires Chrome."); return; }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let final = ""; let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInput(final); setInterimText(interim);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => { recognitionRef.current?.stop(); setIsRecording(false); setInterimText(""); };
  const stopAndSubmit = () => { recognitionRef.current?.stop(); setIsRecording(false); setInterimText(""); if (input.trim()) sendMessage(input); };

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "oklch(0.985 0.005 285)", color: "var(--hp-foreground)", fontFamily: FONT }}>

      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 1.75rem", height: "58px",
        borderBottom: "1px solid var(--hp-border)",
        background: "white", flexShrink: 0,
        boxShadow: "0 1px 4px oklch(0.4 0.05 280 / 5%)",
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <span
            onClick={() => router.push("/")}
            style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--hp-foreground)", cursor: "pointer", fontFamily: FONT }}
          >
            mycaseprep
          </span>
          <span style={{ width: "1px", height: "16px", background: "var(--hp-border)", display: "block" }} />
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--hp-foreground)", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {caseTitle}
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "var(--hp-primary-soft)", color: "var(--hp-primary)", textTransform: "capitalize" }}>
            {FIRM_SHORT[firm] ?? firmConfig.name}
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "var(--hp-border)", color: "var(--hp-soft-foreground)", textTransform: "capitalize" }}>
            {difficulty}
          </span>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", color: "var(--hp-soft-foreground)", fontVariantNumeric: "tabular-nums" }}>
            <Clock size={13} />
            {formatTime(elapsedTime)}
          </div>
          <button
            onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }}
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", height: "32px", padding: "0 0.875rem", borderRadius: "9999px", border: "1px solid var(--hp-border)", background: "white", color: "var(--hp-soft-foreground)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--hp-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--hp-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--hp-border)"; (e.currentTarget as HTMLElement).style.color = "var(--hp-soft-foreground)"; }}
          >
            <Lightbulb size={13} />
            Hint{hintsUsed > 0 ? ` (${hintsUsed})` : ""}
          </button>
          <button
            onClick={handleEndSession}
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", height: "32px", padding: "0 0.875rem", borderRadius: "9999px", border: "none", background: "#dc2626", color: "white", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "opacity 0.15s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            End session <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Hint panel */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "var(--hp-primary-soft)", borderBottom: "1px solid color-mix(in oklab, var(--hp-primary) 20%, transparent)", padding: "0.75rem 1.75rem", fontSize: "0.82rem", color: "var(--hp-foreground)", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Lightbulb size={14} style={{ color: "var(--hp-primary)", flexShrink: 0 }} />
            <span style={{ flex: 1, lineHeight: 1.6 }}>
              {caseContext || "Think about the key drivers of the problem. Structure your answer using a MECE framework before diving into analysis."}
            </span>
            <button onClick={() => setShowHint(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--hp-soft-foreground)", display: "flex", alignItems: "center" }}>
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {transcript.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "0.75rem", alignItems: "flex-start" }}
          >
            {msg.role === "assistant" && (
              <div style={{ width: "30px", height: "30px", borderRadius: "9999px", background: "var(--hp-primary)", display: "grid", placeItems: "center", fontSize: "0.7rem", fontWeight: 700, color: "white", flexShrink: 0, marginTop: "2px" }}>
                {(FIRM_SHORT[firm] ?? firmConfig.name).charAt(0)}
              </div>
            )}
            <div style={{
              maxWidth: "680px", padding: "0.875rem 1.1rem",
              borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
              background: msg.role === "user" ? "var(--hp-primary)" : "white",
              border: msg.role === "assistant" ? "1px solid var(--hp-border)" : "none",
              fontSize: "0.9rem", lineHeight: 1.75,
              color: msg.role === "user" ? "white" : "var(--hp-foreground)",
              boxShadow: msg.role === "assistant" ? "0 1px 4px oklch(0.4 0.05 280 / 5%)" : "none",
            }}>
              {renderContent(msg.content)}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "9999px", background: "var(--hp-primary)", display: "grid", placeItems: "center", fontSize: "0.7rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
              {(FIRM_SHORT[firm] ?? firmConfig.name).charAt(0)}
            </div>
            <div style={{ padding: "0.875rem 1.1rem", borderRadius: "4px 14px 14px 14px", background: "white", border: "1px solid var(--hp-border)", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--hp-soft-foreground)" }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "1rem 1.75rem 1.25rem", borderTop: "1px solid var(--hp-border)", background: "white", flexShrink: 0 }}>

        {/* Voice recording indicator */}
        {mode === "voice" && (
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: "0.75rem" }}
              >
                <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#dc2626", flexShrink: 0 }}
                  />
                  <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", flex: 1, lineHeight: 1.5, margin: 0 }}>
                    {interimText || input || "Listening..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={mode === "voice" ? "Your spoken words will appear here..." : "Type your response... (Enter to submit, Shift+Enter for new line)"}
            style={{
              flex: 1, background: "oklch(0.985 0.005 285)",
              border: "1px solid var(--hp-border)", borderRadius: "10px",
              padding: "0.75rem 1rem", color: "var(--hp-foreground)",
              fontSize: "0.9rem", fontFamily: FONT, resize: "none",
              minHeight: "48px", maxHeight: "160px", outline: "none",
              lineHeight: 1.65, transition: "border-color 0.15s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--hp-border)")}
            rows={2}
          />

          {mode === "voice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                style={{ height: "40px", padding: "0 1rem", borderRadius: "10px", border: `1.5px solid ${isRecording ? "#dc2626" : "var(--hp-border)"}`, background: isRecording ? "#fef2f2" : "white", color: isRecording ? "#dc2626" : "var(--hp-soft-foreground)", cursor: "pointer", fontSize: "0.8rem", fontFamily: FONT, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}
              >
                {isRecording ? "Stop" : "Record"}
              </button>
              {isRecording && input.trim() && (
                <button
                  onClick={stopAndSubmit}
                  style={{ height: "40px", padding: "0 1rem", borderRadius: "10px", border: "none", background: "var(--hp-primary)", color: "white", cursor: "pointer", fontSize: "0.8rem", fontFamily: FONT, fontWeight: 600 }}
                >
                  Submit
                </button>
              )}
            </div>
          )}

          {(mode !== "voice" || !isRecording) && (
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                height: "48px", padding: "0 1.25rem", borderRadius: "10px", border: "none",
                background: "var(--hp-primary)", color: "white",
                fontSize: "0.875rem", fontWeight: 700, fontFamily: FONT,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.45 : 1,
                boxShadow: "0 2px 0 oklch(0.4 0.16 285)",
                transition: "opacity 0.15s", flexShrink: 0,
                display: "flex", alignItems: "center", gap: "0.35rem",
              }}
            >
              Send <ArrowRight size={15} />
            </button>
          )}
        </div>

        <p style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)", marginTop: "0.5rem" }}>
          {mode === "voice" ? "Press record to speak, then submit when done." : "The interviewer will not respond until you submit."}
        </p>
      </div>
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionInner />
    </Suspense>
  );
}