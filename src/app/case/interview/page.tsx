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

function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong> : part
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
  const [joinHovered, setJoinHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Audio level detection for user speaking indicator
  const startAudioMonitor = (stream: MediaStream) => {
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const check = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b, 0) / data.length;
        setUserSpeaking(vol > 8);
        audioFrameRef.current = requestAnimationFrame(check);
      };
      check();
    } catch (e) {
      console.error("Audio monitor failed:", e);
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
    const voices = synthRef.current.getVoices();
    let preferred;
    if (INTERVIEWER.gender === "male") {
      preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Google UK English Male"))
        ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"));
    } else {
      preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Google UK English Female"))
        ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
    }
    if (preferred) utterance.voice = preferred;
    utterance.rate = INTERVIEWER.gender === "female" ? 0.94 : 0.92;
    utterance.pitch = INTERVIEWER.gender === "female" ? 1.05 : 0.95;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      setUserVideoEnabled(true);
      startAudioMonitor(stream);
    } catch {
      // try audio only
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = audioStream;
        startAudioMonitor(audioStream);
      } catch { /* no permission */ }
    }
    setSessionStarted(true);
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    setTimeout(() => speak(transcript[0]?.content ?? ""), 800);
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
        gap: "24px",
        color: "#ffffff",
        padding: "40px 24px",
        overflowY: "auto",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
            {firmConfig.name} · Live Interview
          </p>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 4vw, 46px)", fontWeight: 400, marginBottom: "6px", lineHeight: 1.1, maxWidth: "700px" }}>
            {caseTitle}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>{difficulty} difficulty</p>
        </div>

        {/* Interviewer avatar — fixed circular crop */}
        <div style={{
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2.5px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
          background: "#1a1a1a",
        }}>
          <img
            src={INTERVIEWER.image}
            alt={INTERVIEWER.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "3px" }}>{INTERVIEWER.name}</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{INTERVIEWER.title}, {firmConfig.name}</p>
        </div>

        {/* Case brief — full text, scrollable */}
        {casePrompt && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "12px",
            padding: "20px 24px",
            maxWidth: "560px",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
          }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "10px" }}>
              Case Brief
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: 0 }}>
              {casePrompt}
            </p>
          </div>
        )}

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "10px",
          padding: "13px 20px",
          maxWidth: "420px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
            The interviewer speaks first. Respond by voice or text. You can mute at any time.
          </p>
        </div>

        {/* Join Interview — cool hover */}
        <button
          onClick={startSession}
          onMouseEnter={() => setJoinHovered(true)}
          onMouseLeave={() => setJoinHovered(false)}
          style={{
            background: joinHovered ? "#f5f5f5" : "#ffffff",
            color: "#111111",
            border: "none",
            borderRadius: "10px",
            padding: "14px 48px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s",
            transform: joinHovered ? "scale(1.04)" : "scale(1)",
            boxShadow: joinHovered
              ? "0 0 0 4px rgba(255,255,255,0.12), 0 8px 32px rgba(255,255,255,0.15)"
              : "0 0 0 0px transparent",
          }}
        >
          {joinHovered ? "Join →" : "Join Interview"}
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            background: "transparent",
            color: backHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
            border: "none",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "color 0.2s",
            letterSpacing: "0.01em",
          }}
        >
          ← Back
        </button>
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
      userSelect: "none",
    }}>

      {/* Top status bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 20px",
        background: "#1a1a1a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        height: "44px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "17px", fontWeight: 500 }}>MyCasePrep</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Live · {firmConfig.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            background: isSpeaking ? "rgba(34,197,94,0.15)" : loading ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.15)",
            color: isSpeaking ? "#22c55e" : loading ? "rgba(255,255,255,0.4)" : "#818cf8",
            border: `1px solid ${isSpeaking ? "rgba(34,197,94,0.3)" : loading ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.3)"}`,
            transition: "all 0.3s",
          }}>
            {loading ? "Thinking..." : isSpeaking ? "Interviewer speaking" : "Your turn"}
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.35)", minWidth: "42px" }}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Video area */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}>

          {/* Videos — side by side */}
          <div style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            padding: "12px",
            paddingBottom: "0",
            overflow: "hidden",
          }}>

            {/* Interviewer tile */}
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: "#1e1e1e",
              position: "relative",
              border: isSpeaking ? "2px solid #22c55e" : "2px solid transparent",
              transition: "border-color 0.25s",
            }}>
              <img
                src={INTERVIEWER.image}
                alt={INTERVIEWER.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />

              {/* Speaking animation */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      bottom: "48px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: "20px",
                      padding: "6px 14px",
                    }}
                  >
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: ["3px", "16px", "3px"] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.09 }}
                        style={{ width: "3px", background: "#22c55e", borderRadius: "2px" }}
                      />
                    ))}
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginLeft: "6px" }}>Speaking</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Thinking dots */}
              {loading && !isSpeaking && (
                <div style={{
                  position: "absolute", bottom: "48px", left: "50%", transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.6)", borderRadius: "20px", padding: "7px 14px",
                  display: "flex", gap: "5px", alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                  ))}
                </div>
              )}

              {/* Name tag */}
              <div style={{
                position: "absolute", bottom: "10px", left: "12px",
                background: "rgba(0,0,0,0.65)", borderRadius: "6px", padding: "4px 10px",
              }}>
                <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>{INTERVIEWER.name}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{firmConfig.name}</p>
              </div>

              {/* Mute interviewer */}
              <button
                onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)",
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
              border: userSpeaking && !isMuted ? "2px solid #22c55e" : "2px solid transparent",
              transition: "border-color 0.15s",
            }}>
              {userVideoEnabled && !isVideoOff ? (
                <video
                  ref={userVideoRef}
                  autoPlay muted playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
                  }}>
                    👤
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                    {isVideoOff ? "Camera off" : "Camera unavailable"}
                  </p>
                </div>
              )}

              {/* Name tag */}
              <div style={{
                position: "absolute", bottom: "10px", left: "12px",
                background: "rgba(0,0,0,0.65)", borderRadius: "6px", padding: "4px 10px",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>You</p>
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

          {/* Zoom-style bottom controls */}
          <div style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#1a1a1a",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
            padding: "0 16px",
          }}>
            {/* Mute */}
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                background: isMuted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${isMuted ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "10px",
                padding: "8px 16px",
                cursor: "pointer",
                color: isMuted ? "#ef4444" : "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
                minWidth: "64px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{isMuted ? "🔇" : "🎤"}</span>
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </button>

            {/* Video */}
            <button
              onClick={toggleVideo}
              title={isVideoOff ? "Start Video" : "Stop Video"}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                background: isVideoOff ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${isVideoOff ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "10px",
                padding: "8px 16px",
                cursor: "pointer",
                color: isVideoOff ? "#ef4444" : "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
                minWidth: "64px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{isVideoOff ? "📷" : "📹"}</span>
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                {isVideoOff ? "Start Video" : "Stop Video"}
              </span>
            </button>

            {/* Hint */}
            <button
              onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "8px 16px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
                minWidth: "64px",
              }}
            >
              <span style={{ fontSize: "18px" }}>💡</span>
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                Hint {hintsUsed > 0 ? `(${hintsUsed})` : ""}
              </span>
            </button>

            {/* Case brief */}
            <button
              onClick={() => setShowCaseOverlay(v => !v)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                background: showCaseOverlay ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${showCaseOverlay ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "10px",
                padding: "8px 16px",
                cursor: "pointer",
                color: showCaseOverlay ? "#818cf8" : "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
                minWidth: "64px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📄</span>
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Case</span>
            </button>

            {/* Chat toggle */}
            <button
              onClick={() => setShowChat(v => !v)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                background: showChat ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${showChat ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "10px",
                padding: "8px 16px",
                cursor: "pointer",
                color: showChat ? "#818cf8" : "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
                minWidth: "64px",
              }}
            >
              <span style={{ fontSize: "18px" }}>💬</span>
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                {showChat ? "Hide Chat" : "Chat"}
              </span>
            </button>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* End call */}
            <button
              onClick={handleEndSession}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                background: "#dc2626",
                border: "1px solid #dc2626",
                borderRadius: "10px",
                padding: "8px 20px",
                cursor: "pointer",
                color: "#ffffff",
                transition: "all 0.15s",
                minWidth: "72px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📵</span>
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>End</span>
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
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
              {/* Chat header */}
              <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                flexShrink: 0,
              }}>
                Transcript
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {transcript.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {msg.role === "user" ? "You" : INTERVIEWER.name}
                    </span>
                    <div style={{
                      maxWidth: "88%",
                      padding: "9px 12px",
                      borderRadius: msg.role === "user" ? "11px 3px 11px 11px" : "3px 11px 11px 11px",
                      background: msg.role === "user" ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.06)",
                      fontSize: "13px",
                      lineHeight: 1.65,
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
                    background: "rgba(99,102,241,0.08)", border: "1px dashed rgba(99,102,241,0.25)",
                    fontSize: "12px", color: "rgba(255,255,255,0.35)", alignSelf: "flex-end", maxWidth: "88%",
                  }}>
                    {interimText}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Hint panel */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ padding: "10px 14px", background: "rgba(99,102,241,0.08)", borderTop: "1px solid rgba(99,102,241,0.15)", fontSize: "12px", color: "rgba(255,255,255,0.6)", flexShrink: 0 }}
                  >
                    <strong style={{ color: "#818cf8" }}>Hint: </strong>
                    {caseContext || "Structure your answer using a MECE framework before diving into analysis."}
                    <button onClick={() => setShowHint(false)} style={{ marginLeft: "8px", background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: "12px" }}>×</button>
                  </motion.div>
                )}
              </AnimatePresence>

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
                    minHeight: "56px",
                    maxHeight: "100px",
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
                    {isListening ? (
                      <>
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>●</motion.span>
                        {input.trim() ? "Done →" : "Stop"}
                      </>
                    ) : "🎙 Speak"}
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

      {/* Case brief overlay */}
      <AnimatePresence>
        {showCaseOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "500px",
              maxWidth: "90vw",
              background: "#1e1e1e",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "20px",
              zIndex: 300,
              boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
              maxHeight: "55vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Case Brief
              </span>
              <button
                onClick={() => setShowCaseOverlay(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: "0 4px" }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
              {casePrompt}
            </p>
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