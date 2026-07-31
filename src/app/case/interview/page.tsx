"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { trackEvent } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { FirmKey, Difficulty, Message } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { INTERVIEWERS, type Interviewer } from "@/lib/interviewers";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const FIRM_SHORT: Record<string, string> = {
  mckinsey: "McKinsey", bain: "Bain", bcg: "BCG", ey: "EY-Parthenon",
  deloitte: "Deloitte", kpmg: "KPMG", pwc: "PwC", rolandberger: "Roland Berger",
  accenture: "Accenture", "oliver-wyman": "Oliver Wyman", kearney: "Kearney",
  lek: "L.E.K.", "monitor-deloitte": "Monitor Deloitte", ibm: "IBM",
  "capital-one": "Capital One", huron: "Huron",
};

const DEFAULT_INTERVIEWER = INTERVIEWERS[0];

function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

function getHint(hintsUsed: number, caseContext: string, casePrompt: string): string {
  const stage = hintsUsed % 3;
  if (stage === 0) return caseContext || "Start by clarifying the objective, then lay out 2-3 buckets to break the problem into - make sure they don't overlap and together cover the whole thing (that's what \"MECE\" means) before diving into analysis.";
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
  const [caseType, setCaseType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [personality, setPersonality] = useState<"strict" | "friendly">("strict");
  const [interviewer, setInterviewer] = useState<Interviewer>(DEFAULT_INTERVIEWER);
  const [caseTitle, setCaseTitle] = useState("Case Interview");
  const [casePrompt, setCasePrompt] = useState("");
  const [caseContext, setCaseContext] = useState("");
  const [aiProvider, setAiProvider] = useState<string | null>(null);
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
  const [showChat, setShowChat] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timedMode, setTimedMode] = useState(false);
  const [userVideoEnabled, setUserVideoEnabled] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  // Real calls don't start with everyone already in the room - there's a beat
  // where the other side is still connecting, then a join chime. This drives it.
  const [interviewerJoined, setInterviewerJoined] = useState(false);
  // Real interviews open with small talk before the case, not a wall of text.
  // caseRevealed gates that: the first user reply (to "are you ready?") is
  // handled locally - no AI call - and simply unlocks the case prompt.
  const [caseRevealed, setCaseRevealed] = useState(false);
  const caseRevealedRef = useRef(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioFrameRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMutedRef = useRef(isMuted);
  const isSpeakingRef = useRef(false);
  const loadingRef = useRef(false);
  const userSpeakingRef = useRef(false);
  // Premium-voice health: NEVER permanently give up on the natural voice - it's
  // the default the session always returns to. A failed line falls back to the
  // browser voice for that one line only. Only after two consecutive failures
  // (a real outage, not a blip) do we back off for 60s, so a hard outage doesn't
  // add a long stall to every single turn - then we automatically try again.
  const ttsFailStreakRef = useRef(0);
  const ttsRetryAtRef = useRef(0);
  // Short spoken acknowledgments ("Mm-hm, okay...") in the interviewer's own
  // voice, prefetched once at join and played while the AI is thinking - the
  // silence between turns reads as a person considering, not a system loading.
  const fillersRef = useRef<string[]>([]);
  const fillerTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { userSpeakingRef.current = userSpeaking; }, [userSpeaking]);
  useEffect(() => { caseRevealedRef.current = caseRevealed; }, [caseRevealed]);

  useEffect(() => {
    const raw = sessionStorage.getItem("caseData");
    if (raw) {
      const data = JSON.parse(raw);
      setFirm(data.firm ?? "mckinsey");
      setCaseType(data.type ?? null);
      setDifficulty(data.difficulty ?? "intermediate");
      setPersonality(data.personality ?? "strict");
      setCaseTitle(data.title ?? "Case Interview");
      setCasePrompt(data.prompt ?? "");
      setCaseContext(data.context ?? "");
      setAiProvider(data.aiProvider ?? null);
      if (data.interviewer?.name && data.interviewer?.image) setInterviewer(data.interviewer);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.title = `${caseTitle} · MyCasePrep`;
  }, [caseTitle]);

  useEffect(() => {
    if (!ready || !casePrompt) return;
    setTranscript([{
      role: "assistant",
      content: `Good morning! I'm ${interviewer.name}, ${interviewer.title} at ${FIRM_CONFIGS[firm].name}. Thanks so much for taking the time to meet with me today. Before we dive in - are you ready to get started with the case?`,
      timestamp: new Date(),
    }]);
  }, [ready, casePrompt, firm, interviewer]);

  useEffect(() => {
    mountedRef.current = true;
    synthRef.current = window.speechSynthesis;
    const fillers = fillersRef.current;
    return () => {
      mountedRef.current = false;
      stopSpeaking();
      if (synthRef.current) synthRef.current.onvoiceschanged = null;
      recognitionRef.current?.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (fillerTimerRef.current) clearTimeout(fillerTimerRef.current);
      fillers.forEach(u => URL.revokeObjectURL(u));
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
      // Simple hysteresis-based voice activity detection: a single noisy frame
      // (a cough, a chair creak, a mic pop) shouldn't count as "the user is
      // speaking" - the volume has to stay up for a bit, and has to stay down
      // for a bit before we call it over. This is what keeps barge-in from
      // firing on every little sound in the room.
      const SPEECH_THRESHOLD = 20;
      const SUSTAIN_MS = 280;
      const RELEASE_MS = 450;
      let aboveSince: number | null = null;
      let belowSince: number | null = null;
      let currentlySpeaking = false;
      const check = () => {
        analyser.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b, 0) / data.length;
        const now = performance.now();
        if (vol > SPEECH_THRESHOLD) {
          belowSince = null;
          if (aboveSince == null) aboveSince = now;
          if (!currentlySpeaking && now - aboveSince >= SUSTAIN_MS) {
            currentlySpeaking = true;
            setUserSpeaking(true);
          }
        } else {
          aboveSince = null;
          if (belowSince == null) belowSince = now;
          if (currentlySpeaking && now - belowSince >= RELEASE_MS) {
            currentlySpeaking = false;
            setUserSpeaking(false);
          }
        }
        audioFrameRef.current = requestAnimationFrame(check);
      };
      check();
    } catch (e) { console.error(e); }
  };


  const firmConfig = FIRM_CONFIGS[firm];
  const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;

  // Optional timed-pressure mode: a realistic target length by difficulty. Purely
  // a visual clock - it never force-ends the case (cutting someone off mid-thought
  // is harsh), it just turns amber then red to simulate interview time pressure.
  const targetSeconds = difficulty === "advanced" ? 15 * 60 : difficulty === "intermediate" ? 20 * 60 : 25 * 60;
  const remaining = Math.max(0, targetSeconds - elapsedTime);
  const timeColor = !timedMode
    ? "var(--text-secondary)"
    : remaining === 0 ? "#ef4444" : remaining <= 120 ? "#f59e0b" : "#b45309";

  const pickVoice = (voices: SpeechSynthesisVoice[]) => {
    const en = voices.filter(v => v.lang.startsWith("en"));
    const byName = (names: string[]) => en.find(v => names.some(n => v.name.includes(n)));
    // Tiered by realism, not just gender-match. "Online (Natural)" voices are
    // Edge/Chrome's neural TTS (near-human); Google's cloud voices and macOS
    // Premium/Enhanced voices are next; the classic offline robotic voices are
    // a last resort only. A natural voice of the "wrong" gender sounds far
    // better than a robotic one of the right gender.
    const isNeural = (v: SpeechSynthesisVoice) => /Online \(Natural\)|Natural|Neural|Premium|Enhanced/i.test(v.name);
    const isGoogle = (v: SpeechSynthesisVoice) => /Google/i.test(v.name);
    if (interviewer.gender === "male") {
      return byName(["Guy Online (Natural)", "Ryan Online (Natural)", "Christopher Online (Natural)", "Eric Online (Natural)"])
        ?? en.find(v => isNeural(v) && /male|guy|ryan|christopher|eric|daniel|alex/i.test(v.name))
        ?? byName(["Google UK English Male", "Google US English"])
        ?? byName(["Daniel", "Alex"])
        ?? en.find(isNeural) ?? en.find(isGoogle)
        ?? en.find(v => /male/i.test(v.name)) ?? en[0];
    }
    return byName(["Aria Online (Natural)", "Jenny Online (Natural)", "Emma Online (Natural)", "Michelle Online (Natural)"])
      ?? en.find(v => isNeural(v) && /female|aria|jenny|emma|michelle|samantha|victoria/i.test(v.name))
      ?? byName(["Google UK English Female", "Google US English"])
      ?? byName(["Samantha", "Victoria"])
      ?? en.find(isNeural) ?? en.find(isGoogle)
      ?? en.find(v => /female/i.test(v.name)) ?? en[0];
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    if (ttsAudioRef.current) {
      ttsAudioRef.current.onended = null;
      ttsAudioRef.current.onerror = null;
      ttsAudioRef.current.pause();
      ttsAudioRef.current.src = "";
    }
  };

  const speakBrowser = (clean: string) => {
    if (!synthRef.current || !mountedRef.current) return;
    const utterance = new SpeechSynthesisUtterance(clean);
    const trySpeak = () => {
      if (!mountedRef.current || !synthRef.current) return;
      const preferred = pickVoice(synthRef.current.getVoices());
      if (preferred) utterance.voice = preferred;
      utterance.rate = 1.03;
      utterance.pitch = 1.0;
      setIsSpeaking(true);
      utterance.onend = () => {
        if (!mountedRef.current) return;
        setIsSpeaking(false);
        // Hand the floor back to the user automatically instead of waiting for a click.
        if (!isMutedRef.current && !loadingRef.current) startListening();
      };
      utterance.onerror = () => { if (mountedRef.current) setIsSpeaking(false); };
      synthRef.current.speak(utterance);
    };
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) trySpeak();
    else synthRef.current.onvoiceschanged = () => trySpeak();
  };

  const noteTtsFailure = () => {
    ttsFailStreakRef.current += 1;
    if (ttsFailStreakRef.current >= 2) {
      ttsRetryAtRef.current = Date.now() + 60_000;
    }
  };

  const speak = async (text: string) => {
    if (!mountedRef.current) return;
    stopSpeaking();
    const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

    // Only skip the natural voice while inside a backoff window after repeated
    // failures - and even then, automatically resume trying once it elapses.
    if (ttsFailStreakRef.current >= 2 && Date.now() < ttsRetryAtRef.current) {
      speakBrowser(clean);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, gender: interviewer.gender }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("tts unavailable");
      const blob = await res.blob();
      if (!mountedRef.current) throw new Error("unmounted");

      const url = URL.createObjectURL(blob);
      // Reuse the same <audio> element every turn instead of `new Audio()` each
      // time. It was created and play()'d once during the "Join interview" click
      // (a real gesture) - later turns are triggered from async chains (fetch →
      // timer → promise) with no gesture behind them, which strict autoplay
      // policies (notably Safari) can silently block on a *fresh* element while
      // still allowing playback to continue on one that's already unlocked.
      const audio = ttsAudioRef.current ?? new Audio();
      ttsAudioRef.current = audio;
      audio.src = url;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (!mountedRef.current) return;
        setIsSpeaking(false);
        if (!isMutedRef.current && !loadingRef.current) startListening();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        noteTtsFailure();
        if (mountedRef.current) speakBrowser(clean);
      };
      await audio.play();
      ttsFailStreakRef.current = 0;
      setIsSpeaking(true);
    } catch {
      clearTimeout(timeoutId);
      noteTtsFailure();
      if (mountedRef.current) speakBrowser(clean);
    }
  };

  // Two-tone "participant joined" chime, synthesized on the spot - no audio
  // asset needed, and startSession is a real click so autoplay policy allows it.
  const playJoinChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [[659.25, 0], [880, 0.16]].forEach(([freq, at]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + at);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + at);
        osc.stop(ctx.currentTime + at + 0.35);
      });
      setTimeout(() => ctx.close().catch(() => {}), 1000);
    } catch {}
  };

  const FILLER_PHRASES = ["Mm-hm.", "Okay, got it.", "Right - let me think about that for a moment."];

  const prefetchFillers = () => {
    FILLER_PHRASES.forEach(async phrase => {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: phrase, gender: interviewer.gender }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        if (mountedRef.current) fillersRef.current.push(URL.createObjectURL(blob));
      } catch {}
    });
  };

  const playFiller = () => {
    if (!mountedRef.current || !loadingRef.current || isSpeakingRef.current) return;
    const fillers = fillersRef.current;
    if (fillers.length === 0) return;
    const audio = ttsAudioRef.current;
    if (!audio) return;
    audio.src = fillers[Math.floor(Math.random() * fillers.length)];
    audio.onended = () => { if (mountedRef.current) setIsSpeaking(false); };
    audio.onerror = () => { if (mountedRef.current) setIsSpeaking(false); };
    audio.play().then(() => setIsSpeaking(true)).catch(() => {});
  };

  const startSession = async () => {
    // Prime audio playback + speech synthesis synchronously inside this click
    // handler - a genuine user gesture - so every later turn (each triggered
    // from an async fetch/timer chain with no gesture behind it) inherits the
    // unlock instead of getting silently blocked by autoplay policy.
    const primer = new Audio();
    primer.play().catch(() => {});
    ttsAudioRef.current = primer;
    try {
      const unlock = new SpeechSynthesisUtterance(" ");
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    } catch {}

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
      } catch {
        // Neither video nor audio access was granted - voice barge-in detection
        // (which relies on mic volume, separate from SpeechRecognition) won't
        // work, and there's no camera preview. Surface this instead of leaving
        // the user wondering why the interview feels dead.
        setMediaError(true);
      }
    }
    setSessionStarted(true);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    // Mic is live immediately - no click needed, and it runs in parallel with the
    // interviewer's opening line so you can jump in even during the greeting.
    startListening();
    prefetchFillers();
    // Join sequence: you land in the room first, the interviewer's tile shows
    // "Connecting..." for a beat, then the chime plays and they greet you - 
    // the way an actual call starts, not everyone teleporting in at once.
    setTimeout(() => {
      if (!mountedRef.current) return;
      setInterviewerJoined(true);
      playJoinChime();
      setTimeout(() => speak(transcript[0]?.content ?? ""), 700);
    }, 1800);
  };

  const toggleMute = () => {
    const wasMuted = isMuted;
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = wasMuted; });
    setIsMuted(!wasMuted);
    if (wasMuted) startListening();
    else stopListening();
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = isVideoOff; });
    setIsVideoOff(v => !v);
  };

  const SILENCE_MS = 1000;

  // Fully continuous, hands-free listening: the mic stays open the entire session,
  // including while the interviewer is talking or the AI is thinking - there's no
  // "your turn" gate to wait on. After ~1s of silence following speech, whatever
  // was heard is sent automatically, like a real conversation.
  //
  // Interrupting the interviewer requires BOTH speech recognition hearing words
  // AND the volume-based monitor (userSpeakingRef) confirming real mic-level sound - 
  // this pair keeps the interviewer's own voice bleeding back through the speakers
  // from falsely triggering a self-interruption.
  const startListening = () => {
    if (recognitionRef.current || isMutedRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
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
      const heard = (final + interim).trim();
      // Confirmed real speech during the interviewer's turn - commit to the interruption now.
      // Recognition alone is the signal: it only fires on actual speech-like audio, and
      // waiting on the separate volume detector too (which needs ~280ms sustained
      // loudness) created a race where short interjections like "wait" or "actually"
      // would arrive as a transcript before the volume gate opened, silently failing
      // to interrupt and leaving no option but to click "Stop talking" by hand.
      if (isSpeakingRef.current && heard.length >= 1) {
        stopSpeaking();
        isSpeakingRef.current = false;
        setIsSpeaking(false);
      }
      setInput(final); setInterimText(interim);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (heard) {
        silenceTimerRef.current = setTimeout(() => {
          const toSend = final.trim();
          if (toSend && !loadingRef.current) { stopListening(); sendMessage(toSend); }
        }, SILENCE_MS);
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
      setInterimText("");
    };
    recognition.onerror = (e: any) => {
      if (e?.error === "no-speech" || e?.error === "aborted") return;
      recognitionRef.current = null;
      setIsListening(false);
    };
    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch { recognitionRef.current = null; }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
  };

  // Self-healing watchdog: recognition sessions end on their own (browser
  // timeouts, transient errors, a deliberate stop before sending). Whenever the
  // mic should be live but isn't, restart it a beat later - no click required.
  useEffect(() => {
    if (isMuted || !sessionStarted || isListening) return;
    const t = setTimeout(() => {
      if (!isMutedRef.current && !recognitionRef.current) startListening();
    }, 500);
    return () => clearTimeout(t);
  }, [isMuted, isListening, sessionStarted]);

  // The first exchange is small talk, not case-solving - handled locally so the
  // case prompt is delivered verbatim (never paraphrased by the model) and so
  // this beat costs no API call. Whatever the candidate says here just moves
  // things along, same as a real interviewer wouldn't interrogate "yes I'm ready."
  const revealCase = (newTranscript: Message[]) => {
    setInput(""); setInterimText("");
    setCaseRevealed(true);
    setLoading(true);
    const reveal: Message = {
      role: "assistant",
      content: `Great, let's get into it.\n\n${casePrompt}\n\nTake a moment to read through the case. Feel free to ask any clarifying questions when you're ready.`,
      timestamp: new Date(),
    };
    setTimeout(() => {
      if (!mountedRef.current) return;
      setLoading(false);
      setTranscript([...newTranscript, reveal]);
      speak(reveal.content);
    }, 500);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    stopSpeaking();
    setIsSpeaking(false);
    stopListening();
    const userMessage: Message = { role: "user", content: content.trim(), timestamp: new Date() };
    const newTranscript = [...transcript, userMessage];
    setTranscript(newTranscript);

    if (!caseRevealedRef.current) {
      revealCase(newTranscript);
      return;
    }

    setInput(""); setInterimText("");
    setLoading(true);
    // A beat after you finish talking, the interviewer acknowledges out loud
    // ("Mm-hm...") while the real reply is still being generated - the gap
    // feels like someone considering your answer instead of a loading spinner.
    if (fillerTimerRef.current) clearTimeout(fillerTimerRef.current);
    fillerTimerRef.current = setTimeout(playFiller, 900);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch("/api/case/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firm, casePrompt, difficulty, transcript: newTranscript, hintsUsed, personality, preferredProvider: aiProvider }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.response) throw new Error(data?.error ?? "No response from interviewer");
      if (data.provider) setAiProvider(data.provider);
      if (!mountedRef.current) return;
      const aiMessage: Message = { role: "assistant", content: data.response, timestamp: new Date() };
      setTranscript(prev => [...prev, aiMessage]);
      speak(data.response);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(err);
      if (!mountedRef.current) return;
      const errMessage: Message = { role: "assistant", content: "Sorry - I lost that for a moment. Could you say that again?", timestamp: new Date() };
      setTranscript(prev => [...prev, errMessage]);
      speak(errMessage.content);
    } finally {
      if (fillerTimerRef.current) { clearTimeout(fillerTimerRef.current); fillerTimerRef.current = null; }
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopListening();
    stopSpeaking();
    if (synthRef.current) synthRef.current.onvoiceschanged = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (audioFrameRef.current) cancelAnimationFrame(audioFrameRef.current);
    trackEvent("case_completed", {
      case_source: "ai",
      firm,
      case_type: caseType,
      difficulty,
      practice_mode: "live",
      duration_seconds: elapsedTime,
      hints_used: hintsUsed,
      user_responses: transcript.filter(message => message.role === "user").length,
    });
    sessionStorage.setItem("transcriptData", JSON.stringify({ firm, caseType, difficulty, mode: "live", hintsUsed, duration: elapsedTime, transcript, caseTitle, aiProvider }));
    router.push("/case/feedback");
  };

  const ctrlBtn = (active = false, danger = false): React.CSSProperties => ({
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "4px", width: "64px", minWidth: "56px", height: "56px", borderRadius: "12px",
    border: "1px solid transparent",
    background: danger ? "rgba(220,38,38,0.08)" : active ? "rgba(124,92,252,0.1)" : "transparent",
    color: danger ? "var(--danger)" : active ? "#7c5cfc" : "var(--text-primary)",
    cursor: "pointer", flexShrink: 0, transition: "all 0.15s", fontFamily: FONT,
  });

  // ── NO CASE DATA ── (e.g. a refresh, or landing here directly instead of via the dashboard)
  if (ready && !casePrompt) {
    return (
      <main style={{ minHeight: "100dvh", background: "var(--bg)", display: "grid", placeItems: "center", color: "var(--text-primary)", fontFamily: FONT, padding: "24px" }}>
        <section style={{ width: "100%", maxWidth: "480px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px 32px", textAlign: "center" }}>
          <div aria-hidden style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-elevated)", display: "grid", placeItems: "center", margin: "0 auto 16px", color: "var(--text-secondary)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6"/></svg>
          </div>
          <h1 style={{ fontSize: "1.25rem", lineHeight: 1.3, fontWeight: 700, margin: "0 0 8px" }}>No case loaded</h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 auto 24px", maxWidth: "360px" }}>
            This can happen after a refresh. Start a new case from your dashboard.
          </p>
          <button
            aria-label="Go to dashboard"
            onClick={() => router.push("/dashboard")}
            style={{ height: "44px", padding: "0 20px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "0.875rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}
          >
            Go to dashboard
          </button>
        </section>
      </main>
    );
  }

  // ── PRE-SESSION ──
  if (!sessionStarted) {
    return (
      <main style={{ minHeight: "100dvh", background: "var(--bg)", display: "grid", placeItems: "center", color: "var(--text-primary)", fontFamily: FONT, padding: "32px 20px" }}>
        <style>{`@media (max-width: 560px) { .hp-lobby-card { padding: 28px 20px !important; } }`}</style>
        <section className="hp-lobby-card" style={{ width: "100%", maxWidth: "560px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px", boxShadow: "0 20px 56px rgba(17,17,17,0.06)" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "28px", padding: "4px 10px", borderRadius: "999px", background: `color-mix(in srgb, ${firmConfig.color} 10%, white)`, border: `1px solid color-mix(in srgb, ${firmConfig.color} 24%, var(--border))`, fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
            <span aria-hidden style={{ width: "6px", height: "6px", borderRadius: "999px", background: firmConfig.color }} />
            {FIRM_SHORT[firm] ?? firmConfig.name} · Live interview
          </div>

          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {caseTitle}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            <span style={{ padding: "4px 10px", borderRadius: "999px", background: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{difficulty}</span>
            <span style={{ padding: "4px 10px", borderRadius: "999px", background: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{caseType ?? "Case interview"}</span>
          </div>

          {/* Interviewer */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "20px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "999px", overflow: "hidden", background: "#0d0d0f", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <img src={interviewer.image} alt={interviewer.name} style={{ width: "84%", height: "84%", objectFit: "contain", marginTop: "6px" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>{interviewer.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{interviewer.title}, {FIRM_SHORT[firm] ?? firmConfig.name}</div>
            </div>
          </div>

          {/* Case brief */}
          {casePrompt && (
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", width: "100%", marginBottom: "20px" }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "8px" }}>Case brief</div>
              {/* Full text, never truncated - scrolls within the panel if the case runs long. */}
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
                {casePrompt}
              </p>
            </div>
          )}

          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.6, margin: "0 0 16px" }}>
            Your mic is live when you join. Talk naturally, jump in anytime, or type your response.
          </p>

          <button
            aria-label="Join interview"
            onClick={startSession}
            style={{ width: "100%", height: "48px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
          >
            Join interview
          </button>

          <button
            aria-label="Back to dashboard"
            onClick={() => router.push("/dashboard")}
            style={{ display: "block", margin: "12px auto 0", minHeight: "44px", padding: "0 12px", background: "transparent", color: "var(--text-secondary)", border: "none", fontSize: "0.8125rem", cursor: "pointer", fontFamily: FONT }}
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  // ── ACTIVE SESSION ──
  return (
    <main className={mediaError ? "hp-has-media-error" : undefined} style={{ height: "100dvh", minHeight: "560px", background: "var(--bg)", display: "flex", flexDirection: "column", color: "var(--text-primary)", overflow: "hidden", fontFamily: FONT, position: "relative" }}>

      <style>{`
        @keyframes hp-interview-ring {
          0%, 100% { box-shadow: 0 0 0 2px rgba(124,92,252,.42), 0 0 28px rgba(124,92,252,.14); }
          50% { box-shadow: 0 0 0 4px rgba(124,92,252,.72), 0 0 44px rgba(124,92,252,.28); }
        }
        @keyframes hp-interview-wave {
          0%, 100% { transform: scaleY(.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes hp-interview-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: .35; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes hp-interview-shimmer {
          0%, 100% { opacity: .45; }
          50% { opacity: 1; }
        }
        .hp-speaking-ring { animation: hp-interview-ring 1.8s ease-in-out infinite; }
        .hp-wave-bar { animation: hp-interview-wave .65s ease-in-out infinite; transform-origin: center; }
        .hp-thinking-dot { animation: hp-interview-dot 1.1s ease-in-out infinite; }
        .hp-connecting { animation: hp-interview-shimmer 1.5s ease-in-out infinite; }
        .hp-interview-ctrl-btn:hover { background: var(--bg-elevated) !important; }
        .hp-interview-ctrl-btn[data-active="true"]:hover { background: rgba(124,92,252,.14) !important; }
        .hp-interview-ctrl-btn[data-danger="true"]:hover { background: rgba(220,38,38,.13) !important; }
        .hp-topbar { display: grid !important; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); }
        .hp-topbar-right { display: contents !important; }
        .hp-top-status { grid-column: 2; }
        .hp-topbar-right > button { grid-column: 3; justify-self: end; }
        .hp-interview-control-bar {
          position: absolute !important; left: 50%; bottom: 12px; transform: translateX(-50%);
          width: max-content; max-width: calc(100% - 24px); height: 64px !important; padding: 4px 6px !important;
          border: 1px solid var(--border) !important; border-radius: 999px; background: #fff !important;
          box-shadow: 0 12px 36px rgba(17,17,17,.14); z-index: 40; overflow-x: auto;
        }
        .hp-interview-video-grid {
          position: relative; display: block !important; padding: 12px 12px 88px !important;
          background: var(--bg-card); overflow: hidden;
        }
        .hp-interviewer-tile { width: 100%; height: 100%; }
        .hp-user-tile {
          position: absolute !important; right: 28px; bottom: 104px; width: 180px; height: 132px;
          border-color: rgba(255,255,255,.78) !important; box-shadow: 0 12px 32px rgba(0,0,0,.28); z-index: 5;
        }
        .hp-user-tile.hp-user-speaking { border-color: var(--success) !important; }
        .hp-interview-chat-panel, .hp-case-sheet {
          position: fixed !important; top: 56px !important; right: 0 !important; bottom: 0 !important;
          left: auto !important;
          width: 380px !important; height: auto !important; background: #fff !important; color: var(--text-primary) !important;
          border-left: 1px solid var(--border) !important; box-shadow: -16px 0 40px rgba(17,17,17,.08);
          z-index: 60 !important;
        }
        .hp-has-media-error .hp-interview-chat-panel, .hp-has-media-error .hp-case-sheet { top: 88px !important; }
        .hp-has-media-error .hp-hint-toast { top: 104px !important; }
        .hp-hint-toast { background: #fff !important; color: var(--text-primary) !important; border-color: rgba(124,92,252,.28) !important; box-shadow: 0 16px 40px rgba(17,17,17,.14) !important; }
        .hp-caption { position: fixed !important; left: 50% !important; right: auto !important; bottom: 88px !important; width: auto; max-width: min(640px, calc(100% - 48px)); transform: translateX(-50%) !important; z-index: 35; }
        @media (max-width: 767px) {
          .hp-topbar { height: 88px !important; padding: 10px 12px !important; grid-template-columns: minmax(0,1fr) auto !important; grid-template-rows: auto auto; align-content: center; gap: 6px 10px !important; }
          .hp-topbar-left { grid-column: 1; grid-row: 1; min-width: 0; }
          .hp-topbar-right > button { grid-column: 2; grid-row: 1; }
          .hp-top-status { grid-column: 1 / -1; grid-row: 2; justify-self: start; }
          .hp-interview-video-grid { padding: 8px 8px 84px !important; display: grid !important; grid-template-rows: minmax(220px,1fr) 136px !important; gap: 8px !important; }
          .hp-interviewer-tile { min-height: 0; }
          .hp-user-tile { position: relative !important; inset: auto !important; width: 100% !important; height: 136px !important; }
          .hp-interview-control-bar { left: 8px !important; right: 8px !important; transform: none !important; width: auto !important; justify-content: flex-start !important; }
          .hp-interview-ctrl-btn { width: 56px !important; min-width: 52px !important; }
          .hp-interview-chat-panel, .hp-case-sheet {
            top: auto !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            width: 100% !important; height: auto !important; max-height: 70vh !important;
            border-left: none !important; border-top: 1px solid var(--border) !important; border-radius: 16px 16px 0 0;
          }
          .hp-has-media-error .hp-interview-chat-panel, .hp-has-media-error .hp-case-sheet { top: auto !important; }
          .hp-hint-toast { top: 96px !important; width: calc(100% - 16px) !important; max-width: none !important; }
          .hp-has-media-error .hp-hint-toast { top: 128px !important; }
          .hp-caption { bottom: 84px !important; max-width: calc(100% - 32px) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-speaking-ring, .hp-wave-bar, .hp-thinking-dot, .hp-connecting { animation: none !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="hp-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "0 16px", height: "56px", background: "var(--bg)", borderBottom: "1px solid var(--border)", flexShrink: 0, zIndex: 50 }}>
        <div className="hp-topbar-left" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <span style={{ display: "inline-flex", alignItems: "center", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", flexShrink: 0 }}>
            <img src="/newlogomcp.png" alt="" aria-hidden style={{ width: "24px", height: "24px" }} />
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {caseTitle} · {FIRM_SHORT[firm] ?? firmConfig.name}
          </span>
        </div>
        <div className="hp-topbar-right" style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {/* Whose turn it is changes without any user action, so screen readers
              need it announced (WCAG 4.1.3) - otherwise a blind candidate has no
              way to know the interviewer stopped talking. */}
          <div className="hp-top-status" role="status" aria-live="polite" style={{
            display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 10px", borderRadius: "999px", fontSize: "0.6875rem", fontWeight: 700,
            background: !interviewerJoined ? "var(--bg-elevated)" : isSpeaking ? "rgba(124,92,252,0.09)" : loading ? "rgba(245,158,11,0.1)" : "rgba(22,163,74,0.09)",
            color: "var(--text-primary)", border: "1px solid var(--border)", whiteSpace: "nowrap",
            transition: "all 0.3s",
          }}>
            <span aria-hidden style={{ width: "7px", height: "7px", borderRadius: "999px", background: !interviewerJoined ? "#a3a3a3" : isSpeaking ? "#7c5cfc" : loading ? "#f59e0b" : "var(--success)" }} />
            {!interviewerJoined ? "Connecting…" : loading ? "Thinking" : isSpeaking ? "Interviewer speaking" : isListening ? "Listening" : "Your turn"}
          </div>
          <button
            aria-label={timedMode ? "Switch to count-up timer" : "Switch to countdown timer"}
            aria-pressed={timedMode}
            onClick={() => setTimedMode(t => !t)}
            title={timedMode ? "Switch to a count-up timer" : "Switch to a timed countdown for interview pressure"}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "44px", background: timedMode ? "rgba(245,158,11,0.1)" : "var(--bg-card)", border: `1px solid ${timedMode ? "rgba(245,158,11,0.35)" : "var(--border)"}`, borderRadius: "999px", padding: "0 12px", cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}
          >
            <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={timeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M9 2h6" /></svg>
            <span style={{ fontVariantNumeric: "tabular-nums", fontSize: "0.75rem", color: timeColor, fontWeight: 700 }}>
              {timedMode ? (remaining === 0 ? "Time's up" : formatTime(remaining)) : formatTime(elapsedTime)}
            </span>
          </button>
        </div>
      </div>

      {/* Media permission warning */}
      {mediaError && (
        <div role="alert" style={{ padding: "7px 16px", background: "rgba(245,158,11,0.1)", borderBottom: "1px solid rgba(245,158,11,0.3)", fontSize: "0.75rem", color: "#92400e", textAlign: "center", flexShrink: 0 }}>
          Camera or microphone permission was denied. You can still type, or allow access in your browser to use voice and video.
        </div>
      )}

      {/* Hint overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div className="hp-hint-toast" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ position: "absolute", top: "72px", left: "50%", transform: "translateX(-50%)", width: "520px", maxWidth: "calc(100% - 48px)", background: "#fff", border: "1px solid rgba(124,92,252,0.3)", borderRadius: "12px", padding: "16px", zIndex: 70, boxShadow: "0 16px 40px rgba(17,17,17,0.14)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7c5cfc", marginBottom: "4px" }}>Hint {hintsUsed}</div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>{getHint(hintsUsed, caseContext, casePrompt)}</p>
              </div>
              <button aria-label="Dismiss hint" onClick={() => setShowHint(false)} style={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1rem", width: "44px", height: "44px", display: "grid", placeItems: "center", flexShrink: 0 }}>×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case overlay */}
      <AnimatePresence>
        {showCaseOverlay && (
          <motion.div className="hp-case-sheet" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog" aria-label="Case brief" style={{ position: "absolute", bottom: "76px", left: "50%", transform: "translateX(-50%)", width: "520px", maxWidth: "90vw", background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", zIndex: 60, boxShadow: "0 24px 60px rgba(17,17,17,0.14)", maxHeight: "50vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "56px", padding: "0 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--text-primary)" }}>Case brief</span>
              <button aria-label="Close case brief" onClick={() => setShowCaseOverlay(false)} style={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.1rem", width: "44px", height: "44px", display: "grid", placeItems: "center" }}>×</button>
            </div>
            <div style={{ overflowY: "auto", padding: "20px" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-primary)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{casePrompt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Video area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="hp-interview-video-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "10px 10px 6px", overflow: "hidden" }}>

            {/* Interviewer tile */}
            <div className={`hp-interviewer-tile${isSpeaking ? " hp-speaking-ring" : ""}`} style={{ borderRadius: "16px", overflow: "hidden", background: "#0d0d0f", position: "relative", border: "1px solid rgba(255,255,255,0.1)", transition: "border-color 0.25s" }}>
              {interviewerJoined ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 50% 42%, #262638 0%, #15151c 48%, #0d0d0f 100%)", display: "grid", placeItems: "center" }}
                >
                  <img
                    className="hp-interviewer-video"
                    src={interviewer.image} alt={interviewer.name}
                    style={{ width: "auto", height: "78%", maxWidth: "85%", objectFit: "contain", display: "block", filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))" }}
                  />
                </motion.div>
              ) : (
                <div className="hp-connecting" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "9999px", background: "rgba(255,255,255,0.07)", display: "grid", placeItems: "center", fontSize: "1.6rem", fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
                    {interviewer.name.charAt(0)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", color: "rgba(255,255,255,0.64)" }}>
                    Connecting…
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isSpeaking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}
                    style={{ position: "absolute", bottom: "56px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4px", alignItems: "center", background: "rgba(13,13,15,0.72)", borderRadius: "999px", padding: "6px 12px" }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <span className="hp-wave-bar" key={i} style={{ width: "3px", height: i === 2 ? "16px" : "12px", background: "#a78bfa", borderRadius: "999px", animationDelay: `${i * 80}ms` }} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && !isSpeaking && (
                <div aria-label="Interviewer is thinking" style={{ position: "absolute", bottom: "56px", left: "50%", transform: "translateX(-50%)", background: "rgba(13,13,15,0.72)", borderRadius: "999px", padding: "8px 12px", display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <span className="hp-thinking-dot" key={i} style={{ width: "5px", height: "5px", borderRadius: "999px", background: "#f59e0b", animationDelay: `${i * 140}ms` }} />
                  ))}
                </div>
              )}

              <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", borderRadius: "8px", padding: "4px 10px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{interviewer.name}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.62)" }}>{interviewer.title} · {FIRM_SHORT[firm] ?? firmConfig.name}</div>
              </div>

              {isSpeaking && (
                <button aria-label="Stop interviewer speaking" onClick={() => {
                  stopSpeaking();
                  isSpeakingRef.current = false;
                  setIsSpeaking(false);
                  if (!isMuted && !loadingRef.current) startListening();
                }}
                  style={{ position: "absolute", top: "12px", right: "12px", minHeight: "44px", background: "rgba(255,255,255,0.94)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "999px", padding: "0 14px", fontSize: "0.6875rem", fontWeight: 700, color: "#111", cursor: "pointer", fontFamily: FONT }}>
                  Stop talking
                </button>
              )}
            </div>

            {/* User tile */}
            <div className={`hp-user-tile${userSpeaking && !isMuted ? " hp-user-speaking" : ""}`} style={{ borderRadius: "12px", overflow: "hidden", background: "#0d0d0f", position: "relative", border: `2px solid ${userSpeaking && !isMuted ? "var(--success)" : "rgba(255,255,255,0.78)"}`, transition: "border-color 0.15s" }}>
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

              {/* Live caption - shows what's being heard right now, even if the chat panel is closed */}
              <AnimatePresence>
                {isListening && (
                  <motion.div className="hp-caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18, ease: "easeOut" }}
                    style={{ position: "absolute", bottom: "44px", left: "10px", right: "10px", background: "rgba(0,0,0,0.65)", borderRadius: "10px", padding: "6px 10px", fontSize: "0.78rem", lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>
                    {interimText || <span style={{ color: "rgba(255,255,255,0.35)" }}>Listening...</span>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", borderRadius: "8px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{session?.user?.name ?? "You"}</span>
                {isMuted && <span style={{ fontSize: "0.65rem", color: "#ef4444" }}>Muted</span>}
                {userSpeaking && !isMuted && (
                  <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <span className="hp-wave-bar" key={i} style={{ width: "2px", height: "8px", background: "var(--success)", borderRadius: "1px", animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                )}
              </div>
              {isVideoOff && <span style={{ position: "absolute", top: "8px", right: "8px", padding: "3px 7px", borderRadius: "8px", background: "rgba(13,13,15,0.72)", color: "rgba(255,255,255,0.8)", fontSize: "0.625rem", fontWeight: 700 }}>Camera off</span>}
            </div>
          </div>

          {/* Control bar */}
          <div className="hp-interview-control-bar" role="toolbar" aria-label="Interview controls" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", background: "#fff", borderTop: "1px solid var(--border)", flexShrink: 0, padding: "0 16px" }}>
            <button className="hp-interview-ctrl-btn" data-active={isMuted} aria-label={isMuted ? "Unmute microphone" : "Mute microphone"} aria-pressed={isMuted} onClick={toggleMute} style={ctrlBtn(isMuted)}>
              <MicIcon muted={isMuted} />
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
            <button className="hp-interview-ctrl-btn" data-active={isVideoOff} aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"} aria-pressed={isVideoOff} onClick={toggleVideo} style={ctrlBtn(isVideoOff)}>
              <CameraIcon off={isVideoOff} />
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>{isVideoOff ? "Camera on" : "Camera off"}</span>
            </button>
            <span aria-hidden style={{ width: "1px", height: "32px", background: "var(--border)", margin: "0 3px", flexShrink: 0 }} />
            <button className="hp-interview-ctrl-btn" aria-label="Show a hint" onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }} style={ctrlBtn(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Hint{hintsUsed > 0 ? ` (${hintsUsed})` : ""}</span>
            </button>
            <button className="hp-interview-ctrl-btn" data-active={showCaseOverlay} aria-label="Toggle case brief" aria-pressed={showCaseOverlay} onClick={() => { setShowChat(false); setShowCaseOverlay(v => !v); }} style={ctrlBtn(showCaseOverlay)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Case</span>
            </button>
            <button className="hp-interview-ctrl-btn" data-active={showChat} aria-label="Toggle transcript" aria-pressed={showChat} onClick={() => { setShowCaseOverlay(false); setShowChat(v => !v); }} style={ctrlBtn(showChat)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Transcript</span>
            </button>
            <span aria-hidden style={{ width: "1px", height: "32px", background: "var(--border)", margin: "0 3px", flexShrink: 0 }} />
            <button className="hp-interview-ctrl-btn" data-danger="true" aria-label="End the interview" onClick={() => setShowEndConfirm(true)} style={ctrlBtn(false, true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)"/></svg>
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>End</span>
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div className="hp-interview-chat-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.18, ease: "easeOut" }}
              role="dialog" aria-label="Interview transcript" style={{ borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff", flexShrink: 0 }}>
              <div style={{ minHeight: "56px", padding: "0 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--text-primary)" }}>Transcript</div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginTop: "2px" }}>{transcript.length} messages</div>
                </div>
                <button aria-label="Close transcript" onClick={() => setShowChat(false)} style={{ width: "44px", height: "44px", borderRadius: "8px", border: "none", background: "var(--bg-elevated)", color: "var(--text-secondary)", display: "grid", placeItems: "center", cursor: "pointer", fontSize: "1.1rem" }}>×</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {transcript.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.625rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                      <span>{msg.role === "user" ? (session?.user?.name ?? "You") : interviewer.name}</span>
                      <span aria-hidden>·</span>
                      <time>{msg.timestamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                    </div>
                    <div style={{ maxWidth: "88%", padding: "10px 12px", borderRadius: msg.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", background: msg.role === "user" ? "rgba(124,92,252,0.1)" : "var(--bg-elevated)", border: msg.role === "user" ? "1px solid rgba(124,92,252,0.18)" : "1px solid var(--border)", fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
                      {renderContent(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div aria-label="Interviewer is typing" style={{ padding: "10px 12px", borderRadius: "4px 12px 12px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", width: "fit-content", display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <span className="hp-thinking-dot" key={i} style={{ width: "5px", height: "5px", borderRadius: "999px", background: "var(--text-secondary)", animationDelay: `${i * 140}ms` }} />
                    ))}
                  </div>
                )}
                {isListening && interimText && (
                  <div style={{ padding: "8px 10px", borderRadius: "12px 4px 12px 12px", background: "rgba(124,92,252,0.05)", border: "1px dashed rgba(124,92,252,0.24)", fontSize: "0.75rem", color: "var(--text-secondary)", fontStyle: "italic", alignSelf: "flex-end", maxWidth: "88%" }}>
                    {interimText}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "12px", borderTop: "1px solid var(--border)", background: "#fff", flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.6875rem", color: isListening ? "#7c5cfc" : "var(--text-secondary)", fontWeight: 700 }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: isListening ? "#7c5cfc" : isMuted ? "var(--danger)" : "var(--text-secondary)", flexShrink: 0 }} />
                  {isMuted ? "Muted — unmute to talk" : isListening ? "Listening…" : "Type below, or just talk"}
                </div>
                <textarea
                  aria-label="Type your interview response"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => { if (isListening) stopListening(); }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder={isListening ? "Listening..." : "Type your response..."}
                  style={{ width: "100%", background: "var(--bg-card)", border: `1px solid ${isListening ? "rgba(124,92,252,0.35)" : "var(--border)"}`, borderRadius: "8px", padding: "10px 12px", color: "var(--text-primary)", fontSize: "0.8125rem", fontFamily: FONT, resize: "none", minHeight: "64px", maxHeight: "104px", lineHeight: 1.55, boxSizing: "border-box" }}
                  rows={2}
                />
                <button
                  aria-label="Send response"
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  style={{ height: "44px", borderRadius: "8px", border: "none", background: loading || !input.trim() ? "var(--bg-elevated)" : "var(--accent)", color: loading || !input.trim() ? "var(--text-secondary)" : "#fff", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "0.75rem", fontFamily: FONT, fontWeight: 700 }}
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* End confirm modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.48)", display: "grid", placeItems: "center", zIndex: 100, padding: "20px" }}
            onClick={() => setShowEndConfirm(false)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="hp-end-title" initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "400px", boxShadow: "0 24px 64px rgba(17,17,17,0.2)" }}>
              <h2 id="hp-end-title" style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 8px", color: "var(--text-primary)", fontFamily: FONT }}>End interview?</h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 20px", fontFamily: FONT }}>
                You&apos;ll be taken to your scorecard. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button aria-label="Keep interview going" onClick={() => setShowEndConfirm(false)}
                  style={{ flex: "1 1 140px", height: "44px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.8125rem", fontFamily: FONT, fontWeight: 700 }}>
                  Keep going
                </button>
                <button aria-label="Confirm end interview" onClick={() => { setShowEndConfirm(false); handleEndSession(); }}
                  style={{ flex: "1 1 140px", height: "44px", borderRadius: "8px", border: "none", background: "var(--danger)", color: "#fff", cursor: "pointer", fontSize: "0.8125rem", fontFamily: FONT, fontWeight: 700 }}>
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
