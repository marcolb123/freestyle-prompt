import { useState } from "react";
import "./App.css";

// ═══════════════════════════════════════════════════════════
// 📚 DATA SECTION: All dance prompts with tips and video links
// ═══════════════════════════════════════════════════════════
const PROMPTS = [
    {
        label: "Bounce",                    // ← Prompt name
        tips: [                             // ← Practice tips
            "Keep knees soft; think elastic ankles.",
            "Let head/shoulders ride the bounce.",
            "Lock to the downbeat for 8 counts.",
        ],
        links: [                            // ← YouTube tutorial links
            {
                title: "Bounce groove basics",
                url: "https://youtu.be/pm7p_0jVXmw",
            },
        ],
    },
    {
		label: "Waves",
		tips: [
			"Wrist → elbow → shoulder → chest.",
			"Lead with fingertips; imagine water.",
			"Practice both directions with breath.",
		],
		links: [
			{
				title: "Arm waves tutorial",
				url: "https://youtu.be/8dM1nH3O4Uc",
			},
		],
	},
	{
		label: "Groove",
		tips: [
			"Pick one base groove and keep it.",
			"Layer arms/footwork without losing base.",
			"Close eyes for 4 counts to feel timing.",
		],
		links: [
			{
				title: "Find your groove",
				url: "https://youtu.be/2i2kz8uR2aE",
			},
		],
	},
	{
		label: "Isolations",
		tips: [
			"Move one body part while keeping others still.",
			"Start with head, chest, or hips.",
			"Use mirror to check clean movement.",
		],
		links: [
			{
				title: "Body isolation basics",
				url: "https://www.youtube.com/watch?v=Xgsk7yvSiPg",
			},
		],
	},
	{
		label: "Levels",
		tips: [
			"Explore high, mid, and low positions.",
			"Transition smoothly between levels.",
			"Challenge: spend 16 counts at each level.",
		],
		links: [
			{
				title: "Level changes tutorial",
				url: "https://youtu.be/example2",
			},
		],
	},
	{
		label: "Textures",
		tips: [
			"Mix sharp hits with smooth flows.",
			"Contrast robotic and liquid movements.",
			"Match texture to music dynamics.",
		],
		links: [
			{
				title: "Movement quality guide",
				url: "https://youtu.be/example3",
			},
		],
	},
	{
		label: "Footwork",
		tips: [
			"Start simple: step-touch, kick-step.",
			"Keep weight on balls of feet.",
			"Add rhythm variations to basic steps.",
		],
		links: [
			{
				title: "Footwork fundamentals",
				url: "https://youtu.be/example4",
			},
		],
	},
	{
		label: "Musicality",
		tips: [
			"Hit accents and breaks in the music.",
			"Dance to different instruments/layers.",
			"Pause when the music pauses.",
		],
		links: [
			{
				title: "Music interpretation",
				url: "https://youtu.be/example5",
			},
		],
	},
	{
		label: "Floor Work",
		tips: [
			"Practice getting down and up smoothly.",
			"Use hands for support and transitions.",
			"Explore spins and rolls on the ground.",
		],
		links: [
			{
				title: "Floor work basics",
				url: "https://youtu.be/example6",
			},
		],
	},
	{
		label: "Freestyle",
		tips: [
			"Don't overthink, just move.",
			"Trust your body's instincts.",
			"Embrace mistakes as new moves.",
		],
		links: [
			{
				title: "Freestyle confidence",
				url: "https://youtu.be/example7",
			},
		],
	},
];

// ═══════════════════════════════════════════════════════════
// 🎴 PROMPT CARD COMPONENT: Main interactive card
// ═══════════════════════════════════════════════════════════
function PromptCard() {
    // ─────────────────────────────────────────────────────────
    // 🔄 STATE VARIABLES: Track what's happening in the app
    // ─────────────────────────────────────────────────────────
    const [index, setIndex] = useState(0);                    // Which prompt is showing (0-9)
    const [showTips, setShowTips] = useState(false);          // Are tips visible? (true/false)
    const [showResources, setShowResources] = useState(false); // Are videos visible? (true/false)
    const [aiResponse, setAiResponse] = useState("");         // AI advice text
    const [isLoadingAI, setIsLoadingAI] = useState(false);    // Is AI thinking? (true/false)

    const current = PROMPTS[index];  // ← Get the current prompt object

    // ─────────────────────────────────────────────────────────
    // 💾 SESSION LOG: Remember recent prompts (saved in browser)
    // ─────────────────────────────────────────────────────────
    const [sessionLog, setSessionLog] = useState(() => {
        const saved = localStorage.getItem("sessionLog");     // Check browser storage
        return saved ? JSON.parse(saved) : [];                // Load saved data or empty array
    });

    // ─────────────────────────────────────────────────────────
    // 🎥 YOUTUBE HELPER: Extract video ID from URL
    // ─────────────────────────────────────────────────────────
    function getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }

    // ─────────────────────────────────────────────────────────
    // 🎲 SPIN PROMPT: Get a random prompt
    // ─────────────────────────────────────────────────────────
    function spinPrompt() {
        setShowTips(false);                                  // Hide tips
        setShowResources(false);                             // Hide videos
        setAiResponse("");                                   // Clear old response
        const next = Math.floor(Math.random() * PROMPTS.length); // Random number 0-9
        setIndex(next);                                      // Change to new prompt
        
        // Save to history
        const newEntry = {
            label: PROMPTS[next].label,
            time: new Date().toLocaleTimeString(),           // Current time
        };
        setSessionLog((prev) => {
            const updated = [newEntry, ...prev].slice(0, 5); // Keep only last 5
            localStorage.setItem("sessionLog", JSON.stringify(updated)); // Save to browser
            return updated;
        });
    }

    // ─────────────────────────────────────────────────────────
    // 🤖 AI ADVICE: Ask ChatGPT/Claude for dance advice
    // ─────────────────────────────────────────────────────────
    async function getAIAdvice() {
        setIsLoadingAI(true);                                // Show "Loading..."
        setAiResponse("");                                   // Clear old response

        try {
            // Call your backend server
            const response = await fetch("http://localhost:3001/api/dance-advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: current.label }), // Send prompt name
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAiResponse(data.advice);                      // Show AI's answer
        } catch (error) {
            setAiResponse(`Error: ${error.message}. Make sure the backend server is running.`);
            console.error('Frontend Error:', error);
        } finally {
            setIsLoadingAI(false);                           // Hide "Loading..."
        }
    }

    // ─────────────────────────────────────────────────────────
    // 🎨 RENDER: What shows on screen
    // ─────────────────────────────────────────────────────────
    return (
        <div className="prompt-card">
            {/* ─────── HEADER ─────── */}
            <div className="card-header">
                <h2 className="prompt-title">{current.label}</h2>
                <p className="prompt-subtitle">💃 Dance Prompt #{index + 1}</p>
            </div>

            {/* ─────── BUTTONS ─────── */}
            <div className="button-group">
                <button className="btn btn-spin" onClick={spinPrompt}>
                    🎲 Spin Prompt
                </button>
                <button
                    className={`btn btn-toggle ${showTips ? "active" : ""}`}
                    onClick={() => setShowTips((s) => !s)}
                >
                    💡 Tips
                </button>
                <button
                    className={`btn btn-toggle ${showResources ? "active" : ""}`}
                    onClick={() => setShowResources((s) => !s)}
                >
                    📺 Resources
                </button>
                <button
                    className="btn btn-ai"
                    onClick={getAIAdvice}
                    disabled={isLoadingAI}
                >
                    {isLoadingAI ? "⏳ Loading..." : "🤖 Ask AI"}
                </button>
            </div>

            {/* ─────── AI ADVICE BOX ─────── */}
            {aiResponse && (
                <div className="content-box ai-box">
                    <h4>🤖 AI Advice</h4>
                    <p>{aiResponse}</p>
                </div>
            )}

            {/* ─────── TIPS LIST ─────── */}
            {showTips && (
                <div className="content-box tips-box">
                    <h4>💡 Practice Tips</h4>
                    <ul>
                        {current.tips.map((t, i) => (
                            <li key={i}>{t}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ─────── VIDEO EMBEDS ─────── */}
            {showResources && (
                <div className="content-box resources-box">
                    <h4>📺 Video Resources</h4>
                    {current.links.map((l, i) => {
                        const videoId = getYouTubeId(l.url);
                        return (
                            <div key={i} className="video-container">
                                <h5>{l.title}</h5>
                                {videoId ? (
                                    <iframe
                                        width="100%"
                                        height="315"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={l.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <a
                                        href={l.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="video-link"
                                    >
                                        Watch video →
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ─────── SESSION HISTORY ─────── */}
            <div className="session-log">
                <h3>📜 Recent Prompts</h3>
                {sessionLog.length === 0 ? (
                    <p className="empty-log">No spins yet. Hit that button! 🎲</p>
                ) : (
                    <ul className="log-list">
                        {sessionLog.map((item, i) => (
                            <li key={i} className="log-item">
                                <span className="log-item-label">{item.label}</span>
                                <span className="log-item-time">{item.time}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {sessionLog.length > 0 && (
                    <button
                        className="btn btn-clear"
                        onClick={() => {
                            localStorage.removeItem("sessionLog");
                            setSessionLog([]);
                        }}
                    >
                        🗑️ Clear History
                    </button>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 📱 MAIN APP: Wraps everything with title
// ═══════════════════════════════════════════════════════════
export default function App() {
    return (
        <div className="app-container">
            <h1 className="app-title">💃 Freestyle Prompt App 🕺</h1>
            <PromptCard />
        </div>
    );
}
