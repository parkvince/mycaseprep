"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Mode, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";

function SessionInner() {
  const router = useRouter();
  const params = useSearchParams();

  const firm = (params.get("firm") ?? "mckinsey") as FirmKey;
  const difficulty = (params.get("difficulty") ?? "intermediate") as Difficulty;
  const mode = (params.get("mode") ?? "text") as Mode;
  const personality = (params.get("personality") ?? "strict") as "strict" | "friendly";
  const caseTitle = params.get("title") ?? "Case Interview";
  const casePrompt = params.get("prompt") ?? "";
  const caseContext = params.get("context") ?? "";

  const firmConfig = FIRM_CONFIGS[firm];

  const [transcript, setTranscript] = useState<Message[]>([
    {
      role: "assistant",
      content: `Welcome. I'm your ${firmConfig.name} interviewer today.\n\n${casePrompt}\n\nTake a moment to read through the prompt. When you're ready, feel free to ask any clarifying questions.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

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
    setLoading(true);

    try {
      const res = await fetch("/api/case/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firm,
          casePrompt,
          difficulty,
          transcript: newTranscript,
          hintsUsed,
          personality,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setTranscript((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHint = () => {
    setHintsUsed((h) => h + 1);
    setShowHint(true);
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const evalParams = new URLSearchParams({
      firm,
      difficulty,
      hintsUsed: hintsUsed.toString(),
      duration: elapsedTime.toString(),
      transcript: encodeURIComponent(JSON.stringify(transcript)),
    });

    router.push(`/case/feedback?${evalParams.toString()}`);
  };

  const startRecording = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Your browser does not support voice input. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const t = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(t);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
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
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: "20px",
              fontWeight: 500,
              color: "#111111",
              cursor: "pointer",
              marginRight: "8px",
            }}
            onClick={() => router.push("/")}
          >
            MyCasePrep
          </span>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--success)",
          }} />
          <span style={{ fontWeight: 500, fontSize: "14px" }}>{caseTitle}</span>
          <span style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            padding: "3px 10px",
            border: "1px solid var(--border)",
            borderRadius: "20px",
          }}>
            {firmConfig.name}
          </span>
          <span style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            padding: "3px 10px",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            textTransform: "capitalize",
          }}>
            {difficulty}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "15px", color: "var(--text-secondary)" }}>
            {formatTime(elapsedTime)}
          </span>
          <button
            className="btn-secondary"
            style={{ fontSize: "13px", padding: "8px 16px" }}
            onClick={handleHint}
          >
            Hint {hintsUsed > 0 ? `(${hintsUsed} used)` : ""}
          </button>
          <button
            style={{
              fontSize: "13px",
              padding: "8px 16px",
              background: "var(--danger)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
            }}
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
            style={{
              background: "var(--accent-glow)",
              borderBottom: "1px solid var(--accent)",
              padding: "12px 32px",
              fontSize: "13px",
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            <strong>Hint:</strong> {caseContext || "Think about the key drivers of the problem. Structure your answer using a MECE framework before diving into analysis."}
            <button
              onClick={() => setShowHint(false)}
              style={{ marginLeft: "16px", background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px" }}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
        {transcript.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: firmConfig.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
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
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: firmConfig.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "white",
            }}>
              {firmConfig.name.charAt(0)}
            </div>
            <div style={{
              padding: "16px 20px",
              borderRadius: "4px 16px 16px 16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: "14px",
            }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "20px 32px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Type your answer... (Shift+Enter for new line, Enter to submit)"
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
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                padding: "14px 20px",
                borderRadius: "10px",
                border: "none",
                background: isRecording ? "var(--danger)" : "var(--bg-elevated)",
                color: isRecording ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {isRecording ? "Stop Recording" : "Record"}
            </button>
          )}

          <button
            className="btn-primary"
            style={{ padding: "14px 24px", flexShrink: 0 }}
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
          >
            Submit
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>
          Take your time. The interviewer will not respond until you submit.
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