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
    ? "rgba(255,255,255,0.3)"
    : remaining === 0 ? "#ef4444" : remaining <= 120 ? "#f59e0b" : "rgba(255,255,255,0.55)";

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
    gap: "4px", width: "68px", height: "52px", borderRadius: "10px",
    border: `1px solid ${danger ? "#dc2626" : active ? "rgba(124,92,252,0.45)" : "rgba(255,255,255,0.1)"}`,
    background: danger ? "#dc2626" : active ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.05)",
    color: danger ? "#fff" : active ? "#a78bfa" : "rgba(255,255,255,0.65)",
    cursor: "pointer", flexShrink: 0, transition: "all 0.15s", fontFamily: FONT,
  });

  // ── NO CASE DATA ── (e.g. a refresh, or landing here directly instead of via the dashboard)
  if (ready && !casePrompt) {
    return (
      <main style={{ height: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, padding: "0 1.5rem", gap: "1rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>No case loaded</p>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: "360px" }}>
          This can happen after a refresh. Start a new case from your dashboard.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ marginTop: "0.5rem", height: "44px", padding: "0 1.5rem", borderRadius: "10px", border: "none", background: "#fff", color: "#111", fontSize: "0.85rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}
        >
          Go to dashboard
        </button>
      </main>
    );
  }

  // ── PRE-SESSION ──
  if (!sessionStarted) {
    return (
      <main style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, padding: "2.5rem 1.5rem" }}>
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
            <div style={{ width: "84px", height: "84px", borderRadius: "9999px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", background: "linear-gradient(160deg, #2a2a3e 0%, #1c1c2a 100%)", display: "grid", placeItems: "center" }}>
              <img src={interviewer.image} alt={interviewer.name} style={{ width: "82%", height: "82%", objectFit: "contain", marginTop: "10px" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{interviewer.name}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{interviewer.title}, {FIRM_SHORT[firm] ?? firmConfig.name}</div>
            </div>
          </div>

          {/* Case brief */}
          {casePrompt && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem 1.25rem", width: "100%", boxSizing: "border-box" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>Case brief</div>
              {/* Full text, never truncated - scrolls within the panel if the case runs long. */}
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", maxHeight: "34vh", overflowY: "auto", paddingRight: "0.4rem" }}>
                {casePrompt}
              </p>
            </div>
          )}

          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.65, margin: 0 }}>
            Your mic is live the moment you join - just talk naturally, no clicking or waiting your turn. Jump in anytime, even mid-sentence. You can also type instead.
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
    <main style={{ height: "100vh", background: "#111", display: "flex", flexDirection: "column", color: "#fff", overflow: "hidden", fontFamily: FONT, position: "relative" }}>

      <style>{`
        @media (max-width: 760px) {
          .hp-interview-video-grid { grid-template-columns: 1fr !important; grid-template-rows: 1fr 1fr !important; }
          .hp-interview-ctrl-btn-label { display: none !important; }
          .hp-interview-ctrl-btn { width: 44px !important; }
          .hp-interview-chat-panel { position: fixed !important; inset: 44px 0 0 0 !important; width: 100% !important; z-index: 200; }
        }
        /* Barely-perceptible drift on the interviewer's "camera" so the static
           photo reads as a live video feed instead of a frozen frame. */
        @keyframes hp-kenburns {
          0%   { transform: scale(1.02) translate(0, 0); }
          50%  { transform: scale(1.07) translate(-0.6%, -0.8%); }
          100% { transform: scale(1.03) translate(0.5%, 0.3%); }
        }
        .hp-interviewer-video { animation: hp-kenburns 26s ease-in-out infinite alternate; transform-origin: center 30%; }
        @keyframes hp-connect-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Media permission warning */}
      {mediaError && (
        <div style={{ padding: "0.5rem 1.25rem", background: "rgba(245,158,11,0.12)", borderBottom: "1px solid rgba(245,158,11,0.3)", fontSize: "0.75rem", color: "#fbbf24", textAlign: "center", flexShrink: 0 }}>
          Camera/mic access wasn&apos;t granted - voice barge-in won&apos;t detect your volume. You can still type, or use the Mute/Unmute button after allowing mic access in your browser.
        </div>
      )}

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.25rem", height: "44px", background: "#191919", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "-0.01em", color: "#fff" }}>
            <img src="/newlogomcp.png" alt="" style={{ width: "18px", height: "18px", flexShrink: 0 }} />
            <span style={{ position: "relative", top: "-1px" }}>mycaseprep</span>
          </span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "280px" }}>
            {caseTitle} · {FIRM_SHORT[firm] ?? firmConfig.name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Whose turn it is changes without any user action, so screen readers
              need it announced (WCAG 4.1.3) - otherwise a blind candidate has no
              way to know the interviewer stopped talking. */}
          <div role="status" aria-live="polite" style={{
            padding: "3px 10px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 600,
            background: !interviewerJoined ? "rgba(255,255,255,0.06)" : isSpeaking ? "rgba(167,139,250,0.15)" : loading ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.15)",
            color: !interviewerJoined ? "rgba(255,255,255,0.4)" : isSpeaking ? "#a78bfa" : loading ? "#f59e0b" : "#22c55e",
            border: `1px solid ${!interviewerJoined ? "rgba(255,255,255,0.1)" : isSpeaking ? "rgba(167,139,250,0.3)" : loading ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`,
            transition: "all 0.3s",
          }}>
            {!interviewerJoined ? "Connecting..." : loading ? "Thinking..." : isSpeaking ? "Interviewer speaking - jump in anytime" : isListening ? "Listening..." : "Your turn"}
          </div>
          <button
            onClick={() => setTimedMode(t => !t)}
            title={timedMode ? "Switch to a count-up timer" : "Switch to a timed countdown for interview pressure"}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: timedMode ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${timedMode ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "9999px", padding: "3px 10px", cursor: "pointer", fontFamily: FONT }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={timeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M9 2h6" /></svg>
            <span style={{ fontVariantNumeric: "tabular-nums", fontSize: "0.8rem", color: timeColor, fontWeight: timedMode ? 700 : 400 }}>
              {timedMode ? (remaining === 0 ? "Time's up" : formatTime(remaining)) : formatTime(elapsedTime)}
            </span>
          </button>
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
          <div className="hp-interview-video-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "10px 10px 6px", overflow: "hidden" }}>

            {/* Interviewer tile */}
            <div style={{ borderRadius: "12px", overflow: "hidden", background: "#1c1c1c", position: "relative", border: `2px solid ${isSpeaking ? "#a78bfa" : "rgba(255,255,255,0.04)"}`, transition: "border-color 0.25s", boxShadow: isSpeaking ? "0 0 0 4px rgba(167,139,250,0.12)" : "none" }}>
              {isSpeaking && (
                <motion.div
                  aria-hidden
                  animate={{ opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "12px", boxShadow: "0 0 24px 4px rgba(167,139,250,0.35) inset", pointerEvents: "none", zIndex: 1 }}
                />
              )}
              {interviewerJoined ? (
                <motion.div
                  initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                  style={{ width: "100%", height: "100%", background: "linear-gradient(165deg, #2e2e44 0%, #232338 45%, #1a1a28 100%)", display: "grid", placeItems: "center" }}
                >
                  <img
                    className="hp-interviewer-video"
                    src={interviewer.image} alt={interviewer.name}
                    style={{ width: "auto", height: "78%", maxWidth: "85%", objectFit: "contain", display: "block", filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))" }}
                  />
                </motion.div>
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.9rem" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "9999px", background: "rgba(255,255,255,0.07)", display: "grid", placeItems: "center", fontSize: "1.6rem", fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
                    {interviewer.name.charAt(0)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", animation: "hp-connect-pulse 1.6s ease-in-out infinite" }}>
                    {interviewer.name} is connecting...
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isSpeaking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "3px", alignItems: "center", background: "rgba(0,0,0,0.6)", borderRadius: "20px", padding: "6px 12px" }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div key={i} animate={{ height: ["3px", "14px", "3px"] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.09 }}
                        style={{ width: "3px", background: "#a78bfa", borderRadius: "2px" }} />
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
                <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{interviewer.name}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{FIRM_SHORT[firm] ?? firmConfig.name}</div>
              </div>

              <button onClick={() => {
                stopSpeaking();
                isSpeakingRef.current = false;
                setIsSpeaking(false);
                if (!isMuted && !loadingRef.current) startListening();
              }}
                style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "3px 8px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: FONT }}>
                Stop talking
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

              {/* Live caption - shows what's being heard right now, even if the chat panel is closed */}
              <AnimatePresence>
                {isListening && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
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
            <button className="hp-interview-ctrl-btn" aria-label={isMuted ? "Unmute microphone" : "Mute microphone"} aria-pressed={isMuted} onClick={toggleMute} style={ctrlBtn(isMuted)}>
              <MicIcon muted={isMuted} />
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
            <button className="hp-interview-ctrl-btn" aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"} aria-pressed={isVideoOff} onClick={toggleVideo} style={ctrlBtn(isVideoOff)}>
              <CameraIcon off={isVideoOff} />
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>{isVideoOff ? "Start cam" : "Stop cam"}</span>
            </button>
            <button className="hp-interview-ctrl-btn" aria-label="Show a hint" onClick={() => { setHintsUsed(h => h + 1); setShowHint(true); }} style={ctrlBtn(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Hint{hintsUsed > 0 ? ` (${hintsUsed})` : ""}</span>
            </button>
            <button className="hp-interview-ctrl-btn" aria-label="Show the case brief" aria-pressed={showCaseOverlay} onClick={() => setShowCaseOverlay(v => !v)} style={ctrlBtn(showCaseOverlay)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Case</span>
            </button>
            <button className="hp-interview-ctrl-btn" aria-label="Show the transcript panel" aria-pressed={showChat} onClick={() => setShowChat(v => !v)} style={ctrlBtn(showChat)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="hp-interview-ctrl-btn-label" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Chat</span>
            </button>
            <div style={{ flex: 1 }} />
            <button aria-label="End the interview" onClick={() => setShowEndConfirm(true)} style={ctrlBtn(false, true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)"/></svg>
              <span style={{ fontSize: "0.6rem", fontWeight: 600 }}>End</span>
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div className="hp-interview-chat-panel" initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden", background: "#161616", flexShrink: 0 }}>
              <div style={{ padding: "0.65rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                Transcript
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {transcript.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {msg.role === "user" ? (session?.user?.name ?? "You") : interviewer.name}
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
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.68rem", color: isListening ? "#a78bfa" : "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isListening ? "#a78bfa" : isMuted ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                  {isMuted ? "Muted - unmute to talk" : isListening ? "Listening..." : "Type below, or just talk - jump in anytime"}
                </div>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => { if (isListening) stopListening(); }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder={isListening ? "Listening..." : "Type your response..."}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${isListening ? "rgba(124,92,252,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", padding: "0.5rem 0.7rem", color: "#fff", fontSize: "0.8rem", fontFamily: FONT, resize: "none", minHeight: "48px", maxHeight: "88px", outline: "none", lineHeight: 1.55, boxSizing: "border-box" }}
                  rows={2}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  style={{ height: "32px", borderRadius: "7px", border: "none", background: loading || !input.trim() ? "rgba(255,255,255,0.06)" : "#fff", color: loading || !input.trim() ? "rgba(255,255,255,0.18)" : "#111", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "0.75rem", fontFamily: FONT, fontWeight: 700 }}
                >
                  Submit
                </button>
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
