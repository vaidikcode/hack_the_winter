import { useEffect, useRef, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import PromptInput from "../components/PromptInput";
import React from "react";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const wsRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
    } catch {}
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const [running, setRunning] = useState(false);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket("ws://localhost:8000/ws_stream_campaign");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    } catch (e) {
      console.error("WebSocket connection failed:", e);
    }
  };

  // Send prompt to backend and navigate to report page
  const sendPrompt = (text) => {
    const promptText = text?.trim();
    if (!promptText) return;

    const ws = wsRef.current;

    if (!ws || ws.readyState === WebSocket.CLOSED) {
      connectWebSocket();
      setTimeout(() => sendPrompt(text), 1000);
      return;
    } else if (ws.readyState !== WebSocket.OPEN) {
      alert("Connecting to server. Please wait a moment and try again.");
      return;
    }

    setRunning(true);

    ws.send(JSON.stringify({ initial_prompt: promptText }));
    console.log("Prompt sent to backend:", promptText);

    setTimeout(() => {
      navigate("/report", { state: { prompt: promptText, autoStart: true } });
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-slate-950">
      <AnimatedBackground theme={theme} />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Back button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate("/")}
            title="Back to Home"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:opacity-95 transition-smooth border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
           
          </button>
        </div>

        {/* Theme toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            title="Toggle theme"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:opacity-95 transition-smooth border border-slate-200 dark:border-slate-700"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
            <span className="hidden sm:inline text-sm text-slate-800 dark:text-slate-200">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white">
            Let's Build Your{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Startup
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            Describe your startup idea and let AI handle the rest. From planning
            to launch in minutes.
          </p>
        </div>

        {/* Prompt Input */}
        <PromptInput onSubmit={sendPrompt} isRunning={running} />

        {/* Keyboard Hint */}
        <div className="mt-8 text-sm text-slate-600 dark:text-slate-500">
          Press{" "}
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
            Enter
          </kbd>{" "}
          to submit
        </div>
      </div>
    </div>
  );
};

export default Index;
