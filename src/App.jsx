import { useState, useEffect, useRef } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────
const getScoreColor = (score) => {
  if (score >= 75) return "#39ff14";
  if (score >= 50) return "#ffcc00";
  return "#ff3131";
};

const getVerdictConfig = (verdict) => {
  if (verdict === "LIKELY_ELIGIBLE") return { color: "#39ff14", bg: "rgba(57,255,20,0.05)", border: "rgba(57,255,20,0.25)", label: "LIKELY ELIGIBLE", icon: "✦", tag: "MONETIZABLE" };
  if (verdict === "BORDERLINE") return { color: "#ffcc00", bg: "rgba(255,204,0,0.05)", border: "rgba(255,204,0,0.25)", label: "BORDERLINE", icon: "◈", tag: "NEEDS WORK" };
  return { color: "#ff3131", bg: "rgba(255,49,49,0.05)", border: "rgba(255,49,49,0.25)", label: "NOT ELIGIBLE", icon: "✕", tag: "BLOCKED" };
};

// ── Components ────────────────────────────────────────────────────────────────
const RadialScore = ({ score, size = 100 }) => {
  const r = (size / 2) - 12;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = getScoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${color}44)` }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#111" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px`, fill: color, fontSize: size * 0.24, fontWeight: 900, fontFamily: "'Courier New', monospace", letterSpacing: -1 }}>
        {score}
      </text>
    </svg>
  );
};

const ScoreBar = ({ label, score, notes }) => {
  const color = getScoreColor(score);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ color: "#555", fontSize: 10, fontFamily: "'Courier New', monospace", letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
        <span style={{ color, fontSize: 10, fontWeight: 700, fontFamily: "'Courier New', monospace", background: `${color}11`, padding: "2px 8px", borderRadius: 3, border: `1px solid ${color}33` }}>{score}</span>
      </div>
      <div style={{ height: 3, background: "#111", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${color}77, ${color})`, borderRadius: 2, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {notes && <p style={{ color: "#333", fontSize: 9, margin: "4px 0 0", fontStyle: "italic", fontFamily: "'Courier New', monospace", lineHeight: 1.5 }}>{notes}</p>}
    </div>
  );
};

const GlowDot = ({ color }) => (
  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, marginRight: 6, flexShrink: 0 }} />
);

const Tag = ({ children, color = "#333" }) => (
  <span style={{ fontSize: 9, fontFamily: "'Courier New', monospace", letterSpacing: 2, color, border: `1px solid ${color}44`, padding: "2px 8px", borderRadius: 2, textTransform: "uppercase" }}>{children}</span>
);

// ── Word Document Generator ───────────────────────────────────────────────────
async function generateWordReport(data) {
  const docxModule = await import("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js");
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat } = docxModule;
  const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const RED = "CC0000"; const LIGHT_RED_BG = "FDECEA";
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 }, children: [new TextRun({ text, bold: true, size: 36, color: RED, font: "Arial" })] });
  const body = (text) => new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial", color: "333333" })] });
  const spacer = () => new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] });
  const problems = [];
  if (me?.ytpRequirements) { const r = me.ytpRequirements; if (!r.subscribers?.met) problems.push(`Subscribers too low — ~${r.subscribers?.estimated?.toLocaleString() || "?"} found, need 1,000.`); if (!r.watchHours?.met) problems.push(`Watch hours insufficient — ~${r.watchHours?.estimated?.toLocaleString() || "?"} found, need 4,000.`); if (!r.communityGuidelines?.met) problems.push("Community Guidelines violations detected."); if (!r.adsenseLinked?.met) problems.push("No AdSense account linked."); }
  if (me?.contentAnalysis) { const c = me.contentAnalysis; if (c.originalContent?.score < 60) problems.push(`Low original content (${c.originalContent?.score}/100)`); if (c.adFriendliness?.score < 60) problems.push(`Poor ad-friendliness (${c.adFriendliness?.score}/100)`); if (c.consistencyScore?.score < 50) problems.push(`Inconsistent uploads (${c.consistencyScore?.score}/100)`); if (c.engagementRate?.score < 50) problems.push(`Low engagement (${c.engagementRate?.score}/100)`); if (c.spamRisk?.score > 50) problems.push(`High spam risk (${c.spamRisk?.score}/100)`); }
  if (me?.policyCompliance) { const p = me.policyCompliance; if (p.copyrightStatus === "STRIKES") problems.push("Active copyright strikes."); if (p.communityStrike) problems.push("Community Guidelines strike active."); if (p.ageRestricted) problems.push("Age-restricted content detected."); if (p.duplicationRisk === "HIGH") problems.push("High content duplication risk."); }
  const badVideos = (videos || []).filter(v => !v.monetizable || v.score < 60);
  const isNE = me?.verdict === "NOT_ELIGIBLE";
  const vColor = isNE ? RED : "B8860B"; const vBg = isNE ? LIGHT_RED_BG : "FFFDE7";
  const doc = new Document({
    numbering: { config: [{ reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 720, after: 120 }, children: [new TextRun({ text: "MONETIZE", bold: true, size: 80, color: RED, font: "Arial" }), new TextRun({ text: "CHECK", bold: true, size: 80, color: "222222", font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "YouTube Monetization Eligibility Report", size: 28, color: "888888", font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480 }, children: [new TextRun({ text: `Created by FFDRYT · Generated: ${today}`, size: 20, color: "AAAAAA", font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, shading: { fill: vBg, type: ShadingType.CLEAR }, border: { top: { style: BorderStyle.SINGLE, size: 10, color: vColor }, bottom: { style: BorderStyle.SINGLE, size: 10, color: vColor }, left: { style: BorderStyle.SINGLE, size: 10, color: vColor }, right: { style: BorderStyle.SINGLE, size: 10, color: vColor } }, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: `${isNE ? "❌  NOT ELIGIBLE FOR MONETIZATION" : "⚠️  BORDERLINE — NEEDS IMPROVEMENT"}`, bold: true, size: 34, color: vColor, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: `Overall Score: ${me?.overallScore || 0} / 100`, bold: true, size: 26, color: "555555", font: "Arial" })] }),
      spacer(), h1("1. Channel Overview"),
      new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [3000, 6360], rows: [["Channel Name", channel?.name || "N/A"], ["Handle", channel?.handle || "N/A"], ["Category", channel?.category || "N/A"], ["Subscribers", channel?.subscribers || "N/A"], ["Total Videos", String(channel?.totalVideos || "N/A")], ["Total Views", channel?.totalViews || "N/A"], ["Avg Views/Video", channel?.avgViewsPerVideo || "N/A"], ["Country", channel?.country || "N/A"], ["Joined", channel?.joinedDate || "N/A"]].map(([lbl, val], i) => new TableRow({ children: [new TableCell({ borders: allBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "F5F5F5" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: lbl, bold: true, size: 20, font: "Arial", color: "333333" })] })] }), new TableCell({ borders: allBorders, width: { size: 6360, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "F5F5F5" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: val, size: 20, font: "Arial", color: "444444" })] })] })] })) }),
      spacer(), h1("2. Summary"), new Paragraph({ shading: { fill: "F9F9F9", type: ShadingType.CLEAR }, border: { left: { style: BorderStyle.SINGLE, size: 14, color: RED } }, spacing: { before: 120, after: 120 }, indent: { left: 360 }, children: [new TextRun({ text: summary || "No summary.", size: 22, font: "Arial", color: "444444", italic: true })] }),
      spacer(), h1("3. Problems"),  body(`${problems.length} issue(s) identified:`), spacer(),
      ...problems.flatMap((p, i) => [new Paragraph({ spacing: { before: 100, after: 40 }, children: [new TextRun({ text: `Problem ${i + 1}`, bold: true, size: 24, color: RED, font: "Arial" })] }), new Paragraph({ shading: { fill: LIGHT_RED_BG, type: ShadingType.CLEAR }, border: { left: { style: BorderStyle.SINGLE, size: 16, color: RED } }, spacing: { before: 80, after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: p, size: 22, font: "Arial", color: "333333" })] }), spacer()]),
      h1("4. Action Plan"), spacer(),
      ...(recommendations || []).map(tip => new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: tip, size: 22, font: "Arial", color: "333333" })] })),
      spacer(), spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "EEEEEE" } }, spacing: { before: 240 }, children: [new TextRun({ text: `MonetizeCheck · Created by FFDRYT · ${today} · Not affiliated with YouTube or Google`, size: 16, color: "AAAAAA", font: "Arial" })] })
    ]}]
  });
  return await Packer.toBuffer(doc);
}

async function downloadReport(data, setDownloading) {
  setDownloading(true);
  try {
    const buf = await generateWordReport(data);
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${(data.channel?.name || "channel").replace(/\s+/g, "_")}_report.docx` });
    a.click(); URL.revokeObjectURL(a.href);
  } catch { alert("Failed to generate report."); }
  setDownloading(false);
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const STEPS = ["Connecting to channel...", "Scanning video library...", "Checking policy compliance...", "Calculating monetization score...", "Generating recommendations..."];

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const t = setInterval(() => setLoadingStep(s => (s + 1) % STEPS.length), 1400);
    return () => clearInterval(t);
  }, [loading]);

  const analyze = async () => {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { throw new Error("Invalid server response. Please try again."); }
      if (!res.ok) throw new Error(json.error || "Server error.");
      setData(json); setActiveTab("overview");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const copyResult = () => {
    if (!data) return;
    navigator.clipboard.writeText(`MonetizeCheck — ${data.channel?.name}\nScore: ${data.monetizationEligibility?.overallScore}/100\nVerdict: ${data.monetizationEligibility?.verdict}\n\n${data.summary}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const showDownload = data && ["NOT_ELIGIBLE", "BORDERLINE"].includes(data.monetizationEligibility?.verdict);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#ccc", fontFamily: "'Courier New', monospace", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #080808; } ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }
        input::placeholder { color: #222; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .hov-red:hover { background: #cc0000 !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,49,49,0.25) !important; }
        .hov-border:hover { border-color: #ff3131 !important; background: #0e0808 !important; }
        .hov-dim:hover { color: #fff !important; border-color: #222 !important; }
        .tab-btn:hover { color: #999 !important; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <header style={{ borderBottom: "1px solid #111", padding: "15px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,8,8,0.97)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 32, height: 32, background: "#ff3131", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 900 }}>▶</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 4, color: "#fff" }}>MONETIZE<span style={{ color: "#ff3131" }}>CHECK</span></div>
              <div style={{ fontSize: 8, color: "#222", letterSpacing: 3, marginTop: 1 }}>CREATED BY FFDRYT · FREE AI TOOL</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {["How It Works", "FAQ", "About"].map(l => (
              <span key={l} className="hov-dim" style={{ fontSize: 9, color: "#222", letterSpacing: 2, cursor: "pointer", padding: "5px 10px", border: "1px solid transparent", borderRadius: 3, transition: "all .2s" }}>{l}</span>
            ))}
            <div style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <GlowDot color="#39ff14" />
              <span style={{ fontSize: 8, color: "#333", letterSpacing: 2 }}>ONLINE</span>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px" }}>

          {/* ── HERO ── */}
          {!data && !loading && (
            <div style={{ marginBottom: 28, animation: "slideUp .5s ease" }}>
              <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: 4, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <GlowDot color="#39ff14" />SYSTEM ONLINE · FREE MONETIZATION ANALYZER
              </div>
              <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, letterSpacing: -1, color: "#fff", lineHeight: 1.05, margin: "0 0 10px" }}>
                IS YOUR CHANNEL<br />
                <span style={{ WebkitTextStroke: "1px #ff3131", WebkitTextFillColor: "transparent" }}>READY</span>
                {" "}<span style={{ color: "#fff" }}>TO EARN?</span>
              </h1>
              <p style={{ fontSize: 11, color: "#2a2a2a", letterSpacing: 3, margin: "0 0 28px", textTransform: "uppercase" }}>
                AI-Powered · Instant · 100% Free · No Signup Required
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 8, marginBottom: 28 }}>
                {[
                  { icon: "◉", color: "#39ff14", title: "Monetization Score", desc: "Overall eligibility /100" },
                  { icon: "◈", color: "#ffcc00", title: "YPP Check", desc: "Subs & watch hours" },
                  { icon: "▦", color: "#00cfff", title: "Video Analysis", desc: "Per-video ad scores" },
                  { icon: "◻", color: "#ff3131", title: "Policy Audit", desc: "Copyright & guidelines" },
                  { icon: "▲", color: "#b36eff", title: "Action Plan", desc: "Step-by-step fixes" },
                  { icon: "⬡", color: "#ff8c42", title: "Full Report", desc: "Download .docx" },
                ].map(f => (
                  <div key={f.title} className="hov-border" style={{ background: "#0c0c0c", border: "1px solid #141414", borderRadius: 6, padding: "14px 15px", cursor: "default", transition: "all .2s" }}>
                    <div style={{ fontSize: 17, color: f.color, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: 1, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEARCH BOX ── */}
          <div style={{ background: "#0c0c0c", border: "1px solid #161616", borderRadius: 8, padding: "20px 22px", marginBottom: 18 }}>
            <div style={{ fontSize: 8, color: "#222", letterSpacing: 3, marginBottom: 10 }}>► ENTER YOUTUBE CHANNEL URL OR @HANDLE</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                ref={inputRef}
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyze()}
                placeholder="youtube.com/@channel  or  @handle"
                style={{ flex: 1, minWidth: 200, background: "#060606", border: "1px solid #1a1a1a", borderRadius: 4, padding: "12px 15px", color: "#ccc", fontSize: 13, outline: "none", fontFamily: "'Courier New', monospace", letterSpacing: 0.5 }}
              />
              <button className="hov-red" onClick={analyze} disabled={loading}
                style={{ background: loading ? "#111" : "#ff3131", color: loading ? "#444" : "#fff", border: "none", borderRadius: 4, padding: "12px 24px", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 10, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 2, transition: "all .2s", whiteSpace: "nowrap" }}>
                {loading ? "SCANNING..." : "ANALYZE →"}
              </button>
              {data && (
                <button className="hov-dim" onClick={() => { setData(null); setUrl(""); setError(""); }}
                  style={{ background: "none", border: "1px solid #141414", borderRadius: 4, padding: "12px 16px", color: "#222", fontFamily: "'Courier New', monospace", fontSize: 10, cursor: "pointer", letterSpacing: 1, transition: "all .2s" }}>
                  ✕ RESET
                </button>
              )}
            </div>
            {error && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(255,49,49,0.05)", border: "1px solid rgba(255,49,49,0.15)", borderRadius: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <GlowDot color="#ff3131" />
                <span style={{ fontSize: 11, color: "#ff3131", letterSpacing: 1 }}>{error}</span>
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 9, color: "#161616", letterSpacing: 1 }}>
              Accepts: youtube.com/@handle · youtube.com/c/name · @handle · Channel ID (UCxxxxx)
            </div>
          </div>

          {/* ── LOADING ── */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", animation: "slideUp .4s ease" }}>
              <div style={{ position: "relative", width: 60, height: 60, margin: "0 auto 24px" }}>
                <div style={{ width: 60, height: 60, border: "2px solid #141414", borderTop: "2px solid #ff3131", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ position: "absolute", inset: 8, border: "1px solid #1a1a1a", borderBottom: "1px solid #ff313144", borderRadius: "50%", animation: "spin 1.6s linear infinite reverse" }} />
              </div>
              <div style={{ fontSize: 11, color: "#ff3131", letterSpacing: 3, marginBottom: 10, animation: "pulse 1.4s ease infinite" }}>{STEPS[loadingStep]}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                {STEPS.map((_, i) => <div key={i} style={{ width: 24, height: 2, background: i <= loadingStep ? "#ff3131" : "#1a1a1a", borderRadius: 1, transition: "background .3s" }} />)}
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {data && (() => {
            const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
            const vc = getVerdictConfig(me?.verdict);
            return (
              <div style={{ animation: "slideUp .5s ease" }}>

                {/* Channel Card */}
                <div style={{ background: "#0c0c0c", border: "1px solid #161616", borderRadius: 8, padding: 20, marginBottom: 10, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ width: 54, height: 54, background: "linear-gradient(135deg,#ff3131,#800000)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0, border: "1px solid #ff313122" }}>
                    {channel?.name?.[0]?.toUpperCase() || "Y"}
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: 1, marginBottom: 6 }}>{channel?.name}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                      <Tag color="#ff3131">{channel?.handle}</Tag>
                      <Tag color="#333">{channel?.category}</Tag>
                      <Tag color="#222">{channel?.country}</Tag>
                      <Tag color="#222">Joined {channel?.joinedDate}</Tag>
                    </div>
                    <div style={{ fontSize: 10, color: "#222", letterSpacing: 0.5, lineHeight: 1.6 }}>{channel?.description}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[["SUBS", channel?.subscribers], ["VIDEOS", channel?.totalVideos], ["VIEWS", channel?.totalViews], ["AVG/VID", channel?.avgViewsPerVideo]].map(([l, v]) => (
                      <div key={l} style={{ background: "#080808", border: "1px solid #141414", borderRadius: 4, padding: "10px 13px", textAlign: "center", minWidth: 72 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#ccc", letterSpacing: -0.5 }}>{v}</div>
                        <div style={{ fontSize: 7, color: "#222", letterSpacing: 2, marginTop: 3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verdict */}
                <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 8, padding: "20px 22px", marginBottom: 10, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 180, height: "100%", background: `radial-gradient(ellipse at right, ${vc.color}07, transparent)`, pointerEvents: "none" }} />
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <span style={{ fontSize: 26, color: vc.color, filter: `drop-shadow(0 0 8px ${vc.color})`, lineHeight: 1 }}>{vc.icon}</span>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: vc.color, letterSpacing: 3 }}>{vc.label}</div>
                          <Tag color={vc.color}>{vc.tag}</Tag>
                        </div>
                      </div>
                      <p style={{ margin: "0 0 14px", color: "#444", fontSize: 12, lineHeight: 1.8, maxWidth: 500 }}>{summary}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {showDownload && (
                          <button onClick={() => downloadReport(data, setDownloading)} disabled={downloading}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,207,255,0.06)", color: downloading ? "#333" : "#00cfff", border: `1px solid rgba(0,207,255,${downloading ? "0.1" : "0.25"})`, borderRadius: 4, padding: "9px 16px", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 9, cursor: downloading ? "not-allowed" : "pointer", letterSpacing: 2 }}>
                            {downloading ? "⏳ BUILDING..." : "↓ DOWNLOAD REPORT (.DOCX)"}
                          </button>
                        )}
                        <button onClick={copyResult}
                          style={{ background: "none", color: copied ? "#39ff14" : "#2a2a2a", border: `1px solid ${copied ? "#39ff1433" : "#141414"}`, borderRadius: 4, padding: "9px 16px", fontFamily: "'Courier New', monospace", fontSize: 9, cursor: "pointer", letterSpacing: 2, transition: "all .2s" }}>
                          {copied ? "✓ COPIED" : "⎘ COPY SUMMARY"}
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <RadialScore score={me?.overallScore || 0} size={92} />
                      <div style={{ fontSize: 7, color: "#222", letterSpacing: 3, marginTop: 5 }}>OVERALL SCORE</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 8, marginBottom: 10 }}>
                  {[
                    { lbl: "SUBSCRIBERS", met: me?.ytpRequirements?.subscribers?.met, req: "1,000 min" },
                    { lbl: "WATCH HOURS", met: me?.ytpRequirements?.watchHours?.met, req: "4,000 hrs" },
                    { lbl: "GUIDELINES", met: me?.ytpRequirements?.communityGuidelines?.met, req: "No violations" },
                    { lbl: "ADSENSE", met: me?.ytpRequirements?.adsenseLinked?.met, req: "Account linked" },
                  ].map(s => (
                    <div key={s.lbl} style={{ background: "#0c0c0c", border: `1px solid ${s.met ? "rgba(57,255,20,0.12)" : "rgba(255,49,49,0.12)"}`, borderRadius: 5, padding: "12px 13px" }}>
                      <div style={{ fontSize: 7, color: "#2a2a2a", letterSpacing: 2, marginBottom: 6 }}>{s.lbl}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                        <GlowDot color={s.met ? "#39ff14" : "#ff3131"} />
                        <span style={{ fontSize: 10, color: s.met ? "#39ff14" : "#ff3131", fontWeight: 700, letterSpacing: 1 }}>{s.met ? "PASS" : "FAIL"}</span>
                      </div>
                      <div style={{ fontSize: 8, color: "#1a1a1a" }}>req: {s.req}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #111", marginBottom: 14, overflowX: "auto" }}>
                  {[{ id: "overview", l: "◉ Overview" }, { id: "videos", l: `▦ Videos (${videos?.length || 0})` }, { id: "policy", l: "◻ Policy" }, { id: "tips", l: "▲ Action Plan" }, { id: "timeline", l: "⬡ Timeline" }].map(t => (
                    <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
                      style={{ background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #ff3131" : "2px solid transparent", color: activeTab === t.id ? "#ccc" : "#2a2a2a", padding: "10px 14px", fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap", transition: "color .2s" }}>
                      {t.l}
                    </button>
                  ))}
                </div>

                {/* Overview */}
                {activeTab === "overview" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px,1fr))", gap: 10 }}>
                    <div style={{ background: "#0c0c0c", border: "1px solid #141414", borderRadius: 8, padding: 18 }}>
                      <div style={{ fontSize: 8, color: "#2a2a2a", letterSpacing: 3, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><GlowDot color="#39ff14" />YPP REQUIREMENTS</div>
                      {me?.ytpRequirements && Object.entries(me.ytpRequirements).map(([key, val]) => (
                        <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0d0d0d" }}>
                          <div>
                            <div style={{ fontSize: 12, color: "#777", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                            {val.required != null && <div style={{ fontSize: 8, color: "#1e1e1e", marginTop: 2, letterSpacing: 1 }}>need {val.required?.toLocaleString()} · est {val.estimated?.toLocaleString()}</div>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <GlowDot color={val.met ? "#39ff14" : "#ff3131"} />
                            <span style={{ fontSize: 9, color: val.met ? "#39ff14" : "#ff3131", letterSpacing: 1 }}>{val.met ? "PASS" : "FAIL"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#0c0c0c", border: "1px solid #141414", borderRadius: 8, padding: 18 }}>
                      <div style={{ fontSize: 8, color: "#2a2a2a", letterSpacing: 3, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><GlowDot color="#ffcc00" />CONTENT ANALYSIS</div>
                      {me?.contentAnalysis && Object.entries(me.contentAnalysis).map(([key, val]) => (
                        <ScoreBar key={key} label={key.replace(/([A-Z])/g, ' $1')} score={val.score} notes={val.notes} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {activeTab === "videos" && (
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                      <div style={{ background: "rgba(57,255,20,0.05)", border: "1px solid rgba(57,255,20,0.12)", borderRadius: 4, padding: "7px 14px", fontSize: 9, color: "#39ff14", letterSpacing: 2 }}>
                        ✦ {(videos || []).filter(v => v.monetizable).length} MONETIZABLE
                      </div>
                      <div style={{ background: "rgba(255,49,49,0.05)", border: "1px solid rgba(255,49,49,0.12)", borderRadius: 4, padding: "7px 14px", fontSize: 9, color: "#ff3131", letterSpacing: 2 }}>
                        ✕ {(videos || []).filter(v => !v.monetizable).length} BLOCKED
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {(videos || []).map((v, i) => (
                        <div key={i} style={{ background: "#0c0c0c", border: `1px solid ${v.monetizable ? "#111" : "rgba(255,49,49,0.12)"}`, borderRadius: 6, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <div style={{ width: 38, height: 38, background: v.monetizable ? "rgba(57,255,20,0.05)" : "rgba(255,49,49,0.05)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, border: `1px solid ${v.monetizable ? "rgba(57,255,20,0.1)" : "rgba(255,49,49,0.1)"}` }}>
                            {v.monetizable ? "💰" : "🚫"}
                          </div>
                          <div style={{ flex: 1, minWidth: 120 }}>
                            <div style={{ fontSize: 12, color: "#bbb", marginBottom: 3, letterSpacing: 0.3 }}>{v.title}</div>
                            <div style={{ fontSize: 8, color: "#1e1e1e", letterSpacing: 1 }}>{v.uploadDate} · {v.duration} · {v.views} views · {v.likes} likes</div>
                            {v.issues?.length > 0 && <div style={{ fontSize: 8, color: "#ff3131", marginTop: 3, letterSpacing: 1 }}>⚠ {v.issues.join(" · ")}</div>}
                          </div>
                          <div style={{ textAlign: "center", flexShrink: 0 }}>
                            <RadialScore score={v.score || 0} size={46} />
                            <div style={{ fontSize: 6, color: "#1e1e1e", letterSpacing: 2, marginTop: 2 }}>AD SCORE</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Policy */}
                {activeTab === "policy" && (
                  <div style={{ background: "#0c0c0c", border: "1px solid #141414", borderRadius: 8, padding: 18 }}>
                    <div style={{ fontSize: 8, color: "#2a2a2a", letterSpacing: 3, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><GlowDot color="#00cfff" />POLICY COMPLIANCE AUDIT</div>
                    {me?.policyCompliance && Object.entries(me.policyCompliance).map(([key, val]) => {
                      const good = val === true || val === "CLEAN" || val === "SAFE" || val === "LOW" || (typeof val === "boolean" && !val && (key === "communityStrike" || key === "ageRestricted"));
                      return (
                        <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #0d0d0d" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <GlowDot color={good ? "#39ff14" : "#ff3131"} />
                            <span style={{ color: "#777", fontSize: 12, textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                          </div>
                          <span style={{ fontSize: 9, fontWeight: 700, color: good ? "#39ff14" : "#ff3131", background: good ? "rgba(57,255,20,0.06)" : "rgba(255,49,49,0.06)", padding: "4px 12px", borderRadius: 3, border: `1px solid ${good ? "rgba(57,255,20,0.18)" : "rgba(255,49,49,0.18)"}`, letterSpacing: 2 }}>
                            {typeof val === "boolean" ? (key === "communityStrike" || key === "ageRestricted" ? (!val ? "PASS" : "FAIL") : (val ? "PASS" : "FAIL")) : val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Action Plan */}
                {activeTab === "tips" && (
                  <div>
                    <div style={{ fontSize: 8, color: "#1e1e1e", letterSpacing: 3, marginBottom: 10 }}>FOLLOW THESE STEPS TO QUALIFY FOR MONETIZATION</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {(recommendations || []).map((tip, i) => (
                        <div key={i} style={{ background: "#0c0c0c", borderLeft: `3px solid ${i < 3 ? "#ff3131" : i < 6 ? "#ffcc00" : "#39ff14"}`, borderRadius: 4, padding: "13px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <span style={{ color: "#1e1e1e", fontWeight: 900, fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                          <p style={{ margin: 0, color: "#777", fontSize: 12, lineHeight: 1.8 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {activeTab === "timeline" && (
                  <div>
                    <div style={{ fontSize: 8, color: "#1e1e1e", letterSpacing: 3, marginBottom: 18 }}>ESTIMATED ROADMAP TO MONETIZATION</div>
                    {[
                      { time: "WEEK 1–2", goal: "Fix Policy Issues", desc: "Resolve copyright strikes, delete violating content, clear community guideline warnings", color: "#ff3131" },
                      { time: "MONTH 1", goal: "Improve Content Quality", desc: "Create 4–8 high quality original videos with strong hooks and good production value", color: "#ff8c42" },
                      { time: "MONTH 2–3", goal: "Build Watch Hours", desc: "Upload 2–3x per week consistently, make longer videos (8–15 min), build playlists", color: "#ffcc00" },
                      { time: "MONTH 3–6", goal: "Reach 1,000 Subscribers", desc: "Promote on Reddit, social media, collaborate with creators, optimize thumbnails & titles", color: "#b3ff00" },
                      { time: "MONTH 4–6", goal: "Reach 4,000 Watch Hours", desc: "Focus on evergreen content, repurpose videos into Shorts, use strong end-screen CTAs", color: "#39ff14" },
                      { time: "MONTH 6+", goal: "Apply for YPP", desc: "Confirm all requirements met, link AdSense account, submit application in YouTube Studio", color: "#00cfff" },
                    ].map((s, i, arr) => (
                      <div key={i} style={{ display: "flex", gap: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 18, flexShrink: 0 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}`, marginTop: 5, flexShrink: 0 }} />
                          {i < arr.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 36, background: `linear-gradient(${s.color}44, ${arr[i + 1].color}44)` }} />}
                        </div>
                        <div style={{ paddingBottom: i < arr.length - 1 ? 22 : 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <span style={{ fontSize: 8, color: s.color, letterSpacing: 2, fontWeight: 700 }}>{s.time}</span>
                            <div style={{ height: 1, width: 16, background: s.color, opacity: 0.3 }} />
                            <span style={{ fontSize: 12, color: "#bbb", fontWeight: 700 }}>{s.goal}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 11, color: "#333", lineHeight: 1.7, maxWidth: 460 }}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })()}

          {/* Empty */}
          {!data && !loading && (
            <div style={{ textAlign: "center", padding: "30px 0", borderTop: "1px solid #0d0d0d" }}>
              <div style={{ fontSize: 9, color: "#141414", letterSpacing: 4, animation: "pulse 3s ease infinite" }}>▶ ENTER A CHANNEL URL ABOVE TO BEGIN</div>
            </div>
          )}

        </div>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid #0d0d0d", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "#ff3131", letterSpacing: 4 }}>FFDRYT</span>
            <span style={{ fontSize: 8, color: "#161616", letterSpacing: 2 }}>CREATED BY FFDRYT · FREE TOOL · 2025</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy", "Terms", "Contact"].map(l => <span key={l} style={{ fontSize: 8, color: "#141414", letterSpacing: 2, cursor: "pointer", textTransform: "uppercase" }}>{l}</span>)}
          </div>
          <span style={{ fontSize: 8, color: "#0f0f0f", letterSpacing: 2 }}>NOT AFFILIATED WITH YOUTUBE OR GOOGLE</span>
        </footer>

      </div>
    </div>
  );
}
