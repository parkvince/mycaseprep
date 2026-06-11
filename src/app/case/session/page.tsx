"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Mode, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";

// Strips ** markdown and renders bold spans
function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
      : part
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

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const newTranscript = [...transcript, userMessage];
    setTranscript(newTranscript);
    setInput("");
    setInterimText("");
    setLoading(true);

    try {
      const res = await fetch("/api/case/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firm, casePrompt, difficulty, transcript: newTranscript, hintsUsed, personality }),
      });
      const data = await res.json();
      setTranscript(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sessionStorage.setItem("transcriptData", JSON.stringify({
      firm, difficulty, hintsUsed, duration: elapsedTime, transcript, caseTitle,
    }));
    router.push("/case/feedback");
  };

  const startRecording = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Voice input requires Chrome.");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInput(final);
      setInterimText(interim);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setInterimText("");
  };

  const stopAndSubmit = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setInterimText("");
    if (input.trim()) sendMessage(input);
  };

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* Top Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{ fontFamily: "Cormorant, serif", fontSize: "20px", fontWeight: 500, color: "#111111", cursor: "pointer", marginRight: "8px" }}
            onClick={() => router.push("/")}
          >
            MyCasePrep
          </span>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
          <span style={{ fontWeight: 500, fontSize: "14px" }}>{caseTitle}</span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "3px 10px", border: "1px solid var(--border)", borderRadius: "20px" }}>
            {firmConfig.name}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "3px 10px", border: "1px solid var(--border)", borderRadius: "20px", textTransform: "capitalize" }}>
            {difficulty}
          </span>
          {mode === "voice" && (
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "3px 10px", border: "1px solid var(--border)", borderRadius: "20px" }}>
              Voice
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "15px", color: "var(--text-secondary)" }}>
            {formatTime(elapsedTime)}
          </span>
          <button
            className="btn-secondary"
            style={{ fontSize: "13px", padding: "8px 16px" }}
            onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }}
          >
            Hint {hintsUsed > 0 ? `(${hintsUsed})` : ""}
          </button>
          <button
            style={{ fontSize: "13px", padding: "8px 16px", background: "var(--danger)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}
            onClick={handleEndSession}
          >
            End & Get Feedback
          </button>
        </div>
      </div>

      {/* Hint Panel */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: "var(--accent-glow)", borderBottom: "1px solid var(--accent)", padding: "12px 32px", fontSize: "13px", color: "var(--accent)", flexShrink: 0 }}
          >
            <strong>Hint:</strong> {caseContext || "Think about the key drivers of the problem. Structure your answer using a MECE framework before diving into analysis."}
            <button onClick={() => setShowHint(false)} style={{ marginLeft: "16px", background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px" }}>
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {transcript.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "12px", alignItems: "flex-start" }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", background: firmConfig.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0,
              }}>
                {firmConfig.name.charAt(0)}
              </div>
            )}
            <div style={{
              maxWidth: "680px",
              padding: "16px 20px",
              borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              background: msg.role === "user" ? "var(--accent)" : "var(--bg-card)",
              border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              fontSize: "15px",
              lineHeight: 1.7,
              color: msg.role === "user" ? "#ffffff" : "var(--text-primary)",
            }}>
              {renderContent(msg.content)}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", background: firmConfig.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700, color: "white",
            }}>
              {firmConfig.name.charAt(0)}
            </div>
            <div style={{ padding: "16px 20px", borderRadius: "4px 16px 16px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-secondary)" }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: "20px 32px", borderTop: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>

        {/* Voice mode recording UI */}
        {mode === "voice" && (
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: "12px" }}
              >
                <div style={{
                  padding: "12px 16px",
                  background: "rgba(220,38,38,0.06)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--danger)", flexShrink: 0 }}
                  />
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", flex: 1, lineHeight: 1.5, margin: 0 }}>
                    {interimText || input || "Listening..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder={mode === "voice" ? "Your spoken words will appear here..." : "Type your answer... (Shift+Enter for new line, Enter to submit)"}
            style={{
              flex: 1,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "14px 16px",
              color: "var(--text-primary)",
              fontSize: "15px",
              fontFamily: "DM Sans, sans-serif",
              resize: "none",
              minHeight: "52px",
              maxHeight: "160px",
              outline: "none",
              lineHeight: 1.6,
            }}
            rows={2}
          />

          {mode === "voice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: `2px solid ${isRecording ? "var(--danger)" : "var(--border)"}`,
                  background: isRecording ? "rgba(220,38,38,0.08)" : "var(--bg-elevated)",
                  color: isRecording ? "var(--danger)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                {isRecording ? "⏹ Stop" : "🎙 Record"}
              </button>
              {isRecording && input.trim() && (
                <button
                  onClick={stopAndSubmit}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--accent)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Submit →
                </button>
              )}
            </div>
          )}

          {mode !== "voice" && (
            <button
              className="btn-primary"
              style={{ padding: "14px 24px", flexShrink: 0 }}
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              Submit
            </button>
          )}

          {mode === "voice" && !isRecording && (
            <button
              className="btn-primary"
              style={{ padding: "14px 24px", flexShrink: 0 }}
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              Submit
            </button>
          )}
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>
          {mode === "voice"
            ? "Press Record to speak, then Submit when done."
            : "Take your time. The interviewer will not respond until you submit."}
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