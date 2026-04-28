import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

const TOPICS = [
  { label: "80s Pop Culture", emoji: "📼" },
  { label: "Sports", emoji: "🏆" },
  { label: "Science & Nature", emoji: "🔬" },
  { label: "History", emoji: "📜" },
  { label: "Movies", emoji: "🎬" },
  { label: "Music", emoji: "🎸" },
  { label: "Food & Drink", emoji: "🍺" },
  { label: "Geography", emoji: "🌍" },
  { label: "Video Games", emoji: "🎮" },
  { label: "Animals", emoji: "🦁" },
];

const DIFFICULTIES = [
  { label: "Easy", color: "#4ade80", bg: "rgba(74,222,128,0.12)", emoji: "😎" },
  { label: "Medium", color: "#facc15", bg: "rgba(250,204,21,0.12)", emoji: "🤔" },
  { label: "Hard", color: "#fb923c", bg: "rgba(251,146,60,0.12)", emoji: "😰" },
  { label: "Brutal", color: "#f87171", bg: "rgba(248,113,113,0.12)", emoji: "💀" },
];

const CORRECT_MSGS = ["NAILED IT! 🎯", "GENIUS! 🧠", "CORRECT! ⚡", "OH YEAH! 🔥", "BOOM! 💥", "LEGEND! 👑"];
const WRONG_MSGS = ["WRONG! 💀", "NOPE! 😬", "OOOF! 😬", "NOT EVEN CLOSE! 🤦", "YIKES! 😱"];

function useSound() {
  const ctx = useRef(null);
  const getCtx = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctx.current;
  };
  const playCorrect = useCallback(() => {
    try {
      const ac = getCtx();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ac.createOscillator(); const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.frequency.value = freq; osc.type = "sine";
        const t = ac.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      });
    } catch {}
  }, []);
  const playWrong = useCallback(() => {
    try {
      const ac = getCtx();
      [220, 180, 150].forEach((freq, i) => {
        const osc = ac.createOscillator(); const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.frequency.value = freq; osc.type = "sawtooth";
        const t = ac.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t); osc.stop(t + 0.25);
      });
    } catch {}
  }, []);
  const playClick = useCallback(() => {
    try {
      const ac = getCtx(); const osc = ac.createOscillator(); const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.frequency.value = 800; osc.type = "sine";
      gain.gain.setValueAtTime(0.1, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.start(); osc.stop(ac.currentTime + 0.08);
    } catch {}
  }, []);
  const playFanfare = useCallback(() => {
    try {
      const ac = getCtx();
      [[523,0],[523,0.1],[523,0.2],[659,0.3],[523,0.5],[659,0.6],[783,0.7]].forEach(([freq, delay]) => {
        const osc = ac.createOscillator(); const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.frequency.value = freq; osc.type = "triangle";
        const t = ac.currentTime + delay;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
      });
    } catch {}
  }, []);
  const playLoser = useCallback(() => {
    try {
      const ac = getCtx();
      [392, 349, 311, 261].forEach((freq, i) => {
        const osc = ac.createOscillator(); const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.frequency.value = freq; osc.type = "sawtooth";
        const t = ac.currentTime + i * 0.2;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      });
    } catch {}
  }, []);
  return { playCorrect, playWrong, playClick, playFanfare, playLoser };
}

function Confetti({ active }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ["#f87171","#facc15","#4ade80","#60a5fa","#e879f9","#fb923c","#34d399"];
    particles.current = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width, y: -20,
      w: Math.random() * 10 + 4, h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 5, vy: Math.random() * 4 + 2,
      rot: Math.random() * 360, vr: (Math.random() - 0.5) * 8, life: 1,
    }));
    const draw = () => {
      c.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.08; p.life -= 0.007;
        c.save(); c.translate(p.x, p.y); c.rotate((p.rot * Math.PI) / 180);
        c.globalAlpha = Math.max(0, p.life); c.fillStyle = p.color;
        c.fillRect(-p.w/2, -p.h/2, p.w, p.h); c.restore();
      });
      particles.current = particles.current.filter((p) => p.life > 0 && p.y < canvas.height + 20);
      if (particles.current.length > 0) animRef.current = requestAnimationFrame(draw);
      else c.clearRect(0, 0, canvas.width, canvas.height);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:500 }} />;
}

export default function Trivia() {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashColor, setFlashColor] = useState(null);
  const [verdictMsg, setVerdictMsg] = useState("");
  const [showStreak, setShowStreak] = useState(false);
  const sound = useSound();
  const activeTopic = customTopic.trim() || topic;
  const diffConfig = DIFFICULTIES.find((d) => d.label === difficulty) || DIFFICULTIES[1];

  const generate = async () => {
    if (!activeTopic) {
      setShake(true); sound.playWrong();
      setTimeout(() => setShake(false), 500); return;
    }
    sound.playClick(); setLoading(true); setError(""); setQuestions([]);
    setCurrent(0); setSelected(null); setRevealed(false);
    setScore(0); setDone(false); setStreak(0); setMaxStreak(0);
    try {
      const res = await fetch("/api/trivia", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeTopic, difficulty }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const pick = (letter) => {
    if (revealed) return;
    setSelected(letter); setRevealed(true);
    const isCorrect = letter === questions[current].answer;
    if (isCorrect) {
      const ns = streak + 1; setStreak(ns); setMaxStreak((m) => Math.max(m, ns));
      setScore((s) => s + 1);
      setVerdictMsg(CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)]);
      setFlashColor("green"); sound.playCorrect();
      if (ns >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500); }
    } else {
      setStreak(0);
      setVerdictMsg(WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)]);
      setFlashColor("red"); sound.playWrong();
    }
    setTimeout(() => setFlashColor(null), 400);
  };

  const next = () => {
    sound.playClick();
    if (current + 1 >= questions.length) {
      const p = Math.round((score / questions.length) * 100);
      if (p >= 80) { sound.playFanfare(); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500); }
      else if (p < 40) sound.playLoser();
      setDone(true);
    } else { setCurrent((c) => c + 1); setSelected(null); setRevealed(false); }
  };

  const restart = () => {
    sound.playClick(); setQuestions([]); setTopic(""); setCustomTopic("");
    setCurrent(0); setSelected(null); setRevealed(false);
    setScore(0); setDone(false); setStreak(0); setMaxStreak(0);
  };

  const q = questions[current];
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const getRating = (p) => {
    if (p === 100) return { label: "PERFECT SCORE! 🏆", sub: "Absolute pub legend. Buy yourself a drink.", color: "#facc15" };
    if (p >= 80) return { label: "PUB CHAMPION! 🥇", sub: "Your team needs you on speed dial.", color: "#4ade80" };
    if (p >= 60) return { label: "NOT BAD! 👍", sub: "You've clearly been around the block.", color: "#60a5fa" };
    if (p >= 40) return { label: "AVERAGE JOE 🤷", sub: "Stick to buying drinks.", color: "#fb923c" };
    return { label: "ABSOLUTE DISASTER 💀", sub: "Did you even try?", color: "#f87171" };
  };
  const rating = getRating(pct);

  return (
    <>
      <Head>
        <title>BAR TRIVIA 🍺</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Confetti active={showConfetti} />
      <div className={`root${flashColor === "green" ? " flash-green" : ""}${flashColor === "red" ? " flash-red" : ""}`}>
        <div className="noise" />
        {showStreak && <div className="streak-popup">🔥 {streak}x STREAK!</div>}

        {questions.length === 0 && !loading && (
          <div className="screen">
            <div className="marquee-wrap">
              <div className="marquee">🍺 BAR TRIVIA &nbsp;★&nbsp; 🎯 TEST YOUR KNOWLEDGE &nbsp;★&nbsp; 🏆 WIN BRAGGING RIGHTS &nbsp;★&nbsp; 🍺 BAR TRIVIA &nbsp;★&nbsp; 🎯 TEST YOUR KNOWLEDGE &nbsp;★&nbsp;</div>
            </div>
            <h1 className="title">
              <span className="title-bar">BAR</span>
              <span className="title-trivia">TRIVIA</span>
            </h1>
            <p className="subtitle">⚡ AI-powered pub quiz · No cheating · Infinite topics</p>
            {error && <div className="error-box">⚠️ {error}</div>}
            <div className={`section${shake ? " shake" : ""}`}>
              <label className="section-label">🎯 PICK A TOPIC</label>
              <div className="topic-grid">
                {TOPICS.map((t) => (
                  <button key={t.label} className={`topic-btn${topic === t.label && !customTopic ? " active" : ""}`}
                    onClick={() => { setTopic(t.label); setCustomTopic(""); sound.playClick(); }}>
                    <span className="topic-emoji">{t.emoji}</span><span>{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="custom-wrap">
                <span className="custom-label">OR TYPE YOUR OWN TOPIC:</span>
                <input className="custom-input" placeholder="e.g. The Beatles, World War II, NBA, Taylor Swift..."
                  value={customTopic} onChange={(e) => { setCustomTopic(e.target.value); setTopic(""); }} />
              </div>
            </div>
            <div className="section">
              <label className="section-label">💀 DIFFICULTY</label>
              <div className="diff-row">
                {DIFFICULTIES.map((d) => (
                  <button key={d.label} className={`diff-btn${difficulty === d.label ? " active" : ""}`}
                    style={difficulty === d.label ? { borderColor: d.color, color: d.color, background: d.bg } : {}}
                    onClick={() => { setDifficulty(d.label); sound.playClick(); }}>
                    <span>{d.emoji}</span><span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="start-btn" onClick={generate}>
              <span>🎮 START GAME</span><span className="btn-arrow">→</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="screen center-screen">
            <div className="loading-beer">🍺</div>
            <p className="loading-text">Pouring your questions...</p>
            <p className="loading-sub"><strong>{activeTopic}</strong> · {difficulty}</p>
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}

        {questions.length > 0 && !done && q && (
          <div className="screen">
            <div className="q-header">
              <div className="q-badges">
                <span className="badge badge-topic">{activeTopic}</span>
                <span className="badge" style={{ color: diffConfig.color, borderColor: diffConfig.color, background: diffConfig.bg }}>
                  {diffConfig.emoji} {difficulty}
                </span>
                {streak >= 2 && <span className="badge badge-streak">🔥 {streak}x</span>}
              </div>
              <div className="score-display">
                <span className="score-num">{score}</span>
                <span className="score-sep">/</span>
                <span className="score-total">{questions.length}</span>
              </div>
            </div>
            <div className="progress-track">
              {questions.map((_, i) => (
                <div key={i} className={`progress-seg${i < current ? " done" : i === current ? " active" : ""}`} />
              ))}
            </div>
            <div className="question-box">
              <div className="q-counter">Q{current + 1} OF {questions.length}</div>
              <p className="question-text">{q.q}</p>
            </div>
            <div className="options">
              {q.options.map((opt) => {
                const letter = opt[0];
                const isCorrect = letter === q.answer;
                const isSelected = letter === selected;
                let cls = "option-btn";
                if (revealed) {
                  if (isCorrect) cls += " correct";
                  else if (isSelected) cls += " wrong";
                  else cls += " dim";
                }
                return (
                  <button key={letter} className={cls} onClick={() => pick(letter)}>
                    <span className="opt-letter">{letter}</span>
                    <span className="opt-text">{opt.slice(3)}</span>
                    {revealed && isCorrect && <span className="opt-icon">✓</span>}
                    {revealed && isSelected && !isCorrect && <span className="opt-icon">✗</span>}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <div className={`reveal-box${selected === q.answer ? " reveal-correct" : " reveal-wrong"}`}>
                <div className="reveal-verdict">{verdictMsg}</div>
                <p className="reveal-fact">💡 {q.fact}</p>
                <button className="next-btn" onClick={next}>
                  {current + 1 >= questions.length ? "🏁 SEE RESULTS" : "NEXT →"}
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className="screen center-screen results-screen">
            <div className="result-trophy">{pct === 100 ? "🏆" : pct >= 80 ? "🥇" : pct >= 60 ? "🥈" : pct >= 40 ? "🥉" : "💀"}</div>
            <div className="result-score" style={{ color: rating.color }}>
              {score}<span className="result-total">/{questions.length}</span>
            </div>
            <div className="result-pct" style={{ color: rating.color }}>{pct}%</div>
            <div className="result-label" style={{ color: rating.color }}>{rating.label}</div>
            <div className="result-sub">{rating.sub}</div>
            {maxStreak >= 3 && <div className="streak-badge">🔥 Best streak: {maxStreak} in a row!</div>}
            <div className="result-stats">
              <div className="stat"><span className="stat-val">{score}</span><span className="stat-lbl">CORRECT</span></div>
              <div className="stat"><span className="stat-val">{questions.length - score}</span><span className="stat-lbl">WRONG</span></div>
              <div className="stat"><span className="stat-val">{maxStreak}</span><span className="stat-lbl">BEST STREAK</span></div>
            </div>
            <div className="result-actions">
              <button className="start-btn" onClick={generate}>🔄 SAME TOPIC AGAIN</button>
              <button className="outline-btn" onClick={restart}>🎯 NEW TOPIC</button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#0a0a0f;--surface:#12121a;--surface2:#1a1a28;--border:#2a2a3f;
          --green:#4ade80;--gold:#facc15;--red:#f87171;--blue:#60a5fa;
          --purple:#e879f9;--orange:#fb923c;--text:#f0eeff;--text-dim:#6b7280;
          --font-display:'Oswald',sans-serif;--font-mono:'Courier Prime',monospace;
        }
        html,body{background:var(--bg);color:var(--text);font-family:var(--font-mono);min-height:100dvh;overflow-x:hidden}
        .root{min-height:100dvh;max-width:680px;margin:0 auto;padding:0 16px 60px;position:relative}
        .root.flash-green{animation:flashGreen 0.4s ease}
        .root.flash-red{animation:flashRed 0.4s ease}
        @keyframes flashGreen{0%{background:var(--bg)}30%{background:rgba(74,222,128,0.12)}100%{background:var(--bg)}}
        @keyframes flashRed{0%{background:var(--bg)}30%{background:rgba(248,113,113,0.12)}100%{background:var(--bg)}}
        .noise{pointer-events:none;position:fixed;inset:0;opacity:0.03;z-index:999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .streak-popup{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:600;
          font-family:var(--font-display);font-size:clamp(36px,10vw,64px);font-weight:700;
          color:var(--gold);text-shadow:0 0 40px rgba(250,204,21,0.8);
          animation:streakPop 1.5s ease forwards;pointer-events:none;white-space:nowrap}
        @keyframes streakPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}40%{transform:translate(-50%,-50%) scale(1)}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-60%)}}
        .screen{padding:20px 0}
        .marquee-wrap{overflow:hidden;border-top:2px solid #2a1a5a;border-bottom:2px solid #2a1a5a;padding:8px 0;margin-bottom:28px;background:linear-gradient(90deg,#0f0a2a,#1a0a3a,#0f0a2a)}
        .marquee{white-space:nowrap;animation:marquee 16s linear infinite;font-family:var(--font-display);font-size:13px;letter-spacing:3px;color:var(--purple);text-shadow:0 0 10px rgba(232,121,249,0.5)}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .title{display:flex;flex-direction:column;line-height:0.85;margin-bottom:10px}
        .title-bar{font-family:var(--font-display);font-size:clamp(80px,24vw,130px);font-weight:700;letter-spacing:-2px;
          background:linear-gradient(135deg,#e879f9,#60a5fa,#4ade80);-webkit-background-clip:text;
          -webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 30px rgba(232,121,249,0.4))}
        .title-trivia{font-family:var(--font-display);font-size:clamp(32px,10vw,56px);font-weight:400;color:var(--gold);letter-spacing:10px;text-shadow:0 0 20px rgba(250,204,21,0.4)}
        .subtitle{font-size:12px;color:var(--text-dim);letter-spacing:1px;margin-bottom:32px}
        .error-box{background:rgba(248,113,113,0.1);border:1px solid var(--red);color:var(--red);padding:12px 16px;font-size:13px;margin-bottom:20px;border-radius:6px}
        .section{margin-bottom:24px}
        .section-label{display:block;font-family:var(--font-display);font-size:13px;letter-spacing:4px;color:var(--text-dim);margin-bottom:12px}
        .topic-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:14px}
        .topic-btn{padding:10px 12px;background:var(--surface);border:1px solid var(--border);color:var(--text-dim);
          font-family:var(--font-mono);font-size:13px;cursor:pointer;text-align:left;
          display:flex;align-items:center;gap:8px;transition:all 0.15s;border-radius:4px}
        .topic-emoji{font-size:22px}
        .topic-btn:hover{border-color:var(--purple);color:var(--text);background:rgba(232,121,249,0.05)}
        .topic-btn.active{border-color:var(--purple);color:var(--purple);background:rgba(232,121,249,0.1);box-shadow:0 0 12px rgba(232,121,249,0.15)}
        .custom-wrap{display:flex;flex-direction:column;gap:6px}
        .custom-label{font-size:10px;letter-spacing:2px;color:var(--text-dim)}
        .custom-input{background:var(--surface);border:1px solid var(--border);color:var(--text);
          font-family:var(--font-mono);font-size:14px;padding:12px 14px;outline:none;width:100%;
          border-radius:4px;transition:border-color 0.2s,box-shadow 0.2s}
        .custom-input:focus{border-color:var(--purple);box-shadow:0 0 12px rgba(232,121,249,0.15)}
        .custom-input::placeholder{color:var(--text-dim)}
        .diff-row{display:flex;gap:8px;flex-wrap:wrap}
        .diff-btn{flex:1;min-width:70px;padding:10px 6px;background:var(--surface);border:1px solid var(--border);
          color:var(--text-dim);font-family:var(--font-display);font-size:13px;letter-spacing:1px;
          cursor:pointer;transition:all 0.15s;border-radius:4px;display:flex;flex-direction:column;align-items:center;gap:4px}
        .diff-btn:hover{color:var(--text)}
        .start-btn{width:100%;padding:20px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;
          color:white;font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:4px;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;
          transition:all 0.15s;border-radius:6px;box-shadow:0 0 30px rgba(124,58,237,0.4)}
        .start-btn:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(124,58,237,0.6)}
        .start-btn:active{transform:translateY(0)}
        .btn-arrow{font-size:18px}
        .outline-btn{width:100%;padding:16px;background:transparent;border:1px solid var(--border);
          color:var(--text-dim);font-family:var(--font-display);font-size:16px;letter-spacing:3px;
          cursor:pointer;margin-top:10px;border-radius:6px;transition:all 0.15s}
        .outline-btn:hover{border-color:#555;color:var(--text)}
        .center-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80dvh;gap:16px;text-align:center}
        .loading-beer{font-size:64px;animation:bounce 0.6s ease infinite alternate}
        @keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-16px)}}
        .loading-text{font-family:var(--font-display);font-size:24px;letter-spacing:3px;color:var(--purple)}
        .loading-sub{font-size:13px;color:var(--text-dim)}
        .loading-dots{display:flex;gap:8px}
        .loading-dots span{width:8px;height:8px;background:var(--purple);border-radius:50%;animation:dot 1.2s ease infinite}
        .loading-dots span:nth-child(2){animation-delay:0.2s}
        .loading-dots span:nth-child(3){animation-delay:0.4s}
        @keyframes dot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        .q-header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 0;border-bottom:1px solid var(--border);margin-bottom:16px;flex-wrap:wrap}
        .q-badges{display:flex;gap:6px;flex-wrap:wrap}
        .badge{font-family:var(--font-display);font-size:11px;letter-spacing:2px;border:1px solid var(--border);padding:3px 10px;border-radius:999px;color:var(--text-dim)}
        .badge-topic{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .badge-streak{color:var(--gold);border-color:var(--gold);background:rgba(250,204,21,0.1);text-shadow:0 0 8px rgba(250,204,21,0.5);animation:pulse 0.8s ease infinite alternate}
        @keyframes pulse{from{box-shadow:none}to{box-shadow:0 0 12px rgba(250,204,21,0.3)}}
        .score-display{font-family:var(--font-display);font-size:28px;font-weight:700;display:flex;align-items:baseline;gap:2px}
        .score-num{color:var(--green);text-shadow:0 0 15px rgba(74,222,128,0.4)}
        .score-sep{color:var(--border);font-size:20px;margin:0 2px}
        .score-total{color:var(--text-dim);font-size:20px}
        .progress-track{display:flex;gap:3px;margin-bottom:20px}
        .progress-seg{flex:1;height:4px;background:var(--border);border-radius:2px;transition:background 0.3s}
        .progress-seg.done{background:var(--green)}
        .progress-seg.active{background:var(--purple);box-shadow:0 0 8px rgba(232,121,249,0.6);animation:activeSeg 1s ease infinite alternate}
        @keyframes activeSeg{from{opacity:0.7}to{opacity:1}}
        .question-box{background:linear-gradient(135deg,var(--surface),var(--surface2));border:1px solid var(--border);
          border-left:4px solid var(--purple);padding:24px 20px;margin-bottom:16px;border-radius:6px;position:relative;overflow:hidden}
        .question-box::before{content:'';position:absolute;top:0;right:0;width:120px;height:120px;
          background:radial-gradient(circle,rgba(232,121,249,0.08),transparent);pointer-events:none}
        .q-counter{font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--purple);margin-bottom:10px}
        .question-text{font-family:var(--font-display);font-size:clamp(18px,4vw,26px);font-weight:500;line-height:1.4;color:var(--text)}
        .options{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
        .option-btn{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--surface);
          border:1px solid var(--border);color:var(--text);font-family:var(--font-mono);font-size:14px;
          cursor:pointer;text-align:left;border-radius:6px;transition:all 0.15s}
        .option-btn:hover:not(.correct):not(.wrong):not(.dim){border-color:var(--purple);background:rgba(232,121,249,0.05);transform:translateX(4px)}
        .opt-letter{font-family:var(--font-display);font-size:26px;font-weight:700;color:var(--purple);min-width:28px}
        .opt-text{flex:1}
        .opt-icon{font-size:18px;font-weight:700}
        .option-btn.correct{border-color:var(--green);background:rgba(74,222,128,0.1);color:var(--green);box-shadow:0 0 20px rgba(74,222,128,0.2);animation:correctPop 0.3s ease}
        @keyframes correctPop{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
        .option-btn.correct .opt-letter{color:var(--green)}
        .option-btn.wrong{border-color:var(--red);background:rgba(248,113,113,0.1);color:var(--red);animation:wrongShake 0.3s ease}
        @keyframes wrongShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        .option-btn.wrong .opt-letter{color:var(--red)}
        .option-btn.dim{opacity:0.25;cursor:default}
        .reveal-box{padding:20px;border:1px solid;border-radius:6px;animation:slideUp 0.3s ease}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .reveal-correct{border-color:var(--green);background:linear-gradient(135deg,rgba(74,222,128,0.08),rgba(74,222,128,0.03))}
        .reveal-wrong{border-color:var(--red);background:linear-gradient(135deg,rgba(248,113,113,0.08),rgba(248,113,113,0.03))}
        .reveal-verdict{font-family:var(--font-display);font-size:24px;letter-spacing:2px;margin-bottom:8px;font-weight:700}
        .reveal-correct .reveal-verdict{color:var(--green);text-shadow:0 0 15px rgba(74,222,128,0.4)}
        .reveal-wrong .reveal-verdict{color:var(--red);text-shadow:0 0 15px rgba(248,113,113,0.4)}
        .reveal-fact{font-size:13px;color:var(--text-dim);margin-bottom:16px;line-height:1.6}
        .next-btn{background:linear-gradient(135deg,#4f46e5,#7c3aed);border:none;color:white;
          font-family:var(--font-display);font-size:15px;letter-spacing:3px;padding:12px 24px;
          cursor:pointer;border-radius:4px;transition:all 0.15s;box-shadow:0 0 15px rgba(124,58,237,0.3)}
        .next-btn:hover{transform:translateY(-1px);box-shadow:0 0 25px rgba(124,58,237,0.5)}
        .results-screen{gap:10px;padding-top:40px}
        .result-trophy{font-size:80px;animation:trophyBounce 0.5s ease}
        @keyframes trophyBounce{0%{transform:scale(0);opacity:0}70%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
        .result-score{font-family:var(--font-display);font-size:clamp(72px,22vw,120px);font-weight:700;line-height:1;text-shadow:0 0 40px currentColor}
        .result-total{font-size:0.4em;color:var(--text-dim)}
        .result-pct{font-family:var(--font-display);font-size:32px;letter-spacing:4px;text-shadow:0 0 15px currentColor}
        .result-label{font-family:var(--font-display);font-size:clamp(22px,5vw,34px);letter-spacing:3px;text-align:center;text-shadow:0 0 15px currentColor}
        .result-sub{font-size:14px;color:var(--text-dim);text-align:center;font-style:italic}
        .streak-badge{font-family:var(--font-display);font-size:16px;letter-spacing:2px;color:var(--gold);
          border:1px solid rgba(250,204,21,0.3);padding:8px 20px;border-radius:999px;background:rgba(250,204,21,0.08)}
        .result-stats{display:flex;gap:20px;border:1px solid var(--border);border-radius:6px;
          padding:16px 24px;background:var(--surface);width:100%;justify-content:center}
        .stat{display:flex;flex-direction:column;align-items:center;gap:4px}
        .stat-val{font-family:var(--font-display);font-size:32px;font-weight:700;color:var(--text)}
        .stat-lbl{font-size:10px;letter-spacing:2px;color:var(--text-dim)}
        .result-actions{width:100%;display:flex;flex-direction:column;gap:0;margin-top:8px}
        .shake{animation:shake 0.4s ease}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
      `}</style>
    </>
  );
}
