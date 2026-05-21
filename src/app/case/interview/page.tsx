"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";

const INTERVIEWERS = [
  {
    name: "Vince",
    title: "Senior Engagement Manager",
    gender: "male",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
  },
  {
    name: "Park",
    title: "Senior Engagement Manager",
    gender: "female",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=face",
  },
];

const INTERVIEWER = INTERVIEWERS[Math.floor(Math.random() * INTERVIEWERS.length)];

function InterviewInner() {
  const router = useRouter();
  const params = useSearchParams();

  const firm = (params.get("firm") ?? "mckinsey") as FirmKey;
  const difficulty = (params.get("difficulty") ?? "intermediate") as Difficulty;
  const personality = (params.get("personality") ?? "strict") as "strict" | "friendly";
  const caseTitle = params.get("title") ?? "Case Interview";
  const casePrompt = params.get("prompt") ?? "";
  const caseContext = params.get("context") ?? "";

  const firmConfig = FIRM_CONFIGS[firm];

  const [transcript, setTranscript] = useState<Message[]>([
    {
      role: "assistant",
      content: `Good morning. I'm James Chen, Senior Engagement Manager at ${firmConfig.name}. Thank you for taking the time to meet with me today.\n\n${casePrompt}\n\nPlease take a moment to read through the case. Feel free to ask any clarifying questions when you're ready.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userVideoEnabled, setUserVideoEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();

    let preferred;
    if (INTERVIEWER.gender === "male") {
      preferred = voices.find(v =>
        v.name.includes("Daniel") ||
        v.name.includes("Alex") ||
        v.name.includes("Google UK English Male") ||
        v.name.includes("Arthur") ||
        (v.lang === "en-GB" && v.name.toLowerCase().includes("male"))
      ) ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"));
    } else {
      preferred = voices.find(v =>
        v.name.includes("Samantha") ||
        v.name.includes("Victoria") ||
        v.name.includes("Karen") ||
        v.name.includes("Google UK English Female") ||
        v.name.includes("Serena") ||
        (v.lang === "en-GB" && v.name.toLowerCase().includes("female"))
      ) ?? voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
    }

    if (preferred) utterance.voice = preferred;
    utterance.rate = INTERVIEWER.gender === "female" ? 0.94 : 0.92;
    utterance.pitch = INTERVIEWER.gender === "female" ? 1.05 : 0.95;
    utterance.volume = 1;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      setUserVideoEnabled(true);
      setMicEnabled(true);
    } catch {
      setMicEnabled(true);
    }

    setSessionStarted(true);
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    setTimeout(() => speak(transcript[0].content), 500);
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
      const t = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(t);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
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

    const evalParams = new URLSearchParams({
      firm,
      difficulty,
      hintsUsed: hintsUsed.toString(),
      duration: elapsedTime.toString(),
      transcript: encodeURIComponent(JSON.stringify(transcript)),
    });

    router.push(`/case/feedback?${evalParams.toString()}`);
  };

  // Pre-session screen
  if (!sessionStarted) {
    return (
      <main style={{
        height: "100vh",
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        color: "#ffffff",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "12px",
          }}>
            {firmConfig.name} · Live Interview
          </p>
          <h1 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            marginBottom: "8px",
          }}>
            {caseTitle}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            {difficulty} · with {INTERVIEWER.name}
          </p>
        </div>

        <div style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}>
          <img
            src={INTERVIEWER.image}
            alt={INTERVIEWER.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
            {INTERVIEWER.name}
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            {INTERVIEWER.title}, {firmConfig.name}
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "20px 32px",
          maxWidth: "400px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            This session will use your microphone and camera. The interviewer will speak aloud and listen to your responses.
          </p>
        </div>

        <button
          onClick={startSession}
          style={{
            background: "#ffffff",
            color: "#111111",
            border: "none",
            borderRadius: "8px",
            padding: "14px 40px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.15s",
          }}
        >
          Join Interview
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "transparent",
            color: "rgba(255,255,255,0.4)",
            border: "none",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ← Back to dashboard
        </button>
      </main>
    );
  }

  return (
    <main style={{
      height: "100vh",
      background: "#0f0f0f",
      display: "flex",
      flexDirection: "column",
      color: "#ffffff",
      overflow: "hidden",
    }}>
      {/* Top Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            fontFamily: "Cormorant, serif",
            fontSize: "18px",
            fontWeight: 500,
            color: "#ffffff",
          }}>
            MyCasePrep
          </span>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
            boxShadow: "0 0 6px #22c55e",
          }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Live Interview
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
          }}>
            {formatTime(elapsedTime)}
          </span>
          <button
            onClick={() => {
              setHintsUsed(h => h + 1);
              setShowHint(true);
            }}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              padding: "6px 14px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Hint {hintsUsed > 0 ? `(${hintsUsed})` : ""}
          </button>
          <button
            onClick={handleEndSession}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 14px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        overflow: "hidden",
      }}>
        {/* Video Area */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          gap: "16px",
          overflow: "hidden",
        }}>
          {/* Interviewer Video */}
          <div style={{
            flex: 1,
            borderRadius: "16px",
            overflow: "hidden",
            background: "#1a1a1a",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: isSpeaking ? "2px solid #22c55e" : "2px solid transparent",
            transition: "border-color 0.3s",
          }}>
            <img
              src={INTERVIEWER.image}
              alt={INTERVIEWER.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                filter: "brightness(0.9)",
              }}
            />

            {/* Speaking indicator */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                  }}
                >
                  {[0, 1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: ["4px", "16px", "4px"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{
                        width: "3px",
                        background: "#22c55e",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading indicator */}
            {loading && (
              <div style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.6)",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.6)",
              }}>
                Thinking...
              </div>
            )}

            {/* Name tag */}
            <div style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "8px",
              padding: "6px 12px",
            }}>
              <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>
                {INTERVIEWER.name}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                {firmConfig.name}
              </p>
            </div>
          </div>

          {/* User Video */}
          <div style={{
            height: "140px",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#1a1a1a",
            position: "relative",
            border: isListening ? "2px solid #6366f1" : "2px solid transparent",
            transition: "border-color 0.3s",
            flexShrink: 0,
          }}>
            {userVideoEnabled ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}>
                  👤
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  Camera off
                </p>
              </div>
            )}

            <div style={{
              position: "absolute",
              bottom: "8px",
              left: "10px",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "6px",
              padding: "3px 8px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.7)",
            }}>
              You
            </div>

            {isListening && (
              <div style={{
                position: "absolute",
                bottom: "8px",
                right: "10px",
                background: "#6366f1",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: 600,
              }}>
                Speaking
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: "12px 16px",
                  background: "rgba(99,102,241,0.1)",
                  borderBottom: "1px solid rgba(99,102,241,0.2)",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  flexShrink: 0,
                }}
              >
                <strong style={{ color: "#818cf8" }}>Hint:</strong>{" "}
                {caseContext || "Think about the key drivers of the problem. Structure your answer using a MECE framework."}
                <button
                  onClick={() => setShowHint(false)}
                  style={{
                    marginLeft: "8px",
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
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
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "4px",
            }}>
              Transcript
            </p>
            {transcript.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <span style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.25)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {msg.role === "user" ? "You" : INTERVIEWER.name}
                </span>
                <div style={{
                  maxWidth: "90%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                  background: msg.role === "user" ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.85)",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "4px 12px 12px 12px",
                background: "rgba(255,255,255,0.06)",
                fontSize: "13px",
                color: "rgba(255,255,255,0.3)",
                width: "fit-content",
              }}>
                ...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Type your response..."
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
                resize: "none",
                minHeight: "60px",
                maxHeight: "100px",
                outline: "none",
                lineHeight: 1.5,
              }}
              rows={2}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={isListening ? stopListening : startListening}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "7px",
                  border: `1px solid ${isListening ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
                  background: isListening ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                  color: isListening ? "#818cf8" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  transition: "all 0.15s",
                }}
              >
                {isListening ? "Stop" : "Speak"}
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  flex: 2,
                  padding: "8px",
                  borderRadius: "7px",
                  border: "none",
                  background: loading || !input.trim() ? "rgba(255,255,255,0.1)" : "#ffffff",
                  color: loading || !input.trim() ? "rgba(255,255,255,0.3)" : "#111111",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  transition: "all 0.15s",
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