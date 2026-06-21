"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
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

function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong> : part
  );
}

// SVG icons — clean stroke style like Google Meet
const MicIcon = ({ muted }: { muted: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    ) : (
      <>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    )}
  </svg>
);

const CameraIcon = ({ off }: { off: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34" />
        <circle cx="12" cy="13" r="3" />
      </>
    ) : (
      <>
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    )}
  </svg>
);

const EndCallIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const HintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

// Dynamic hints based on interview stage
function getHint(hintsUsed: number, caseContext: string, casePrompt: string): string {
  const stage = hintsUsed % 3;
  if (stage === 0) {
    return caseContext || "Start by clarifying the objective and laying out a MECE framework with 2–3 key buckets before diving into analysis.";
  }
  if (stage === 1) {
    const promptLower = casePrompt.toLowerCase();
    if (promptLower.includes("profit") || promptLower.includes("revenue") || promptLower.includes("cost")) {
      return "Break profitability into Revenue and Costs. For revenue: price × volume. For costs: fixed vs. variable, then by function (COGS, SG&A, etc.).";
    }
    if (promptLower.includes("market entry") || promptLower.includes("enter")) {
      return "For market entry, cover: market attractiveness (size, growth, competition), company fit (capabilities, synergies), and entry mode (build, buy, partner).";
    }
    if (promptLower.includes("merger") || promptLower.includes("acqui")) {
      return "Evaluate M&A on three dimensions: strategic fit (why), financial impact (value creation), and integration risk (execution).";
    }
    return "Quantify wherever possible. Interviewers want to see you work through numbers — even rough estimates show structured thinking.";
  }
  return "Summarize your analysis so far and state a clear hypothesis. A good consultant doesn't wait until the end — drive toward a recommendation at each step.";
}

function InterviewInner() {
  const router = useRouter();
  const { data: session } = useSession();

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
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCaseOverlay, setShowCaseOverlay] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userVideoEnabled, setUserVideoEnabled] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioFrameRef = useRef<number | null>(null);

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
      if (audioFrameRef.current) cancelAnimationFrame(audioFrameRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  // Attach stream to video element whenever both are ready
  useEffect(() => {
    if (userVideoEnabled && userVideoRef.current && streamRef.current) {
      userVideoRef.current.srcObject = streamRef.current;
      userVideoRef.current.play().catch(() => {});
    }
  }, [userVideoEnabled]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const startAudioMonitor = (stream: MediaStream) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const check = () => {
        analyser.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b, 0) / data.length;
        setUserSpeaking(vol > 10);
        audioFrameRef.current = requestAnimationFrame(check);
      };
      check();
    } catch (e) {
      console.error("Audio monitor error:", e);
    }
  };

  const firmConfig = FIRM_CONFIGS[firm];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
    const utterance = new SpeechSynthesisUtterance(clean);

    // Wait for voices to load
    const trySpeak = () => {
      const voices = synthRef.current!.getVoices();
      let preferred;
      if (INTERVIEWER.gender === "male") {
        preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Google UK English Male"))
          ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"))
          ?? voices.find(v => v.lang.startsWith("en"));
      } else {
        preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Google UK English Female"))
          ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
          ?? voices.find(v => v.lang.startsWith("en"));
      }
      if (preferred) utterance.voice = preferred;
      utterance.rate = INTERVIEWER.gender === "female" ? 1.15 : 1.1;
      utterance.pitch = INTERVIEWER.gender === "female" ? 1.05 : 0.95;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current!.speak(utterance);
    };

    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      trySpeak();
    } else {
      synthRef.current.onvoiceschanged = () => trySpeak();
    }
  };

  const startSession = async () => {
    let gotStream = false;

    // Try video + audio first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });
      streamRef.current = stream;
      setUserVideoEnabled(true);
      startAudioMonitor(stream);
      gotStream = true;
    } catch {
      // Try audio only
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        streamRef.current = audioStream;
        startAudioMonitor(audioStream);
        gotStream = true;
      } catch {
        // No permission at all — continue without
      }
    }

    setSessionStarted(true);
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    setTimeout(() => speak(transcript[0]?.content ?? ""), 600);
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = isMuted; });
    }
    setIsMuted(m => !m);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.enabled = isVideoOff; });
    }
    setIsVideoOff(v => !v);
  };

  const startListening = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { alert("Please use Chrome for voice input."); return; }
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

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    synthRef.current?.cancel();
    setIsSpeaking(false);
    if (isListening) stopListening();

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
        body: JSON.stringify({ firm, casePrompt, difficulty, transcript: newTranscript, hintsUsed, personality }),
      });
      const data = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.response, timestamp: new Date() };
      setTranscript(prev => [...prev, aiMessage]);
      speak(data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    synthRef.current?.cancel();
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (audioFrameRef.current) cancelAnimationFrame(audioFrameRef.current);
    sessionStorage.setItem("transcriptData", JSON.stringify({
      firm, difficulty, hintsUsed, duration: elapsedTime, transcript, caseTitle,
    }));
    router.push("/case/feedback");
  };

  const handleHint = () => {
    setHintsUsed(h => h + 1);
    setShowHint(true);
  };

  const currentHint = getHint(hintsUsed, caseContext, casePrompt);

  // Bottom bar button style — consistent size regardless of active state
  const ctrlBtn = (active = false, danger = false): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    width: "72px",
    height: "56px",
    borderRadius: "10px",
    border: `1px solid ${danger ? "#dc2626" : active ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`,
    background: danger ? "#dc2626" : active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)",
    color: danger ? "#ffffff" : active ? "#818cf8" : "rgba(255,255,255,0.7)",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s, border-color 0.15s, color 0.15s",
  });

  const ctrlLabel: React.CSSProperties = {
    fontSize: "10px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    lineHeight: 1,
  };

  // ─── PRE-SESSION ───────────────────────────────────────────────
  if (!sessionStarted) {
    return (
      <main style={{
        height: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        overflow: "hidden",
        padding: "0 24px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}>
          {/* Firm label */}
          <p style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            margin: 0,
          }}>
            {firmConfig.name} · Live Interview
          </p>

          {/* Case title — always one line, truncated */}
          <h1 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(22px, 3.5vw, 36px)",
            fontWeight: 400,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            textAlign: "center",
            lineHeight: 1.2,
          }}>
            {caseTitle}
          </h1>

          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0 }}>
            {difficulty} difficulty
          </p>

          {/* Interviewer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}>
              <img
                src={INTERVIEWER.image}
                alt={INTERVIEWER.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>{INTERVIEWER.name}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>
                {INTERVIEWER.title}, {firmConfig.name}
              </p>
            </div>
          </div>

          {/* Case brief — full text, no clipping, contained height */}
          {casePrompt && (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "10px",
              padding: "16px 20px",
              width: "100%",
            }}>
              <div style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "8px",
              }}>
                Case Brief
              </div>
              <p style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {casePrompt}
              </p>
            </div>
          )}

          {/* Instructions */}
          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            lineHeight: 1.6,
            margin: 0,
          }}>
            The interviewer speaks first. Respond by voice or text. You can mute at any time.
          </p>

          {/* Join button — no scale transform, glow on hover via CSS */}
          <style>{`
            .join-btn { transition: box-shadow 0.2s, background 0.2s !important; }
            .join-btn:hover { background: #f0f0f0 !important; box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 0 8px 24px rgba(255,255,255,0.12) !important; }
          `}</style>
          <button
            onClick={startSession}
            className="join-btn"
            style={{
              background: "#ffffff",
              color: "#111111",
              border: "none",
              borderRadius: "10px",
              padding: "13px 0",
              width: "100%",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Join Interview
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.25)",
              border: "none",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "color 0.2s",
              padding: "4px 0",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  // ─── ACTIVE SESSION ────────────────────────────────────────────
  return (
    <main style={{
      height: "100vh",
      background: "#111111",
      display: "flex",
      flexDirection: "column",
      color: "#ffffff",
      overflow: "hidden",
    }}>

      {/* Top bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        height: "44px",
        background: "#1a1a1a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "17px", fontWeight: 500 }}>MyCasePrep</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
            {caseTitle} · {firmConfig.name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            background: isSpeaking ? "rgba(34,197,94,0.15)" : loading ? "rgba(255,255,255,0.07)" : "rgba(99,102,241,0.15)",
            color: isSpeaking ? "#22c55e" : loading ? "rgba(255,255,255,0.35)" : "#818cf8",
            border: `1px solid ${isSpeaking ? "rgba(34,197,94,0.3)" : loading ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.3)"}`,
            transition: "all 0.3s",
          }}>
            {loading ? "Thinking..." : isSpeaking ? "Interviewer speaking" : "Your turn"}
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Hint overlay — always visible, outside chat panel */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: "absolute",
              top: "52px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "480px",
              maxWidth: "90vw",
              background: "#1e1e2e",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "10px",
              padding: "14px 16px",
              zIndex: 400,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#818cf8", marginBottom: "6px" }}>
                  Hint {hintsUsed}
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0 }}>
                  {currentHint}
                </p>
              </div>
              <button
                onClick={() => setShowHint(false)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case brief overlay — centered above bottom bar */}
      <AnimatePresence>
        {showCaseOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            style={{
              position: "absolute",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "540px",
              maxWidth: "90vw",
              background: "#1e1e1e",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              zIndex: 300,
              boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
              maxHeight: "50vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Case Brief
              </span>
              <button
                onClick={() => setShowCaseOverlay(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: "0 2px" }}
              >
                ×
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "16px 18px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                {casePrompt}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Video area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Video tiles — side by side */}
          <div style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            padding: "12px 12px 8px",
            overflow: "hidden",
          }}>
            {/* Interviewer tile */}
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: "#1e1e1e",
              position: "relative",
              border: `2px solid ${isSpeaking ? "#22c55e" : "rgba(255,255,255,0.05)"}`,
              transition: "border-color 0.25s",
            }}>
              <img
                src={INTERVIEWER.image}
                alt={INTERVIEWER.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />

              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      bottom: "44px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                      background: "rgba(0,0,0,0.65)",
                      borderRadius: "20px",
                      padding: "6px 14px",
                    }}
                  >
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: ["3px", "14px", "3px"] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.09 }}
                        style={{ width: "3px", background: "#22c55e", borderRadius: "2px" }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && !isSpeaking && (
                <div style={{
                  position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.6)", borderRadius: "20px", padding: "7px 14px",
                  display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                  ))}
                </div>
              )}

              <div style={{
                position: "absolute", bottom: "10px", left: "12px",
                background: "rgba(0,0,0,0.65)", borderRadius: "6px", padding: "4px 10px",
              }}>
                <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>{INTERVIEWER.name}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{firmConfig.name}</p>
              </div>

              <button
                onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px", padding: "4px 10px", fontSize: "11px",
                  color: "rgba(255,255,255,0.45)", cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
              >
                Mute
              </button>
            </div>

            {/* User tile */}
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: "#1e1e1e",
              position: "relative",
              border: `2px solid ${userSpeaking && !isMuted ? "#22c55e" : "rgba(255,255,255,0.05)"}`,
              transition: "border-color 0.15s",
            }}>
              {userVideoEnabled && !isVideoOff ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "12px",
                }}>
                  {session?.user?.image ? (
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                      <img src={session.user.image} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{
                      width: "72px", height: "72px", borderRadius: "50%",
                      background: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
                    }}>
                      {session?.user?.name?.charAt(0) ?? "Y"}
                    </div>
                  )}
                  {isVideoOff && (
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Camera off</p>
                  )}
                </div>
              )}

              <div style={{
                position: "absolute", bottom: "10px", left: "12px",
                background: "rgba(0,0,0,0.65)", borderRadius: "6px", padding: "4px 10px",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>
                  {session?.user?.name ?? "You"}      
                </p>
                {isMuted && <span style={{ fontSize: "10px", color: "#ef4444" }}>Muted</span>}
                {userSpeaking && !isMuted && (
                  <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ height: ["2px", "8px", "2px"] }} transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                        style={{ width: "2px", background: "#22c55e", borderRadius: "1px" }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom control bar */}
          <div style={{
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#1a1a1a",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
            padding: "0 16px",
          }}>
            <button onClick={toggleMute} style={ctrlBtn(isMuted)}>
              <MicIcon muted={isMuted} />
              <span style={ctrlLabel}>{isMuted ? "Unmute" : "Mute"}</span>
            </button>

            <button onClick={toggleVideo} style={ctrlBtn(isVideoOff)}>
              <CameraIcon off={isVideoOff} />
              <span style={ctrlLabel}>{isVideoOff ? "Start Video" : "Stop Video"}</span>
            </button>

            <button onClick={handleHint} style={ctrlBtn(false)}>
              <HintIcon />
              <span style={ctrlLabel}>Hint {hintsUsed > 0 ? `(${hintsUsed})` : ""}</span>
            </button>

            <button onClick={() => setShowCaseOverlay(v => !v)} style={ctrlBtn(showCaseOverlay)}>
              <CaseIcon />
              <span style={ctrlLabel}>Case</span>
            </button>

            <button onClick={() => setShowChat(v => !v)} style={ctrlBtn(showChat)}>
              <ChatIcon />
              <span style={ctrlLabel}>{showChat ? "Hide Chat" : "Chat"}</span>
            </button>

            <div style={{ flex: 1 }} />

            <button onClick={() => setShowEndConfirm(true)} style={ctrlBtn(false, true)}>
              <EndCallIcon />
              <span style={ctrlLabel}>End</span>
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "#161616",
                flexShrink: 0,
              }}
            >
              <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                flexShrink: 0,
              }}>
                Transcript
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {transcript.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {msg.role === "user" ? (session?.user?.name ?? "You") : INTERVIEWER.name}
                    </span>
                    <div style={{
                      maxWidth: "90%",
                      padding: "9px 12px",
                      borderRadius: msg.role === "user" ? "11px 3px 11px 11px" : "3px 11px 11px 11px",
                      background: msg.role === "user" ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.06)",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.8)",
                    }}>
                      {renderContent(msg.content)}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ padding: "9px 12px", borderRadius: "3px 11px 11px 11px", background: "rgba(255,255,255,0.06)", width: "fit-content", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                    ))}
                  </div>
                )}

                {isListening && interimText && (
                  <div style={{
                    padding: "9px 12px", borderRadius: "11px 3px 11px 11px",
                    background: "rgba(99,102,241,0.07)", border: "1px dashed rgba(99,102,241,0.25)",
                    fontSize: "12px", color: "rgba(255,255,255,0.3)", alignSelf: "flex-end", maxWidth: "90%",
                  }}>
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
                  placeholder={isListening ? "Listening..." : "Type your response..."}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${isListening ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "8px",
                    padding: "9px 11px",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontFamily: "Inter, sans-serif",
                    resize: "none",
                    minHeight: "52px",
                    maxHeight: "96px",
                    outline: "none",
                    lineHeight: 1.5,
                    boxSizing: "border-box",
                  }}
                  rows={2}
                />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={isListening ? (input.trim() ? () => { stopListening(); sendMessage(input); } : stopListening) : startListening}
                    style={{
                      flex: 1,
                      padding: "7px",
                      borderRadius: "7px",
                      border: `1px solid ${isListening ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
                      background: isListening ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.05)",
                      color: isListening ? "#818cf8" : "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    {isListening ? (input.trim() ? "Done" : "Stop") : "Speak"}
                  </button>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    style={{
                      flex: 2,
                      padding: "7px",
                      borderRadius: "7px",
                      border: "none",
                      background: loading || !input.trim() ? "rgba(255,255,255,0.07)" : "#ffffff",
                      color: loading || !input.trim() ? "rgba(255,255,255,0.2)" : "#111111",
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* End session confirmation */}
<AnimatePresence>
  {showEndConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
      }}
      onClick={() => setShowEndConfirm(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1e1e1e",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "14px",
          padding: "28px 32px",
          width: "340px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <h3 style={{
          fontSize: "17px",
          fontWeight: 600,
          margin: "0 0 8px",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
        }}>
          End interview?
        </h3>
        <p style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
          margin: "0 0 24px",
          fontFamily: "Inter, sans-serif",
        }}>
          You'll be taken to your scorecard. This can't be undone.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowEndConfirm(false)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Keep going
          </button>
          <button
            onClick={() => { setShowEndConfirm(false); handleEndSession(); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            End interview
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
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