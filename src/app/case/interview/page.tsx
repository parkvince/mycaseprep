"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";

const INTERVIEWERS = [
  {
    name: "James",
    title: "Senior Engagement Manager",
    gender: "male",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
  },
  {
    name: "Sarah",
    title: "Senior Engagement Manager",
    gender: "female",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=face",
  },
];

const INTERVIEWER = INTERVIEWERS[Math.floor(Math.random() * INTERVIEWERS.length)];

// Strips ** markdown and renders bold spans
function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
      : part
  );
}

function InterviewInner() {
  const router = useRouter();

  const [firm, setFirm] = useState<FirmKey>("mckinsey");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [personality, setPersonality] = useState<"strict" | "friendly">("strict");
  const [caseTitle, setCaseTitle] = useState("Case Interview");
  const [casePrompt, setCasePrompt] = useState("");
  const [caseContext, setCaseContext] = useState("");
  const [ready, setReady] = useState(false);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [interimText, setInterimText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCasePrompt, setShowCasePrompt] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userVideoEnabled, setUserVideoEnabled] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [turnState, setTurnState] = useState<"interviewer" | "you">("interviewer");

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("caseData");
    if (raw) {
      const data = JSON.parse(raw);
      setFirm(data.firm ?? "mckinsey");
      setDifficulty(data.difficulty ?? "intermediate");
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
      content: `Good morning. I'm ${INTERVIEWER.name}, Senior Engagement Manager at ${FIRM_CONFIGS[firm].name}. Thank you for taking the time to meet with me today.\n\n${casePrompt}\n\nPlease take a moment to read through the case. Feel free to ask any clarifying questions when you're ready.`,
      timestamp: new Date(),
    }]);
  }, [ready, casePrompt, firm]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      synthRef.current?.cancel();
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const firmConfig = FIRM_CONFIGS[firm];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    // Strip markdown before speaking
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = synthRef.current.getVoices();

    let preferred;
    if (INTERVIEWER.gender === "male") {
      preferred = voices.find(v =>
        v.name.includes("Daniel") || v.name.includes("Alex") ||
        v.name.includes("Google UK English Male") || v.name.includes("Arthur")
      ) ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"));
    } else {
      preferred = voices.find(v =>
        v.name.includes("Samantha") || v.name.includes("Victoria") ||
        v.name.includes("Karen") || v.name.includes("Google UK English Female")
      ) ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
    }

    if (preferred) utterance.voice = preferred;
    utterance.rate = INTERVIEWER.gender === "female" ? 0.94 : 0.92;
    utterance.pitch = INTERVIEWER.gender === "female" ? 1.05 : 0.95;
    utterance.volume = 1;
    setIsSpeaking(true);
    setTurnState("interviewer");
    utterance.onend = () => {
      setIsSpeaking(false);
      setTurnState("you");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setTurnState("you");
    };
    synthRef.current.speak(utterance);
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      setUserVideoEnabled(true);
    } catch {
      // camera denied — continue without video
    }
    setSessionStarted(true);
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    setTimeout(() => speak(transcript[0]?.content ?? ""), 800);
  };

  const startListening = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Please use Chrome for voice input.");
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
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInput(final);
      setInterimText(interim);
    };
    recognition.onend = () => { setIsListening(false); setInterimText(""); };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
  };

  const stopAndSubmit = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
    if (input.trim()) sendMessage(input);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    synthRef.current?.cancel();
    setIsSpeaking(false);

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
    setTurnState("interviewer");

    try {
      const res = await fetch("/api/case/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firm, casePrompt, difficulty, transcript: newTranscript, hintsUsed, personality }),
      });
      const data = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.response, timestamp: new Date() };
      setTranscript(prev => [...prev, aiMessage]);
      speak(data.response);
    } catch (err) {
      console.error(err);
      setTurnState("you");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    synthRef.current?.cancel();
    streamRef.current?.getTracks().forEach(t => t.stop());
    sessionStorage.setItem("transcriptData", JSON.stringify({
      firm, difficulty, hintsUsed, duration: elapsedTime, transcript, caseTitle,
    }));
    router.push("/case/feedback");
  };

  // PRE-SESSION SCREEN
  if (!sessionStarted) {
    return (
      <main style={{
        height: "100vh",
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        color: "#ffffff",
        padding: "40px",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "12px" }}>
            {firmConfig.name} · Live Interview
          </p>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 400, marginBottom: "8px" }}>
            {caseTitle}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
            {difficulty} difficulty
          </p>
        </div>

        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.12)",
        }}>
          <img src={INTERVIEWER.image} alt={INTERVIEWER.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "3px" }}>{INTERVIEWER.name}</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{INTERVIEWER.title}, {firmConfig.name}</p>
        </div>

        {/* Case preview */}
        {casePrompt && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "20px 24px",
            maxWidth: "520px",
            width: "100%",
          }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>
              Case Brief
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {casePrompt}
            </p>
          </div>
        )}

        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          padding: "14px 20px",
          maxWidth: "400px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
            The interviewer will speak first. Use voice or text to respond. You can mute the interviewer at any time.
          </p>
        </div>

        <button
          onClick={startSession}
          style={{
            background: "#ffffff",
            color: "#111111",
            border: "none",
            borderRadius: "8px",
            padding: "13px 40px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Join Interview
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "transparent", color: "rgba(255,255,255,0.3)", border: "none", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
        >
          ← Back
        </button>
      </main>
    );
  }

  // ACTIVE SESSION
  return (
    <main style={{ height: "100vh", background: "#0f0f0f", display: "flex", flexDirection: "column", color: "#ffffff", overflow: "hidden" }}>

      {/* Top Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
        background: "#111111",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "18px", fontWeight: 500 }}>MyCasePrep</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Live · {firmConfig.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Turn indicator */}
          <div style={{
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            background: turnState === "you" ? "rgba(99,102,241,0.15)" : "rgba(34,197,94,0.15)",
            color: turnState === "you" ? "#818cf8" : "#22c55e",
            border: `1px solid ${turnState === "you" ? "rgba(99,102,241,0.3)" : "rgba(34,197,94,0.3)"}`,
            transition: "all 0.3s",
          }}>
            {loading ? "Thinking..." : isSpeaking ? "Interviewer speaking" : "Your turn"}
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            {formatTime(elapsedTime)}
          </span>
          <button
            onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }}
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          >
            Hint {hintsUsed > 0 ? `(${hintsUsed})` : ""}
          </button>
          <button
            onClick={() => setShowCasePrompt(v => !v)}
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          >
            Case
          </button>
          <button
            onClick={handleEndSession}
            style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            End
          </button>
        </div>
      </div>

      {/* Case Prompt Overlay */}
      <AnimatePresence>
        {showCasePrompt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: "48px",
              right: "20px",
              width: "420px",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "20px",
              zIndex: 200,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Case Brief
              </span>
              <button
                onClick={() => setShowCasePrompt(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
              {casePrompt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: "10px 20px", background: "rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.2)", fontSize: "12px", color: "rgba(255,255,255,0.7)", flexShrink: 0 }}
          >
            <strong style={{ color: "#818cf8" }}>Hint:</strong>{" "}
            {caseContext || "Think about the key drivers of the problem. Structure your answer using a MECE framework."}
            <button onClick={() => setShowHint(false)} style={{ marginLeft: "8px", background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: "12px" }}>
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 340px", overflow: "hidden" }}>

        {/* Video Area */}
        <div style={{ display: "flex", flexDirection: "column", padding: "16px", gap: "12px", overflow: "hidden" }}>

          {/* Interviewer */}
          <div style={{
            flex: 1,
            borderRadius: "14px",
            overflow: "hidden",
            background: "#1a1a1a",
            position: "relative",
            border: isSpeaking ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.06)",
            transition: "border-color 0.3s",
          }}>
            <img
              src={INTERVIEWER.image}
              alt={INTERVIEWER.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.88)" }}
            />

            {/* Speaking bars */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "3px",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.65)",
                    borderRadius: "20px",
                    padding: "8px 16px",
                  }}
                >
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: ["3px", "14px", "3px"] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      style={{ width: "3px", background: "#22c55e", borderRadius: "2px" }}
                    />
                  ))}
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginLeft: "8px" }}>Speaking</span>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && !isSpeaking && (
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.65)",
                borderRadius: "20px",
                padding: "7px 14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
                  />
                ))}
              </div>
            )}

            {/* Name tag */}
            <div style={{
              position: "absolute",
              bottom: "16px",
              left: "14px",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "7px",
              padding: "5px 10px",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>{INTERVIEWER.name}</p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", margin: 0 }}>{firmConfig.name}</p>
            </div>

            {/* Mute button */}
            <button
              onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); setTurnState("you"); }}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "6px",
                padding: "5px 10px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Mute
            </button>
          </div>

          {/* User video */}
          <div style={{
            height: "120px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#1a1a1a",
            position: "relative",
            border: isListening ? "2px solid #6366f1" : "2px solid rgba(255,255,255,0.05)",
            transition: "border-color 0.3s",
            flexShrink: 0,
          }}>
            {userVideoEnabled ? (
              <video ref={userVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>Camera off</p>
              </div>
            )}
            <div style={{ position: "absolute", bottom: "6px", left: "8px", background: "rgba(0,0,0,0.6)", borderRadius: "5px", padding: "2px 7px", fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>
              You {isListening && "· Speaking"}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Transcript */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "4px" }}>
              Transcript
            </p>
            {transcript.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {msg.role === "user" ? "You" : INTERVIEWER.name}
                </span>
                <div style={{
                  maxWidth: "92%",
                  padding: "9px 13px",
                  borderRadius: msg.role === "user" ? "11px 3px 11px 11px" : "3px 11px 11px 11px",
                  background: msg.role === "user" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.82)",
                }}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ padding: "9px 13px", borderRadius: "3px 11px 11px 11px", background: "rgba(255,255,255,0.06)", width: "fit-content", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
            )}

            {/* Interim text while speaking */}
            {isListening && interimText && (
              <div style={{ padding: "9px 13px", borderRadius: "11px 3px 11px 11px", background: "rgba(99,102,241,0.1)", border: "1px dashed rgba(99,102,241,0.3)", fontSize: "12px", color: "rgba(255,255,255,0.4)", alignSelf: "flex-end", maxWidth: "92%" }}>
                {interimText}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
              placeholder={isListening ? "Speaking..." : "Type your response..."}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${isListening ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "8px",
                padding: "9px 11px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
                resize: "none",
                minHeight: "56px",
                maxHeight: "96px",
                outline: "none",
                lineHeight: 1.5,
                transition: "border-color 0.2s",
              }}
              rows={2}
            />
            <div style={{ display: "flex", gap: "7px" }}>
              <button
                onClick={isListening ? (input.trim() ? stopAndSubmit : stopListening) : startListening}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "7px",
                  border: `1px solid ${isListening ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
                  background: isListening ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                  color: isListening ? "#818cf8" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                }}
              >
                {isListening ? (input.trim() ? "Done →" : "Stop") : "🎙 Speak"}
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  flex: 2,
                  padding: "8px",
                  borderRadius: "7px",
                  border: "none",
                  background: loading || !input.trim() ? "rgba(255,255,255,0.08)" : "#ffffff",
                  color: loading || !input.trim() ? "rgba(255,255,255,0.25)" : "#111111",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function InterviewPage() {
  return (
    <Suspense>
      <InterviewInner />
    </Suspense>
  );
}