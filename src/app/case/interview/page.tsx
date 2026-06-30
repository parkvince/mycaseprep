"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const FIRM_SHORT: Record<string, string> = {
  mckinsey: "McKinsey", bain: "Bain", bcg: "BCG", ey: "EY-Parthenon",
  deloitte: "Deloitte", kpmg: "KPMG", pwc: "PwC", rolandberger: "Roland Berger",
  accenture: "Accenture", "oliver-wyman": "Oliver Wyman", kearney: "Kearney",
  lek: "L.E.K.", "monitor-deloitte": "Monitor Deloitte", ibm: "IBM",
  "capital-one": "Capital One", huron: "Huron",
};

const INTERVIEWERS = [
  { name: "James", title: "Senior Engagement Manager", gender: "male", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face" },
  { name: "Sarah", title: "Senior Engagement Manager", gender: "female", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=face" },
];

const INTERVIEWER = INTERVIEWERS[Math.floor(Math.random() * INTERVIEWERS.length)];

function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

function getHint(hintsUsed: number, caseContext: string, casePrompt: string): string {
  const stage = hintsUsed % 3;
  if (stage === 0) return caseContext || "Start by clarifying the objective and laying out a MECE framework with 2-3 key buckets before diving into analysis.";
  if (stage === 1) {
    const p = casePrompt.toLowerCase();
    if (p.includes("profit") || p.includes("revenue") || p.includes("cost")) return "Break profitability into Revenue and Costs. For revenue: price x volume. For costs: fixed vs. variable, then by function.";
    if (p.includes("market entry") || p.includes("enter")) return "For market entry: market attractiveness (size, growth, competition), company fit (capabilities, synergies), and entry mode (build, buy, partner).";
    if (p.includes("merger") || p.includes("acqui")) return "Evaluate M&A on three dimensions: strategic fit (why), financial impact (value creation), and integration risk (execution).";
    return "Quantify wherever possible. Even rough estimates show structured thinking.";
  }
  return "Summarize your analysis and state a clear hypothesis. Drive toward a recommendation at each step.";
}

const MicIcon = ({ muted }: { muted: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (<><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>) : (<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>)}
  </svg>
);

const CameraIcon = ({ off }: { off: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (<><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/><circle cx="12" cy="13" r="3"/></>) : (<><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>)}
  </svg>
);

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

  useEffect(() => {
    if (userVideoEnabled && userVideoRef.current && streamRef.current) {
      userVideoRef.current.srcObject = streamRef.current;
      userVideoRef.current.play().catch(() => {});
    }
  }, [userVideoEnabled]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [transcript]);

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
    } catch (e) { console.error(e); }
  };

  const firmConfig = FIRM_CONFIGS[firm];
  const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
    const utterance = new SpeechSynthesisUtterance(clean);
    const trySpeak = () => {
      const voices = synthRef.current!.getVoices();
      let preferred;
      if (INTERVIEWER.gender === "male") {
        preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Google UK English Male")) ?? voices.find(v => v.lang.startsWith("en"));
      } else {
        preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Google UK English Female")) ?? voices.find(v => v.lang.startsWith("en"));
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
    if (voices.length > 0) trySpeak();
    else synthRef.current.onvoiceschanged = () => trySpeak();
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      setUserVideoEnabled(true);
      startAudioMonitor(stream);
    } catch {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = audioStream;
        startAudioMonitor(audioStream);
      } catch {}
    }
    setSessionStarted(true);
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    setTimeout(() => speak(transcript[0]?.content ?? ""), 600);
  };

  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = isMuted; });
    setIsMuted(m => !m);
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = isVideoOff; });
    setIsVideoOff(v => !v);
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Please use Chrome for voice input."); return; }
    const recognition = new SR();
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
    recognition.onend = () => { setIsListening(false); setInterimText(""); };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); setInterimText(""); };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    synthRef.current?.cancel();
    setIsSpeaking(false);
    if (isListening) stopListening();
    const userMessage: Message = { role: "user", content: content.trim(), timestamp: new Date() };
    const newTranscript = [...transcript, userMessage];
    setTranscript(newTranscript);
    setInput(""); setInterimText("");
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    synthRef.current?.cancel();
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (audioFrameRef.current) cancelAnimationFrame(audioFrameRef.current);
    sessionStorage.setItem("transcriptData", JSON.stringify({ firm, difficulty, hintsUsed, duration: elapsedTime, transcript, caseTitle }));
    router.push("/case/feedback");
  };

  const ctrlBtn = (active = false, danger = false): React.CSSProperties => ({
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "4px", width: "68px", height: "52px", borderRadius: "10px",
    border: `1px solid ${danger ? "#dc2626" : active ? "rgba(124,92,252,0.45)" : "rgba(255,255,255,0.1)"}`,
    background: danger ? "#dc2626" : active ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.05)",
    color: danger ? "#fff" : active ? "#a78bfa" : "rgba(255,255,255,0.65)",
    cursor: "pointer", flexShrink: 0, transition: "all 0.15s", fontFamily: FONT,
  });

  // ── PRE-SESSION ──
  if (!sessionStarted) {
    return (
      <main style={{ height: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, padding: "0 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>

          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            {FIRM_SHORT[firm] ?? firmConfig.name} · Live interview
          </div>

          <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, margin: 0, textAlign: "center", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {caseTitle}
          </h1>

          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", textTransform: "capitalize" }}>{difficulty} difficulty</div>

          {/* Interviewer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "9999px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
              <img src={INTERVIEWER.image} alt={INTERVIEWER.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{INTERVIEWER.name}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{INTERVIEWER.title}, {FIRM_SHORT[firm] ?? firmConfig.name}</div>
            </div>
          </div>

          {/* Case brief */}
          {casePrompt && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem 1.25rem", width: "100%" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>Case brief</div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {casePrompt}
              </p>
            </div>
          )}

          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.65, margin: 0 }}>
            The interviewer speaks first. Respond by voice or text. You can mute at any time.
          </p>

          <button
            onClick={startSession}
            style={{ width: "100%", height: "48px", borderRadius: "10px", border: "none", background: "#fff", color: "#111", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "opacity 0.15s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Join interview
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            style={{ background: "transparent", color: "rgba(255,255,255,0.2)", border: "none", fontSize: "0.82rem", cursor: "pointer", fontFamily: FONT, transition: "color 0.15s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)")}
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  // ── ACTIVE SESSION ──
  return (
    <main style={{ height: "100vh", background: "#111", display: "flex", flexDirection: "column", color: "#fff", overflow: "hidden", fontFamily: FONT }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.25rem", height: "44px", background: "#191919", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "-0.01em", color: "#fff" }}>mycaseprep</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "280px" }}>
            {caseTitle} · {FIRM_SHORT[firm] ?? firmConfig.name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            padding: "3px 10px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 600,
            background: isSpeaking ? "rgba(34,197,94,0.15)" : loading ? "rgba(255,255,255,0.06)" : "rgba(124,92,252,0.15)",
            color: isSpeaking ? "#22c55e" : loading ? "rgba(255,255,255,0.3)" : "#a78bfa",
            border: `1px solid ${isSpeaking ? "rgba(34,197,94,0.3)" : loading ? "rgba(255,255,255,0.08)" : "rgba(124,92,252,0.3)"}`,
            transition: "all 0.3s",
          }}>
            {loading ? "Thinking..." : isSpeaking ? "Interviewer speaking" : "Your turn"}
          </div>
          <span style={{ fontVariantNumeric: "tabular-nums", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Hint overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: "absolute", top: "52px", left: "50%", transform: "translateX(-50%)", width: "460px", maxWidth: "90vw", background: "#1a1a2e", border: "1px solid rgba(124,92,252,0.3)", borderRadius: "12px", padding: "1rem 1.1rem", zIndex: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: "0.4rem" }}>Hint {hintsUsed}</div>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: 0 }}>{getHint(hintsUsed, caseContext, casePrompt)}</p>
              </div>
              <button onClick={() => setShowHint(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "6px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1rem", width: "24px", height: "24px", display: "grid", placeItems: "center", flexShrink: 0 }}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case overlay */}
      <AnimatePresence>
        {showCaseOverlay && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            style={{ position: "absolute", bottom: "76px", left: "50%", transform: "translateX(-50%)", width: "520px", maxWidth: "90vw", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", zIndex: 300, boxShadow: "0 24px 60px rgba(0,0,0,0.7)", maxHeight: "50vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Case brief</span>
              <button onClick={() => setShowCaseOverlay(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ overflowY: "auto", padding: "1rem 1.1rem" }}>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{casePrompt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Video area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "10px 10px 6px", overflow: "hidden" }}>

            {/* Interviewer tile */}
            <div style={{ borderRadius: "12px", overflow: "hidden", background: "#1c1c1c", position: "relative", border: `2px solid ${isSpeaking ? "#22c55e" : "rgba(255,255,255,0.04)"}`, transition: "border-color 0.25s" }}>
              <img src={INTERVIEWER.image} alt={INTERVIEWER.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />

              <AnimatePresence>
                {isSpeaking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "3px", alignItems: "center", background: "rgba(0,0,0,0.6)", borderRadius: "20px", padding: "6px 12px" }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div key={i} animate={{ height: ["3px", "14px", "3px"] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.09 }}
                        style={{ width: "3px", background: "#22c55e", borderRadius: "2px" }} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && !isSpeaking && (
                <div style={{ position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.55)", borderRadius: "20px", padding: "6px 12px", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.45)" }} />
                  ))}
                </div>
              )}

              <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", borderRadius: "8px", padding: "4px 10px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{INTERVIEWER.name}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{FIRM_SHORT[firm] ?? firmConfig.name}</div>
              </div>

              <button onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}
                style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "3px 8px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: FONT }}>
                Mute voice
              </button>
            </div>

            {/* User tile */}
            <div style={{ borderRadius: "12px", overflow: "hidden", background: "#1c1c1c", position: "relative", border: `2px solid ${userSpeaking && !isMuted ? "#22c55e" : "rgba(255,255,255,0.04)"}`, transition: "border-color 0.15s" }}>
              {userVideoEnabled && !isVideoOff ? (
                <video ref={userVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                  {session?.user?.image ? (
                    <div style={{ width: "64px", height: "64px", borderRadius: "9999px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                      <img src={session.user.image} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: "64px", height: "64px", borderRadius: "9999px", background: "rgba(255,255,255,0.07)", display: "grid", placeItems: "center", fontSize: "1.5rem", fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
                      {session?.user?.name?.charAt(0) ?? "Y"}
                    </div>
                  )}
                  {isVideoOff && <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>Camera off</span>}
                </div>
              )}
              <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", borderRadius: "8px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{session?.user?.name ?? "You"}</span>
                {isMuted && <span style={{ fontSize: "0.65rem", color: "#ef4444" }}>Muted</span>}
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

          {/* Control bar */}
          <div style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#191919", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, padding: "0 1rem" }}>
            <button onClick={toggleMute} style={ctrlBtn(isMuted)}>
              <MicIcon muted={isMuted} />
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
            <button onClick={toggleVideo} style={ctrlBtn(isVideoOff)}>
              <CameraIcon off={isVideoOff} />
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>{isVideoOff ? "Start cam" : "Stop cam"}</span>
            </button>
            <button onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }} style={ctrlBtn(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>Hint{hintsUsed > 0 ? ` (${hintsUsed})` : ""}</span>
            </button>
            <button onClick={() => setShowCaseOverlay(v => !v)} style={ctrlBtn(showCaseOverlay)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>Case</span>
            </button>
            <button onClick={() => setShowChat(v => !v)} style={ctrlBtn(showChat)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>Chat</span>
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={() => setShowEndConfirm(true)} style={ctrlBtn(false, true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)"/></svg>
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>End</span>
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden", background: "#161616", flexShrink: 0 }}>
              <div style={{ padding: "0.65rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                Transcript
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {transcript.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {msg.role === "user" ? (session?.user?.name ?? "You") : INTERVIEWER.name}
                    </span>
                    <div style={{ maxWidth: "90%", padding: "0.5rem 0.75rem", borderRadius: msg.role === "user" ? "10px 3px 10px 10px" : "3px 10px 10px 10px", background: msg.role === "user" ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.05)", fontSize: "0.8rem", lineHeight: 1.6, color: "rgba(255,255,255,0.75)" }}>
                      {renderContent(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "3px 10px 10px 10px", background: "rgba(255,255,255,0.05)", width: "fit-content", display: "flex", gap: "3px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
                    ))}
                  </div>
                )}
                {isListening && interimText && (
                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "10px 3px 10px 10px", background: "rgba(124,92,252,0.06)", border: "1px dashed rgba(124,92,252,0.2)", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", alignSelf: "flex-end", maxWidth: "90%" }}>
                    {interimText}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "0.625rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder={isListening ? "Listening..." : "Type your response..."}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${isListening ? "rgba(124,92,252,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", padding: "0.5rem 0.7rem", color: "#fff", fontSize: "0.8rem", fontFamily: FONT, resize: "none", minHeight: "48px", maxHeight: "88px", outline: "none", lineHeight: 1.55, boxSizing: "border-box" }}
                  rows={2}
                />
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={isListening ? (input.trim() ? () => { stopListening(); sendMessage(input); } : stopListening) : startListening}
                    style={{ flex: 1, height: "32px", borderRadius: "7px", border: `1px solid ${isListening ? "rgba(124,92,252,0.4)" : "rgba(255,255,255,0.08)"}`, background: isListening ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.04)", color: isListening ? "#a78bfa" : "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "0.75rem", fontFamily: FONT, fontWeight: 600 }}
                  >
                    {isListening ? (input.trim() ? "Done" : "Stop") : "Speak"}
                  </button>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    style={{ flex: 2, height: "32px", borderRadius: "7px", border: "none", background: loading || !input.trim() ? "rgba(255,255,255,0.06)" : "#fff", color: loading || !input.trim() ? "rgba(255,255,255,0.18)" : "#111", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "0.75rem", fontFamily: FONT, fontWeight: 700 }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* End confirm modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}
            onClick={() => setShowEndConfirm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.75rem 2rem", width: "320px", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#fff", fontFamily: FONT }}>End interview?</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: "0 0 1.5rem", fontFamily: FONT }}>
                You'll be taken to your scorecard. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setShowEndConfirm(false)}
                  style={{ flex: 1, height: "38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.82rem", fontFamily: FONT, fontWeight: 600 }}>
                  Keep going
                </button>
                <button onClick={() => { setShowEndConfirm(false); handleEndSession(); }}
                  style={{ flex: 1, height: "38px", borderRadius: "8px", border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: "0.82rem", fontFamily: FONT, fontWeight: 700 }}>
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