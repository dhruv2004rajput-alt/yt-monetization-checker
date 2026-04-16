import { useState, useEffect, useRef } from "react";

function injectFonts() {
  if (document.getElementById("mc-fonts")) return;
  const link = document.createElement("link");
  link.id = "mc-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

function injectLoaderFonts() {
  if (document.getElementById("ld-fonts")) return;
  const link = document.createElement("link");
  link.id = "ld-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap";
  document.head.appendChild(link);
}

function injectFavicon() {
  if (document.getElementById("mc-favicon")) return;
  const link = document.createElement("link");
  link.id = "mc-favicon";
  link.rel = "icon";
  link.type = "image/jpeg";
  link.href = "/logo.jpg";
  document.head.appendChild(link);

  const apple = document.createElement("link");
  apple.rel = "apple-touch-icon";
  apple.href = "/logo.jpg";
  document.head.appendChild(apple);

  document.title = "MonetizeCheck – AI-Powered YouTube Monetization Analyzer";

  const metas = [
    { name: "description", content: "Free AI tool to check if your YouTube channel is ready to monetize. Get your eligibility score, YPP requirements check, and personalized action plan instantly. By FFDRYT." },
    { property: "og:title", content: "MonetizeCheck – AI YouTube Monetization Checker" },
    { property: "og:description", content: "Paste your YouTube URL and get a full monetization eligibility report. Free, instant, no login required. By FFDRYT." },
    { property: "og:image", content: "https://ytmonetizecheck.in/logo.jpg" },
    { property: "og:url", content: "https://ytmonetizecheck.in" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "MonetizeCheck" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "MonetizeCheck – AI YouTube Monetization Checker" },
    { name: "twitter:description", content: "Free AI tool to check YouTube monetization eligibility. Instant score & action plan." },
    { name: "twitter:image", content: "https://ytmonetizecheck.in/logo.jpg" },
  ];
  metas.forEach(attrs => {
    const m = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => m.setAttribute(k, v));
    document.head.appendChild(m);
  });
}

/* ══════════════════════════ LOADER COMPONENT ══════════════════════════════ */
const Loader = ({ onDone }) => {
  const [pct, setPct] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    injectLoaderFonts();
    const interval = setInterval(() => {
      setPct(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHiding(true);
            setTimeout(onDone, 600);
          }, 300);
          return 100;
        }
        return Math.min(p + 2, 100);
      });
    }, 36);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      opacity: hiding ? 0 : 1,
      transition: hiding ? "opacity 0.6s ease" : "none",
      pointerEvents: hiding ? "none" : "all",
    }}>
      <style>{`
        @keyframes ldSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes ldPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.97)}}
        @keyframes fadeInLd{to{opacity:1}}
        @keyframes ldFill{to{clip-path:inset(0 0% 0 0)}}
        @keyframes ldBar{to{width:100%}}
        @keyframes ldLeaf{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
        @keyframes ldScan{from{top:-2px}to{top:100%}}
        @keyframes ldDotBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-8px);opacity:1}}
        @keyframes ldBarGrow{0%{height:8px}50%{height:32px}100%{height:8px}}
      `}</style>

      <div style={{
        position: "relative", width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg,#060D1A 0%,#091828 60%,#060D1A 100%)",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 45%,rgba(0,212,255,.12) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 20% 80%,rgba(0,136,204,.08) 0%,transparent 60%),linear-gradient(160deg,#060D1A 0%,#091828 55%,#060D1A 100%)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,212,255,0.05)' stroke-width='1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E\") repeat", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#00D4FF,transparent)" }}/>
        <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(0,212,255,.2),transparent)", animation:"ldScan 7s linear infinite", zIndex:1 }}/>

        {/* Emblem — actual logo */}
        <div style={{ width:80, height:80, borderRadius:"50%", border:"1px solid rgba(0,212,255,.35)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, position:"relative", opacity:0, animation:"fadeInLd .5s .2s ease forwards", zIndex:2 }}>
          <div style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1px solid rgba(0,212,255,.15)" }}/>
          <img src="/logo.jpg" alt="MonetizeCheck" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", animation:"ldPulse 2.2s ease-in-out infinite" }}/>
        </div>

        {/* Title */}
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.6rem,5vw,3.5rem)", fontWeight:300, letterSpacing:".18em", color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,.15)", position:"relative", overflow:"hidden", textTransform:"uppercase", zIndex:2 }}>
          YT Monetize Check
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,#00D4FF,#7EEEFF,#00D4FF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", clipPath:"inset(0 100% 0 0)", animation:"ldFill 1.6s .5s cubic-bezier(.77,0,.175,1) forwards" }}>YT Monetize Check</div>
        </div>

        <div style={{ fontSize:".58rem", letterSpacing:".45em", textTransform:"uppercase", color:"rgba(0,212,255,.5)", marginTop:12, opacity:0, animation:"fadeInLd .6s 1.3s ease forwards", zIndex:2 }}>ytmonetizecheck.in · by ffdryt</div>
        <div style={{ width:48, height:1, background:"linear-gradient(90deg,transparent,#00D4FF,transparent)", margin:"22px auto 0", opacity:0, animation:"fadeInLd .5s 1.5s ease forwards", zIndex:2 }}/>

        {/* Spinner */}
        <div style={{ position:"relative", width:64, height:64, marginTop:28, opacity:0, animation:"fadeInLd .5s .3s ease forwards", zIndex:2 }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid transparent", borderTopColor:"#00D4FF", borderRightColor:"#00D4FF", animation:"ldSpin 1.1s linear infinite" }}/>
          <div style={{ position:"absolute", inset:10, borderRadius:"50%", border:"3px solid transparent", borderBottomColor:"#00D4FF", borderLeftColor:"rgba(255,255,255,.05)", animation:"ldSpin .75s linear infinite reverse" }}/>
          <div style={{ position:"absolute", inset:22, borderRadius:"50%", border:"2px solid rgba(0,170,220,.6)", animation:"ldSpin 1.6s linear infinite" }}/>
        </div>

        {/* Bars */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:36, marginTop:22, opacity:0, animation:"fadeInLd .5s .4s ease forwards", zIndex:2 }}>
          {[["#00D4FF","0s"],["#0088AA",".15s"],["#00AACC",".3s"],["#0088AA",".15s"],["#00D4FF","0s"]].map(([bg,delay],i)=>(
            <div key={i} style={{ width:5, borderRadius:3, background:bg, animation:`ldBarGrow 1.1s ${delay} ease-in-out infinite` }}/>
          ))}
        </div>

        {/* Status */}
        <div style={{ color:"rgba(255,255,255,.8)", fontSize:".85rem", fontWeight:400, letterSpacing:".2px", marginTop:20, opacity:0, animation:"fadeInLd .5s .5s ease forwards", zIndex:2 }}>
          Checking monetization status
          <span style={{ display:"inline-flex", gap:4, verticalAlign:"middle", marginLeft:2 }}>
            {[0,.18,.36].map((d,i)=>(
              <span key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#00D4FF", display:"inline-block", animation:`ldDotBounce 1.2s ${d}s ease-in-out infinite` }}/>
            ))}
          </span>
        </div>

        {/* Progress */}
        <div style={{ width:260, height:1, background:"rgba(255,255,255,.07)", marginTop:24, overflow:"hidden", borderRadius:1, opacity:0, animation:"fadeInLd .5s .3s ease forwards", zIndex:2 }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,transparent,#00D4FF,#7EEEFF)", width:0, animation:"ldBar 1.8s .3s cubic-bezier(.77,0,.175,1) forwards" }}/>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:".95rem", color:"rgba(0,212,255,.5)", marginTop:10, letterSpacing:".25em", opacity:0, animation:"fadeInLd .5s .3s ease forwards", zIndex:2 }}>{pct}%</div>

        <div style={{ color:"#00D4FF", fontSize:".7rem", textAlign:"center", opacity:0, animation:"fadeInLd .5s .9s ease forwards", letterSpacing:".3px", marginTop:10, zIndex:2 }}>BY FFDRYT</div>
        <div style={{ color:"#00D4FF", fontSize:".7rem", textAlign:"center", opacity:0, animation:"fadeInLd .5s 1s ease forwards", letterSpacing:".3px", marginTop:10, zIndex:2 }}>FROM A CREATOR TO A CREATOR</div>
      </div>
    </div>
  );
};

const getScoreColor = (s) => s >= 75 ? "#00D4FF" : s >= 50 ? "#F5A623" : "#FF4757";
const getScoreGlow  = (s) => s >= 75 ? "rgba(0,212,255,0.35)" : s >= 50 ? "rgba(245,166,35,0.35)" : "rgba(255,71,87,0.35)";
const getVerdictConfig = (v) => ({
  LIKELY_ELIGIBLE: { color:"#00D4FF", bg:"rgba(0,212,255,0.06)",  border:"rgba(0,212,255,0.2)",  label:"LIKELY ELIGIBLE", tag:"READY TO MONETIZE",  icon:"✓" },
  BORDERLINE:      { color:"#F5A623", bg:"rgba(245,166,35,0.06)", border:"rgba(245,166,35,0.2)", label:"BORDERLINE",      tag:"NEEDS IMPROVEMENT",  icon:"⚠" },
  NOT_ELIGIBLE:    { color:"#FF4757", bg:"rgba(255,71,87,0.06)",  border:"rgba(255,71,87,0.2)",  label:"NOT ELIGIBLE",    tag:"ACTION REQUIRED",    icon:"✕" },
}[v] || { color:"#FF4757", bg:"rgba(255,71,87,0.06)", border:"rgba(255,71,87,0.2)", label:"NOT ELIGIBLE", tag:"ACTION REQUIRED", icon:"✕" });

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 480, isTablet: w < 768, isDesktop: w >= 768, w };
}

const RadialScore = ({ score, size = 110 }) => {
  const r = size / 2 - 10, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  const col = getScoreColor(score), glow = getScoreGlow(score);
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", filter:`drop-shadow(0 0 12px ${glow})`, flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)" }}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform:`rotate(90deg)`, transformOrigin:`${size/2}px ${size/2}px`,
          fill:col, fontSize:size*0.24, fontWeight:800, fontFamily:"'DM Mono',monospace", letterSpacing:-1 }}>
        {score}
      </text>
    </svg>
  );
};

const ScoreBar = ({ label, score, notes }) => {
  const col = getScoreColor(score);
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:1, textTransform:"uppercase" }}>{label}</span>
        <span style={{ color:col, fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", background:`${col}18`, padding:"3px 10px", borderRadius:4, border:`1px solid ${col}30` }}>{score}</span>
      </div>
      <div style={{ height:4, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:`linear-gradient(90deg,${col}66,${col})`, borderRadius:4, transition:"width 1.4s cubic-bezier(.4,0,.2,1)" }}/>
      </div>
      {notes && <p style={{ color:"rgba(255,255,255,0.25)", fontSize:10, margin:"5px 0 0", fontFamily:"'DM Mono',monospace", lineHeight:1.6 }}>{notes}</p>}
    </div>
  );
};

const Pill = ({ children, color = "rgba(255,255,255,0.15)" }) => (
  <span style={{ display:"inline-block", fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, color:"rgba(255,255,255,0.5)",
    background:"rgba(255,255,255,0.05)", border:`1px solid ${color}`, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", marginBottom:4 }}>
    {children}
  </span>
);

const StatCard = ({ label, value, color = "#fff" }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
    <div style={{ fontSize:18, fontWeight:800, color, fontFamily:"'Syne',sans-serif", letterSpacing:-0.5 }}>{value}</div>
    <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginTop:4, textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, accent }) => (
  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"22px 20px", transition:"all .25s", cursor:"default" }}
    onMouseEnter={e=>{ e.currentTarget.style.border=`1px solid ${accent}40`; e.currentTarget.style.background=`${accent}07`; }}
    onMouseLeave={e=>{ e.currentTarget.style.border="1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}>
    <div style={{ width:42, height:42, background:`${accent}18`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, marginBottom:13, border:`1px solid ${accent}30` }}>{icon}</div>
    <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:6, fontFamily:"'Syne',sans-serif" }}>{title}</div>
    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", lineHeight:1.7, fontFamily:"'Inter',sans-serif" }}>{desc}</div>
  </div>
);

const AmbientBg = () => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
    <div style={{ position:"absolute", top:-200, left:-200, width:600, height:600, borderRadius:"50%",
      background:"radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)", animation:"float 9s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", bottom:-300, right:-150, width:700, height:700, borderRadius:"50%",
      background:"radial-gradient(circle,rgba(0,136,204,0.04) 0%,transparent 70%)", animation:"float 12s ease-in-out infinite reverse" }}/>
    <div style={{ position:"absolute", inset:0,
      backgroundImage:"linear-gradient(rgba(0,212,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.015) 1px,transparent 1px)",
      backgroundSize:"64px 64px" }}/>
  </div>
);

async function generateWordReport(data) {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat } =
    await import("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js");
  const { channel, monetizationEligibility: me, recommendations, summary } = data;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const ACCENT="00D4FF", LIGHT="E6F9FF", DARK="060D1A";
  const cb = { style:BorderStyle.SINGLE, size:1, color:"E5E7EB" };
  const ab = { top:cb, bottom:cb, left:cb, right:cb };
  const h1 = t => new Paragraph({ heading:HeadingLevel.HEADING_1, spacing:{before:400,after:200}, children:[new TextRun({text:t,bold:true,size:36,color:DARK,font:"Arial"})] });
  const body = t => new Paragraph({ spacing:{before:80,after:80}, children:[new TextRun({text:t,size:22,font:"Arial",color:"374151"})] });
  const sp = () => new Paragraph({ spacing:{before:120,after:120}, children:[new TextRun("")] });
  const problems = [];
  if (me?.ytpRequirements) { const r=me.ytpRequirements; if(!r.subscribers?.met) problems.push(`Subscribers too low (~${r.subscribers?.estimated?.toLocaleString()||"?"}), need 1,000`); if(!r.watchHours?.met) problems.push(`Watch hours insufficient (~${r.watchHours?.estimated?.toLocaleString()||"?"}), need 4,000`); if(!r.communityGuidelines?.met) problems.push("Community Guidelines violations detected"); if(!r.adsenseLinked?.met) problems.push("No AdSense account linked"); }
  if (me?.contentAnalysis) { const c=me.contentAnalysis; if(c.originalContent?.score<60) problems.push(`Low original content score (${c.originalContent?.score}/100)`); if(c.adFriendliness?.score<60) problems.push(`Poor ad-friendliness (${c.adFriendliness?.score}/100)`); if(c.consistencyScore?.score<50) problems.push(`Inconsistent upload schedule (${c.consistencyScore?.score}/100)`); if(c.engagementRate?.score<50) problems.push(`Low engagement rate (${c.engagementRate?.score}/100)`); }
  const doc = new Document({
    numbering:{config:[{reference:"nums",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
    styles:{default:{document:{run:{font:"Arial",size:22}}}},
    sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},children:[
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:720,after:120},children:[new TextRun({text:"MonetizeCheck Report",bold:true,size:88,color:DARK,font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},children:[new TextRun({text:"YouTube Channel Monetization Eligibility Analysis",size:28,color:"9CA3AF",font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:480},children:[new TextRun({text:`${today} · Created by FFDRYT`,size:20,color:"D1D5DB",font:"Arial"})]}),
      sp(),h1("Channel Overview"),
      new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2800,6560],rows:[["Channel Name",channel?.name||"N/A"],["Handle",channel?.handle||"N/A"],["Category",channel?.category||"N/A"],["Subscribers",channel?.subscribers||"N/A"],["Total Videos",String(channel?.totalVideos||"N/A")],["Total Views",channel?.totalViews||"N/A"],["Country",channel?.country||"N/A"],["Joined",channel?.joinedDate||"N/A"]].map(([l,v],i)=>new TableRow({children:[new TableCell({borders:ab,width:{size:2800,type:WidthType.DXA},shading:{fill:i%2===0?"F9FAFB":"FFFFFF",type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},children:[new Paragraph({children:[new TextRun({text:l,bold:true,size:20,font:"Arial",color:"374151"})]})]}),new TableCell({borders:ab,width:{size:6560,type:WidthType.DXA},shading:{fill:i%2===0?"F9FAFB":"FFFFFF",type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},children:[new Paragraph({children:[new TextRun({text:v,size:20,font:"Arial",color:"6B7280"})]})]})]}))}),
      sp(),h1("Verdict & Summary"),
      new Paragraph({shading:{fill:LIGHT,type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:18,color:ACCENT}},spacing:{before:140,after:140},indent:{left:400},children:[new TextRun({text:`Verdict: ${me?.verdict||"N/A"} · Score: ${me?.overallScore||0}/100`,bold:true,size:24,font:"Arial",color:DARK})]}),
      sp(),body(summary||"No summary."),
      sp(),h1("Issues Found"),body(`${problems.length} issue(s) detected:`),sp(),
      ...problems.flatMap((p,i)=>[new Paragraph({spacing:{before:120,after:40},children:[new TextRun({text:`Issue ${i+1}`,bold:true,size:24,color:"DC2626",font:"Arial"})]}),new Paragraph({shading:{fill:"FEF2F2",type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:16,color:"DC2626"}},spacing:{before:80,after:80},indent:{left:400},children:[new TextRun({text:p,size:22,font:"Arial",color:"374151"})]}),sp()]),
      h1("Action Plan"),sp(),
      ...(recommendations||[]).map(t=>new Paragraph({numbering:{reference:"nums",level:0},spacing:{before:80,after:80},children:[new TextRun({text:t,size:22,font:"Arial",color:"374151"})]})),
      sp(),sp(),
      new Paragraph({alignment:AlignmentType.CENTER,border:{top:{style:BorderStyle.SINGLE,size:4,color:"E5E7EB"}},spacing:{before:280},children:[new TextRun({text:`MonetizeCheck · Created by FFDRYT · ${today} · Not affiliated with YouTube or Google`,size:16,color:"9CA3AF",font:"Arial"})]})
    ]}]
  });
  return await Packer.toBuffer(doc);
}

async function downloadReport(data, setDownloading) {
  setDownloading(true);
  try {
    const buf = await generateWordReport(data);
    const blob = new Blob([buf],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const a = Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:`${(data.channel?.name||"channel").replace(/\s+/g,"_")}_monetize_report.docx`});
    a.click(); URL.revokeObjectURL(a.href);
  } catch { alert("Failed to generate report."); }
  setDownloading(false);
}

/* ══════════════════════════ NAVBAR ════════════════════════════════════════ */
const Navbar = ({ page, setPage, isMobile, isDesktop }) => {
  const [open, setOpen] = useState(false);
  const links = [{ id:"home",label:"Home"}, { id:"about",label:"About"}, { id:"guide",label:"YPP Guide"}, { id:"privacy",label:"Privacy"}];
  return (
    <>
      <nav style={{ borderBottom:"1px solid rgba(0,212,255,0.1)", padding:`0 ${isMobile?16:40}px`, height:60, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(6,13,26,0.92)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }} onClick={()=>setPage("home")}>
          <img src="/logo.jpg" alt="MonetizeCheck" style={{ width:34, height:34, borderRadius:9, objectFit:"cover", boxShadow:"0 4px 14px rgba(0,212,255,0.25)" }}/>
          <div>
            <div style={{ fontSize:isMobile?14:16, fontWeight:800, color:"#fff", letterSpacing:-0.5, fontFamily:"'Syne',sans-serif", lineHeight:1.1 }}>Monetize<span style={{ color:"#00D4FF" }}>Check</span></div>
            <div style={{ fontSize:8, color:"rgba(0,212,255,0.6)", letterSpacing:2, fontFamily:"'DM Mono',monospace" }}>by FFDRYT · AI POWERED</div>
          </div>
        </div>
        {isDesktop ? (
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {links.map(l=>(
              <button key={l.id} onClick={()=>setPage(l.id)} style={{ background:"none", border:"none", borderBottom:page===l.id?"2px solid #00D4FF":"2px solid transparent", color:page===l.id?"#00D4FF":"rgba(255,255,255,0.35)", padding:"6px 14px", borderRadius:0, cursor:"pointer", transition:"color .2s", fontWeight:600, fontSize:12, fontFamily:"'Inter',sans-serif" }}>{l.label}</button>
            ))}
            <div style={{ width:1, height:18, background:"rgba(255,255,255,0.08)", margin:"0 6px" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:20, padding:"5px 12px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 8px #00D4FF" }}/>
              <span style={{ fontSize:10, color:"#00D4FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>LIVE</span>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:20, padding:"4px 10px" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 6px #00D4FF" }}/>
              <span style={{ fontSize:9, color:"#00D4FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>LIVE</span>
            </div>
            <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"7px 10px", cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:14 }}>{open?"✕":"☰"}</button>
          </div>
        )}
      </nav>
      {!isDesktop && open && (
        <div style={{ background:"rgba(6,13,26,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,212,255,0.08)", position:"relative", zIndex:199 }}>
          {links.map(l=>(
            <div key={l.id} onClick={()=>{ setPage(l.id); setOpen(false); }} style={{ padding:"14px 20px", fontSize:14, color:page===l.id?"#00D4FF":"rgba(255,255,255,0.5)", borderBottom:"1px solid rgba(255,255,255,0.04)", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontWeight:page===l.id?700:400 }}>{l.label}</div>
          ))}
        </div>
      )}
    </>
  );
};

/* ══════════════════════════ FOOTER ════════════════════════════════════════ */
const Footer = ({ setPage, isMobile }) => (
  <footer style={{ borderTop:"1px solid rgba(0,212,255,0.06)", padding:`36px ${isMobile?16:40}px 28px`, marginTop:80 }}>
    <div style={{ maxWidth:1080, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?28:40, marginBottom:36 }}>
        <div style={{ gridColumn:isMobile?"1 / -1":"auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <img src="/logo.jpg" alt="MonetizeCheck" style={{ width:30, height:30, borderRadius:8, objectFit:"cover" }}/>
            <span style={{ fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif" }}>MonetizeCheck</span>
          </div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.8, maxWidth:200, fontFamily:"'Inter',sans-serif" }}>Free AI-powered YouTube monetization eligibility analyzer by FFDRYT.</p>
        </div>
        {[
          { title:"Tool",    items:[["YPP Guide",()=>setPage("guide")]] },
          { title:"Company", items:[["About",()=>setPage("about")]] },
          { title:"Legal",   items:[["Privacy Policy",()=>setPage("privacy")]] },
        ].map(col=>(
          <div key={col.title}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:2.5, marginBottom:14, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>{col.title}</div>
            {col.items.map(([label,fn])=>(
              <div key={label} onClick={fn||undefined} style={{ fontSize:12, color:"rgba(255,255,255,0.28)", marginBottom:9, cursor:fn?"pointer":"default", transition:"color .2s", fontFamily:"'Inter',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.65)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.28)"}>{label}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:20, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.14)", fontFamily:"'DM Mono',monospace" }}>© 2026 FFDRYT · MonetizeCheck · Free Tool</span>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.1)", fontFamily:"'DM Mono',monospace" }}>Created with love by FFDRYT</span>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════ YPP GUIDE PAGE ════════════════════════════════ */
const GuidePage = ({ isMobile, isTablet, setPage }) => {
  const pad = isMobile ? 14 : 24;
  const H2 = ({ children }) => <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(20px,3vw,28px)", fontWeight:800, color:"#fff", letterSpacing:-0.5, margin:"48px 0 16px", lineHeight:1.2 }}>{children}</h2>;
  const H3 = ({ children }) => <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:"rgba(255,255,255,0.85)", margin:"28px 0 10px" }}>{children}</h3>;
  const P = ({ children, style={} }) => <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.9, marginBottom:16, fontFamily:"'Inter',sans-serif", fontWeight:300, ...style }}>{children}</p>;
  const Callout = ({ color="#00D4FF", icon, children }) => (
    <div style={{ background:`${color}06`, border:`1px solid ${color}20`, borderRadius:14, padding:"18px 20px", marginBottom:20, display:"flex", gap:14, alignItems:"flex-start" }}>
      <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.9, fontFamily:"'Inter',sans-serif" }}>{children}</div>
    </div>
  );
  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:`56px ${pad}px 80px`, animation:"slideUp .5s ease" }}>
      <div style={{ marginBottom:36 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:18 }}>
          <span style={{ fontSize:10, color:"#00D4FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>COMPLETE YPP GUIDE · 2025</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:800, color:"#fff", letterSpacing:-1.5, marginBottom:14, lineHeight:1.06 }}>The Complete Guide to<br/>YouTube Monetization</h1>
        <P>Everything you need to know about the YouTube Partner Program — requirements, strategy, common mistakes, and how to get approved faster.</P>
      </div>

      <H2>What Is the YouTube Partner Program?</H2>
      <P>The YouTube Partner Program (YPP) is YouTube's official monetization program that allows eligible creators to earn money from advertisements shown on their videos. When you join YPP, Google places ads before, during, and after your videos, and you receive a share of the revenue generated.</P>

      <H2>The 4 Core YPP Requirements in 2025</H2>
      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { n:"01", color:"#00D4FF", title:"1,000 Subscribers", body:"Your channel must have at least 1,000 real, organic subscribers. YouTube actively detects and removes artificially gained subscribers." },
          { n:"02", color:"#0088AA", title:"4,000 Watch Hours", body:"You need 4,000 valid public watch hours in the last 12 months. Shorts, private, and deleted videos do not count." },
          { n:"03", color:"#F5A623", title:"No Active Strikes", body:"Your channel must be in good standing with no active Community Guidelines strikes." },
          { n:"04", color:"#A78BFA", title:"Linked AdSense Account", body:"You must have an active Google AdSense account linked to your YouTube channel." },
        ].map(c=>(
          <div key={c.n} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"22px 20px" }}>
            <div style={{ fontSize:10, color:c.color, fontFamily:"'DM Mono',monospace", letterSpacing:2, marginBottom:10 }}>REQUIREMENT {c.n}</div>
            <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:10, fontFamily:"'Syne',sans-serif" }}>{c.title}</div>
            <P style={{ marginBottom:0, fontSize:13 }}>{c.body}</P>
          </div>
        ))}
      </div>

      <H2>What Happens During the YPP Review?</H2>
      <P>Meeting the four numerical requirements gets your application into the review queue, but it does not guarantee approval. YouTube's team evaluates your entire channel against their advertiser-friendly content guidelines. The review process typically takes 1 to 4 weeks.</P>

      <Callout color="#F5A623" icon="⚠">
        <strong style={{ color:"rgba(255,255,255,0.8)" }}>Common rejection reason:</strong> Many channels are rejected not because of explicit policy violations, but because the overall channel lacks a consistent identity or niche.
      </Callout>

      <H2>Revenue Expectations</H2>
      <P>YouTube ad revenue varies significantly by niche. Finance channels command CPMs of $20–$50. Technology channels see $8–$20. Gaming and entertainment sits at $2–$6. A newly monetized channel with 10,000–50,000 views/month can expect $30–$150/month in ad revenue.</P>

      <Callout color="#00D4FF" icon="✓">
        <strong style={{ color:"rgba(255,255,255,0.8)" }}>Pro tip:</strong> Once your MonetizeCheck score consistently sits above 75, your channel is statistically in a strong position for YPP approval.
      </Callout>

      <div style={{ marginTop:48, background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:16, padding:isMobile?20:32, textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:12 }}>🚀</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:10 }}>Ready to Check Your Channel?</h3>
        <P style={{ maxWidth:420, margin:"0 auto 20px" }}>Run a free AI analysis of your channel and get your personalized monetization score and action plan.</P>
        <button onClick={()=>setPage("home")} style={{ background:"linear-gradient(135deg,#00AACC,#0088AA)", color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 20px rgba(0,212,255,0.22)" }}>
          Analyze My Channel Free →
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════ ABOUT PAGE ════════════════════════════════════ */
const AboutPage = ({ isMobile, isTablet, setPage }) => {
  const pad = isMobile ? 14 : 24;
  const P = ({ children, style={} }) => <p style={{ fontSize:14, color:"rgba(255,255,255,0.48)", lineHeight:1.9, marginBottom:16, fontFamily:"'Inter',sans-serif", fontWeight:300, ...style }}>{children}</p>;
  const H2 = ({ children }) => <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(20px,3vw,26px)", fontWeight:800, color:"#fff", letterSpacing:-0.5, margin:"44px 0 14px", lineHeight:1.2 }}>{children}</h2>;
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:`56px ${pad}px 80px`, animation:"slideUp .5s ease" }}>
      <div style={{ marginBottom:44 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:18 }}>
          <span style={{ fontSize:10, color:"#00D4FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>ABOUT MONETIZECHECK</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:800, color:"#fff", letterSpacing:-1.5, marginBottom:14, lineHeight:1.06 }}>Built for Creators,<br/>by a Creator</h1>
        <P>MonetizeCheck was born out of a frustration that tens of thousands of YouTube creators experience every year — spending months building a channel, hitting the milestones, applying for YPP, and then getting rejected without a clear explanation.</P>
      </div>

      <div style={{ background:"rgba(0,212,255,0.04)", border:"1px solid rgba(0,212,255,0.14)", borderRadius:20, padding:isMobile?20:32, marginBottom:14 }}>
        <div style={{ fontSize:26, marginBottom:12 }}>🎯</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:"#fff", marginBottom:10 }}>Our Mission</h3>
        <P>Give every YouTube creator a clear, honest picture of where their channel stands against YouTube's Partner Program requirements. No logins, no subscriptions, no paywalls. Just answers.</P>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:10, marginBottom:36 }}>
        {[["10,000+","Channels Analyzed"],["100%","Free Forever"],["2026","Year Launched"],["FFDRYT","Creator Behind It"]].map(([v,l])=>(
          <div key={l} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"18px 14px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:800, color:"#00D4FF", fontFamily:"'Syne',sans-serif", letterSpacing:-0.5, marginBottom:6 }}>{v}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Mono',monospace", letterSpacing:1.5, textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      <H2>Who Is FFDRYT?</H2>
      <P>FFDRYT is an independent developer, IT technician, and YouTube creator based in Gujarat, India. FFDRYT built MonetizeCheck as a solo project — turning a real frustration into a useful free tool for other creators.</P>

      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:12, marginBottom:12 }}>
        {[
          { icon:"F", iconBg:"linear-gradient(135deg,#00D4FF,#0088AA)", title:"Created by FFDRYT", body:"Every feature is informed by real experience building a channel from scratch. The tool is designed the way a creator would want it: fast, honest, and free." },
          { icon:"🤖", iconBg:"rgba(0,136,204,0.15)", title:"Powered by AI", body:"MonetizeCheck uses large language models to analyze publicly available channel data and generate a personalized eligibility score and action plan in under 30 seconds." },
        ].map(c=>(
          <div key={c.title} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:isMobile?20:26 }}>
            <div style={{ width:46, height:46, background:c.iconBg, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:14, fontWeight:900, color:"#fff" }}>{c.icon}</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:8 }}>{c.title}</h3>
            <P style={{ marginBottom:0, fontSize:12 }}>{c.body}</P>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:isMobile?18:24, marginBottom:24 }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:10 }}>Get in Touch</h3>
        <P style={{ marginBottom:16 }}>Have a suggestion, found a bug, or want to collaborate? Reach out below.</P>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[["Instagram","@FFDRYT","#00D4FF"],["YouTube","youtube.com/@ffdryt","#FF4757"],["Email","brazilserverop9@gmail.com","#00AACC"]].map(([p,v,c])=>(
            <div key={p} style={{ background:`${c}08`, border:`1px solid ${c}25`, borderRadius:10, padding:"10px 16px" }}>
              <div style={{ fontSize:9, color:c, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, marginBottom:4 }}>{p}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontFamily:"'Inter',sans-serif" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:"center" }}>
        <button onClick={()=>setPage("home")} style={{ background:"linear-gradient(135deg,#00AACC,#0088AA)", color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 20px rgba(0,212,255,0.22)" }}>
          Analyze My Channel Free →
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════ PRIVACY PAGE ══════════════════════════════════ */
const PrivacyPage = ({ isMobile }) => {
  const pad = isMobile ? 14 : 24;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const Sec = ({ title, children }) => (
    <div style={{ marginBottom:32 }}>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:10, letterSpacing:-0.2 }}>{title}</h3>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.42)", lineHeight:1.9, fontFamily:"'Inter',sans-serif" }}>{children}</div>
    </div>
  );
  const Li = ({ children }) => (
    <div style={{ display:"flex", gap:10, marginBottom:7, alignItems:"flex-start" }}>
      <span style={{ color:"#00D4FF", fontSize:14, flexShrink:0, marginTop:1 }}>›</span>
      <span>{children}</span>
    </div>
  );
  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:`56px ${pad}px 80px`, animation:"slideUp .5s ease" }}>
      <div style={{ marginBottom:44 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:16 }}>
          <span style={{ fontSize:10, color:"#00D4FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>LEGAL</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,5vw,44px)", fontWeight:800, color:"#fff", letterSpacing:-1, marginBottom:10, lineHeight:1.1 }}>Privacy Policy</h1>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.28)", fontFamily:"'DM Mono',monospace" }}>Last updated: {today}</p>
      </div>
      <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:14, padding:"16px 20px", marginBottom:36, display:"flex", gap:12, alignItems:"flex-start" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🔒</span>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif", margin:0 }}>
          <strong style={{ color:"#00D4FF" }}>Short version:</strong> MonetizeCheck does not collect personal data, does not require login, and does not store anything about you or your YouTube channel.
        </p>
      </div>
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:isMobile?20:36 }}>
        <Sec title="1. Introduction">
          <p style={{ marginBottom:10 }}>MonetizeCheck ("we", "our", "us") is a free tool created by FFDRYT to help YouTube creators assess their channel's monetization eligibility.</p>
        </Sec>
        <Sec title="2. Information We Do NOT Collect">
          <p style={{ marginBottom:12 }}>We do <strong style={{ color:"rgba(255,255,255,0.75)" }}>not</strong> collect, store, or process:</p>
          <Li>Your name, email address, or any personal identifiers</Li>
          <Li>YouTube account credentials or private channel data</Li>
          <Li>OAuth tokens or any YouTube account authorization</Li>
          <Li>Payment information of any kind</Li>
        </Sec>
        <Sec title="3. Information We DO Process">
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Publicly available channel data</strong> — channel name, subscriber count, video titles, upload dates visible on the public YouTube page.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>The URL you submit</strong> — used solely to identify which channel to analyze. Not stored after analysis.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Basic usage analytics</strong> — anonymous, aggregated data with no personally identifiable information.</Li>
        </Sec>
        <Sec title="4. Data Retention">
          <p>We do not store personal data or channel reports. Each analysis is processed in real time and results exist only in your browser session.</p>
        </Sec>
        <Sec title="5. Contact Us">
          <p style={{ marginBottom:16 }}>Questions? Reach out to FFDRYT at brazilserverop9@gmail.com</p>
        </Sec>
      </div>
    </div>
  );
};

/* ══════════════════════════ HOME EDUCATIONAL CONTENT ══════════════════════ */
const HomeEducationalContent = ({ isMobile, isTablet, setPage }) => {
  const P = ({ children }) => <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.9, marginBottom:14, fontFamily:"'Inter',sans-serif", fontWeight:300 }}>{children}</p>;
  return (
    <section style={{ padding:`${isMobile?48:80}px 0`, borderTop:"1px solid rgba(0,212,255,0.06)" }}>
      <div style={{ marginBottom:56 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,136,204,0.07)", border:"1px solid rgba(0,136,204,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:20 }}>
          <span style={{ fontSize:10, color:"#0088AA", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>YOUTUBE PARTNER PROGRAM · EXPLAINED</span>
        </div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,4vw,38px)", fontWeight:800, color:"#fff", letterSpacing:-1, marginBottom:18, lineHeight:1.1, maxWidth:680 }}>What Is the YouTube Partner Program and Who Qualifies?</h2>
        <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:isMobile?0:32 }}>
          <div>
            <P>The YouTube Partner Program (YPP) is Google's official system for sharing advertising revenue with YouTube creators. When approved, you receive approximately 55% of the ad revenue generated on your videos.</P>
            <P>To qualify in 2025, your channel needs: at least 1,000 subscribers, at least 4,000 valid public watch hours in the past 12 months, no active Community Guidelines strikes, and an active Google AdSense account linked to your channel.</P>
          </div>
          <div>
            <P>What many creators don't realize is that meeting the numbers is only the first step. YouTube's reviewers evaluate content originality, ad-friendliness, niche consistency, and many other signals beyond basic metrics.</P>
            <P>This is where MonetizeCheck comes in. Our AI evaluates your channel against all dimensions simultaneously and gives you a score out of 100 with a specific action plan.</P>
          </div>
        </div>
      </div>

      <div style={{ marginBottom:56 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(20px,3vw,32px)", fontWeight:800, color:"#fff", letterSpacing:-0.8, marginBottom:20, lineHeight:1.2 }}>The 4 YPP Requirements — In Detail</h2>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?1:2},1fr)`, gap:12 }}>
          {[
            { icon:"👥", color:"#00D4FF", title:"1,000 Subscribers", body:"You need 1,000 real, organic subscribers. YouTube actively detects and removes sub-for-sub and purchased subscribers." },
            { icon:"⏱", color:"#0088AA", title:"4,000 Watch Hours (12 months)", body:"Only watch time from public, long-form videos counts. Shorts, private videos, and deleted videos are excluded." },
            { icon:"🛡", color:"#F5A623", title:"No Active Community Strikes", body:"A single active Community Guidelines strike disqualifies your application. Strikes expire after 90 days." },
            { icon:"💳", color:"#A78BFA", title:"Linked AdSense Account", body:"An active Google AdSense account must be linked before you can receive payments." },
          ].map(r=>(
            <div key={r.title} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"22px 20px", display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:46, height:46, background:`${r.color}14`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:`1px solid ${r.color}25` }}>{r.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.88)", marginBottom:8, fontFamily:"'Syne',sans-serif" }}>{r.title}</div>
                <P>{r.body}</P>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"rgba(0,136,204,0.04)", border:"1px solid rgba(0,136,204,0.16)", borderRadius:20, padding:isMobile?20:36, textAlign:"center" }}>
        <div style={{ fontSize:26, marginBottom:12 }}>📖</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:10 }}>Want the Full YPP Strategy Guide?</h3>
        <P>Read our complete guide covering every aspect of YouTube monetization.</P>
        <button onClick={()=>setPage("guide")} style={{ background:"rgba(0,136,204,0.12)", color:"#0088AA", border:"1px solid rgba(0,136,204,0.3)", borderRadius:12, padding:"12px 28px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          Read the Full Guide →
        </button>
      </div>
    </section>
  );
};

/* ══════════════════════════ HOME PAGE ═════════════════════════════════════ */
const HomePage = ({ isMobile, isTablet, isDesktop, setPage }) => {
  const [url, setUrl]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [data, setData]           = useState(null);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied]       = useState(false);
  const inputRef = useRef(null);
  const STEPS = ["Connecting to channel…","Scanning video library…","Auditing policy compliance…","Calculating monetization score…","Generating your action plan…"];

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const t = setInterval(() => setLoadingStep(s=>(s+1)%STEPS.length), 1500);
    return () => clearInterval(t);
  }, [loading]);

  const analyze = async () => {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    setLoading(true); setError(""); setData(null);
    try {
      const res  = await fetch("/api/analyze", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ url }) });
      const text = await res.text();
      let json; try { json = JSON.parse(text); } catch { throw new Error("Invalid server response."); }
      if (!res.ok) throw new Error(json.error || "Server error.");
      setData(json); setActiveTab("overview");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const copyResult = () => {
    if (!data) return;
    navigator.clipboard.writeText(`MonetizeCheck Report — ${data.channel?.name}\nScore: ${data.monetizationEligibility?.overallScore}/100\nVerdict: ${data.monetizationEligibility?.verdict}\n\n${data.summary}`);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  const showDownload = data && ["NOT_ELIGIBLE","BORDERLINE"].includes(data.monetizationEligibility?.verdict);
  const P = isMobile ? 14 : 24;

  return (
    <div style={{ maxWidth:1080, margin:"0 auto", padding:`0 ${P}px` }}>
      <section style={{ padding:`${isMobile?40:76}px 0 ${isMobile?28:52}px`, animation:"slideUp .6s ease" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:24, padding:"6px 14px", marginBottom:isMobile?18:26 }}>
          <span style={{ fontSize:11 }}>✦</span>
          <span style={{ fontSize:isMobile?10:11, color:"#00D4FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>FREE AI-POWERED ANALYZER</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(30px,7vw,66px)", fontWeight:800, color:"#fff", lineHeight:1.06, letterSpacing:-2, marginBottom:16, maxWidth:680 }}>
          Is Your Channel<br/>
          <span style={{ background:"linear-gradient(135deg,#00D4FF 0%,#7EEEFF 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Ready to Earn?</span>
        </h1>
        <p style={{ fontSize:isMobile?14:16, color:"rgba(255,255,255,0.38)", lineHeight:1.8, maxWidth:520, marginBottom:isMobile?28:44, fontWeight:300, fontFamily:"'Inter',sans-serif" }}>
          Paste your YouTube channel URL and get a full monetization eligibility report — subscriber count, watch hours, policy compliance, and a personalized action plan. Free, instant, no login required.
        </p>
        <div style={{ display:"flex", gap:isMobile?20:32, marginBottom:isMobile?32:46, flexWrap:"wrap" }}>
          {[["10K+","Analyzed"],["4.9★","Rating"],["100%","Free"],["<30s","Results"]].map(([v,l])=>(
            <div key={l}>
              <div style={{ fontSize:isMobile?17:21, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", letterSpacing:-1 }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.28)", marginTop:2, fontFamily:"'Inter',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isMobile?148:170}px,1fr))`, gap:10, marginBottom:isMobile?28:46 }}>
          {[
            { icon:"◉", color:"#00D4FF", title:"Monetization Score",   desc:"AI eligibility score out of 100" },
            { icon:"◈", color:"#0088AA", title:"YPP Requirements",     desc:"Subs, watch hours & account check" },
            { icon:"▦", color:"#A78BFA", title:"Video-by-Video Audit", desc:"Ad score and issue flags per video" },
            { icon:"◻", color:"#F5A623", title:"Policy Compliance",    desc:"Copyright & guidelines scan" },
            { icon:"▲", color:"#FF4757", title:"Personalized Plan",    desc:"Step-by-step fixes by priority" },
            { icon:"⬡", color:"#00D4FF", title:"Download Report",      desc:"Export full .docx report" },
          ].map(f=><FeatureCard key={f.title} {...f} accent={f.color}/>)}
        </div>
      </section>

      <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(0,212,255,0.12)", borderRadius:18, padding:`${isMobile?18:24}px ${isMobile?14:26}px`, marginBottom:16, backdropFilter:"blur(12px)" }}>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.22)", letterSpacing:2.5, marginBottom:12, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>Enter YouTube Channel URL or Handle</div>
        <div style={{ display:"flex", gap:10, flexDirection:isMobile?"column":"row" }}>
          <input ref={inputRef} value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}
            placeholder="youtube.com/@channel  ·  @handle  ·  UC..."
            style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 16px", color:"rgba(255,255,255,0.85)", fontSize:14, fontFamily:"'Inter',sans-serif", transition:"border .2s, box-shadow .2s", width:"100%", outline:"none" }}/>
          <button className="btn-primary" onClick={analyze} disabled={loading}
            style={{ background:loading?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#00AACC,#0088AA)", color:loading?"rgba(255,255,255,0.25)":"#fff", border:"none", borderRadius:12, padding:isMobile?"14px":"14px 26px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:loading?"not-allowed":"pointer", letterSpacing:0.3, whiteSpace:"nowrap", boxShadow:loading?"none":"0 4px 20px rgba(0,212,255,0.22)", transition:"all .2s", width:isMobile?"100%":"auto" }}>
            {loading?"Analyzing…":"Analyze Channel →"}
          </button>
          {data && (
            <button onClick={()=>{ setData(null); setUrl(""); setError(""); }}
              style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 18px", color:"rgba(255,255,255,0.35)", fontFamily:"'Inter',sans-serif", fontSize:13, cursor:"pointer", transition:"all .2s", width:isMobile?"100%":"auto" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; e.currentTarget.style.color="rgba(255,255,255,0.7)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.35)"; }}>
              ✕ Reset
            </button>
          )}
        </div>
        {error && (
          <div style={{ marginTop:12, padding:"12px 14px", background:"rgba(255,71,87,0.08)", border:"1px solid rgba(255,71,87,0.2)", borderRadius:10, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:"#FF4757", fontSize:14, flexShrink:0 }}>⚠</span>
            <span style={{ fontSize:12, color:"rgba(255,71,87,0.9)" }}>{error}</span>
          </div>
        )}
        <div style={{ marginTop:10, fontSize:10, color:"rgba(255,255,255,0.1)", fontFamily:"'DM Mono',monospace" }}>Accepts: youtube.com/@handle · youtube.com/c/name · @handle · UCxxxxx channel ID</div>
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"72px 20px", animation:"fadeIn .4s ease" }}>
          <div style={{ position:"relative", width:70, height:70, margin:"0 auto 26px" }}>
            <div style={{ width:70, height:70, border:"2px solid rgba(255,255,255,0.05)", borderTop:"2px solid #00D4FF", borderRadius:"50%", animation:"spin .9s linear infinite" }}/>
            <div style={{ position:"absolute", inset:10, border:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(0,212,255,0.3)", borderRadius:"50%", animation:"spin 1.8s linear infinite reverse" }}/>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 14px #00D4FF" }}/>
          </div>
          <div style={{ fontSize:12, color:"#00D4FF", letterSpacing:2, marginBottom:14, animation:"pulse 1.6s ease infinite", fontFamily:"'DM Mono',monospace" }}>{STEPS[loadingStep]}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:10 }}>
            {STEPS.map((_,i)=><div key={i} style={{ width:isMobile?18:28, height:3, background:i<=loadingStep?"#00D4FF":"rgba(255,255,255,0.07)", borderRadius:2, transition:"background .4s" }}/>)}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"'DM Mono',monospace" }}>Usually takes 10–25 seconds</div>
        </div>
      )}

      {data && (() => {
        const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
        const vc = getVerdictConfig(me?.verdict);
        return (
          <div style={{ animation:"slideUp .5s ease" }}>
            <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:`${isMobile?16:22}px ${isMobile?14:24}px`, marginBottom:12 }}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:isMobile?"wrap":"nowrap" }}>
                <div style={{ width:54, height:54, background:"linear-gradient(135deg,#00D4FF,#0088AA)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#fff", flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{channel?.name?.[0]?.toUpperCase()||"Y"}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:isMobile?17:20, fontWeight:800, color:"#fff", letterSpacing:-0.5, marginBottom:8, fontFamily:"'Syne',sans-serif", wordBreak:"break-word" }}>{channel?.name}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <Pill color="rgba(0,212,255,0.3)">{channel?.handle}</Pill>
                    <Pill>{channel?.category}</Pill>
                    <Pill>{channel?.country}</Pill>
                    {!isMobile&&<Pill>Joined {channel?.joinedDate}</Pill>}
                  </div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:8, marginTop:14 }}>
                <StatCard label="Subscribers" value={channel?.subscribers} color="#00D4FF"/>
                <StatCard label="Total Videos" value={channel?.totalVideos}/>
                <StatCard label="Total Views"  value={channel?.totalViews}/>
                <StatCard label="Avg / Video"  value={channel?.avgViewsPerVideo}/>
              </div>
            </div>

            <div style={{ background:vc.bg, border:`1px solid ${vc.border}`, borderRadius:18, padding:`${isMobile?18:24}px ${isMobile?14:26}px`, marginBottom:12, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle,${vc.color}10,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16, alignItems:"flex-start" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, flexWrap:"wrap" }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${vc.color}18`, border:`1px solid ${vc.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, color:vc.color, fontWeight:900, flexShrink:0 }}>{vc.icon}</div>
                    <div>
                      <div style={{ fontSize:isMobile?17:20, fontWeight:800, color:vc.color, letterSpacing:-0.5, fontFamily:"'Syne',sans-serif" }}>{vc.label}</div>
                      <Pill color={`${vc.color}50`}>{vc.tag}</Pill>
                    </div>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:isMobile?13:14, lineHeight:1.8, maxWidth:500, marginBottom:16, fontFamily:"'Inter',sans-serif" }}>{summary}</p>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {showDownload && (
                      <button onClick={()=>downloadReport(data,setDownloading)} disabled={downloading}
                        style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,136,204,0.09)", color:downloading?"rgba(255,255,255,0.3)":"#0088AA", border:"1px solid rgba(0,136,204,0.22)", borderRadius:10, padding:"10px 16px", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:12, cursor:downloading?"not-allowed":"pointer", transition:"all .2s", width:isMobile?"100%":"auto", justifyContent:"center" }}>
                        ↓ {downloading?"Building…":"Download Report (.docx)"}
                      </button>
                    )}
                    <button onClick={copyResult} style={{ background:"rgba(255,255,255,0.04)", color:copied?"#00D4FF":"rgba(255,255,255,0.35)", border:`1px solid ${copied?"rgba(0,212,255,0.28)":"rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"10px 16px", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", transition:"all .2s", fontWeight:500, width:isMobile?"100%":"auto" }}>
                      {copied?"✓ Copied!":"⎘ Copy Summary"}
                    </button>
                  </div>
                </div>
                {!isMobile && (
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <RadialScore score={me?.overallScore||0} size={104}/>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:2, marginTop:6, fontFamily:"'DM Mono',monospace" }}>OVERALL SCORE</div>
                  </div>
                )}
              </div>
              {isMobile && (
                <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:14, padding:"12px 14px", background:"rgba(255,255,255,0.03)", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }}>
                  <RadialScore score={me?.overallScore||0} size={58}/>
                  <div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", fontFamily:"'DM Mono',monospace", letterSpacing:2, marginBottom:4 }}>OVERALL SCORE</div>
                    <div style={{ fontSize:22, fontWeight:800, color:vc.color, fontFamily:"'Syne',sans-serif" }}>{me?.overallScore}/100</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:8, marginBottom:12 }}>
              {[
                { lbl:"Subscribers", met:me?.ytpRequirements?.subscribers?.met, req:"1,000 min" },
                { lbl:"Watch Hours", met:me?.ytpRequirements?.watchHours?.met, req:"4,000 hrs" },
                { lbl:"Guidelines",  met:me?.ytpRequirements?.communityGuidelines?.met, req:"No violations" },
                { lbl:"AdSense",     met:me?.ytpRequirements?.adsenseLinked?.met, req:"Must be linked" },
              ].map(s=>(
                <div key={s.lbl} style={{ background:`${s.met?"rgba(0,212,255,0.04)":"rgba(255,71,87,0.04)"}`, border:`1px solid ${s.met?"rgba(0,212,255,0.14)":"rgba(255,71,87,0.14)"}`, borderRadius:12, padding:"13px 14px" }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.22)", letterSpacing:1.5, marginBottom:8, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>{s.lbl}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:s.met?"#00D4FF":"#FF4757", boxShadow:`0 0 7px ${s.met?"#00D4FF":"#FF4757"}`, flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:s.met?"#00D4FF":"#FF4757", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{s.met?"Pass":"Fail"}</span>
                  </div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.18)", fontFamily:"'DM Mono',monospace" }}>{s.req}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:16, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
              {[{ id:"overview",l:"Overview"},{ id:"videos",l:`Videos (${videos?.length||0})`},{ id:"policy",l:"Policy"},{ id:"tips",l:"Action Plan"},{ id:"timeline",l:"Roadmap"},{ id:"faq",l:"FAQ"}].map(t=>(
                <button key={t.id} className="tab-btn" onClick={()=>setActiveTab(t.id)}
                  style={{ background:"none", border:"none", borderBottom:activeTab===t.id?"2px solid #00D4FF":"2px solid transparent", color:activeTab===t.id?"#00D4FF":"rgba(255,255,255,0.28)", padding:`10px ${isMobile?11:16}px`, fontFamily:"'Inter',sans-serif", fontSize:isMobile?11:12, fontWeight:600, cursor:"pointer", marginBottom:-1, whiteSpace:"nowrap", transition:"color .2s" }}>
                  {t.l}
                </button>
              ))}
            </div>

            {activeTab==="overview" && (
              <div style={{ display:"grid", gridTemplateColumns:isDesktop?"1fr 1fr":"1fr", gap:12 }}>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 8px #00D4FF" }}/>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.28)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>YPP Requirements</span>
                  </div>
                  {me?.ytpRequirements && Object.entries(me.ytpRequirements).map(([key,val])=>(
                    <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <div>
                        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textTransform:"capitalize", fontFamily:"'Inter',sans-serif" }}>{key.replace(/([A-Z])/g," $1")}</div>
                        {val.required!=null&&<div style={{ fontSize:10, color:"rgba(255,255,255,0.18)", marginTop:2, fontFamily:"'DM Mono',monospace" }}>need {val.required?.toLocaleString()} · est {val.estimated?.toLocaleString()}</div>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:val.met?"#00D4FF":"#FF4757", boxShadow:`0 0 6px ${val.met?"#00D4FF":"#FF4757"}` }}/>
                        <span style={{ fontSize:10, color:val.met?"#00D4FF":"#FF4757", fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>{val.met?"PASS":"FAIL"}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#F5A623", boxShadow:"0 0 8px #F5A623" }}/>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.28)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>Content Analysis</span>
                  </div>
                  {me?.contentAnalysis && Object.entries(me.contentAnalysis).map(([key,val])=>(
                    <ScoreBar key={key} label={key.replace(/([A-Z])/g," $1")} score={val.score} notes={val.notes}/>
                  ))}
                </div>
              </div>
            )}

            {activeTab==="videos" && (
              <div>
                <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                  <div style={{ background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.18)", borderRadius:10, padding:"7px 14px", fontSize:11, color:"#00D4FF", fontFamily:"'DM Mono',monospace", letterSpacing:1.5 }}>✓ {(videos||[]).filter(v=>v.monetizable).length} Monetizable</div>
                  <div style={{ background:"rgba(255,71,87,0.07)", border:"1px solid rgba(255,71,87,0.18)", borderRadius:10, padding:"7px 14px", fontSize:11, color:"#FF4757", fontFamily:"'DM Mono',monospace", letterSpacing:1.5 }}>✕ {(videos||[]).filter(v=>!v.monetizable).length} Blocked</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(videos||[]).map((v,i)=>(
                    <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${v.monetizable?"rgba(255,255,255,0.07)":"rgba(255,71,87,0.15)"}`, borderRadius:14, padding:`${isMobile?12:16}px ${isMobile?12:18}px`, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <div style={{ width:42, height:42, background:v.monetizable?"rgba(0,212,255,0.08)":"rgba(255,71,87,0.08)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, border:`1px solid ${v.monetizable?"rgba(0,212,255,0.14)":"rgba(255,71,87,0.14)"}` }}>{v.monetizable?"💰":"🚫"}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", marginBottom:4, fontWeight:500, fontFamily:"'Inter',sans-serif" }}>{v.title}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.24)", fontFamily:"'DM Mono',monospace" }}>{v.uploadDate} · {v.duration} · {v.views} views</div>
                        {v.issues?.length>0&&<div style={{ fontSize:10, color:"#FF4757", marginTop:4, fontFamily:"'DM Mono',monospace" }}>⚠ {v.issues.join(" · ")}</div>}
                      </div>
                      <div style={{ textAlign:"center", flexShrink:0 }}>
                        <RadialScore score={v.score||0} size={isMobile?46:52}/>
                        <div style={{ fontSize:7, color:"rgba(255,255,255,0.2)", letterSpacing:1.5, marginTop:2, fontFamily:"'DM Mono',monospace" }}>AD SCORE</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab==="policy" && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:isMobile?16:22 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:"#0088AA", boxShadow:"0 0 8px #0088AA" }}/>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.28)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>Policy Compliance Audit</span>
                </div>
                {me?.policyCompliance && Object.entries(me.policyCompliance).map(([key,val])=>{
                  const good = val===true||val==="CLEAN"||val==="SAFE"||val==="LOW"||(typeof val==="boolean"&&!val&&(key==="communityStrike"||key==="ageRestricted"));
                  return (
                    <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:good?"#00D4FF":"#FF4757", boxShadow:`0 0 6px ${good?"#00D4FF":"#FF4757"}`, flexShrink:0 }}/>
                        <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13, textTransform:"capitalize", fontFamily:"'Inter',sans-serif" }}>{key.replace(/([A-Z])/g," $1")}</span>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, color:good?"#00D4FF":"#FF4757", background:good?"rgba(0,212,255,0.08)":"rgba(255,71,87,0.08)", padding:"5px 12px", borderRadius:8, border:`1px solid ${good?"rgba(0,212,255,0.2)":"rgba(255,71,87,0.2)"}`, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, whiteSpace:"nowrap" }}>
                        {typeof val==="boolean"?(key==="communityStrike"||key==="ageRestricted"?(!val?"PASS":"FAIL"):(val?"PASS":"FAIL")):val}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab==="tips" && (
              <div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.18)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", marginBottom:14, textAlign:"center" }}>FOLLOW THESE STEPS TO QUALIFY FOR MONETIZATION</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(recommendations||[]).map((tip,i)=>{
                    const ac=i<3?"#FF4757":i<6?"#F5A623":"#00D4FF";
                    return (
                      <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:`${isMobile?13:17}px ${isMobile?13:19}px`, display:"flex", gap:13, alignItems:"flex-start", transition:"border .2s" }}
                        onMouseEnter={e=>e.currentTarget.style.border=`1px solid ${ac}22`}
                        onMouseLeave={e=>e.currentTarget.style.border="1px solid rgba(255,255,255,0.06)"}>
                        <div style={{ width:32, height:32, background:`${ac}12`, border:`1px solid ${ac}25`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:ac, flexShrink:0, fontFamily:"'DM Mono',monospace" }}>{String(i+1).padStart(2,"0")}</div>
                        <p style={{ margin:0, color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.8, fontFamily:"'Inter',sans-serif", paddingTop:5 }}>{tip}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab==="timeline" && (
              <div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.18)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", marginBottom:22, textAlign:"center" }}>ESTIMATED ROADMAP TO MONETIZATION</div>
                {[
                  { time:"Week 1–2",  goal:"Fix Policy Issues",        desc:"Resolve copyright strikes, remove or edit violating content, appeal community guideline warnings in YouTube Studio.", color:"#FF4757" },
                  { time:"Month 1",   goal:"Improve Content Quality",  desc:"Create 4–8 high-quality original videos with strong hooks, clear audio, and good production value.", color:"#FF8C42" },
                  { time:"Month 2–3", goal:"Build Watch Hours",        desc:"Upload 2–3× per week. Aim for 8–15 minute videos, create playlists to chain watch time.", color:"#F5A623" },
                  { time:"Month 3–6", goal:"Reach 1,000 Subscribers", desc:"Promote on Reddit and niche communities. Collaborate with creators. Optimize thumbnails and titles.", color:"#A3E635" },
                  { time:"Month 4–6", goal:"Reach 4,000 Watch Hours",  desc:"Repurpose videos into Shorts, focus on evergreen topics, use strong end-screen CTAs.", color:"#00D4FF" },
                  { time:"Month 6+",  goal:"Apply for YPP",            desc:"Verify all requirements in YouTube Studio. Link AdSense account. Submit and await review.", color:"#0088AA" },
                ].map((s,i,arr)=>(
                  <div key={i} style={{ display:"flex" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:isMobile?14:20, flexShrink:0 }}>
                      <div style={{ width:11, height:11, borderRadius:"50%", background:s.color, boxShadow:`0 0 10px ${s.color}`, marginTop:4, flexShrink:0 }}/>
                      {i<arr.length-1&&<div style={{ width:1, flex:1, minHeight:36, background:`linear-gradient(${s.color}40,${arr[i+1].color}40)` }}/>}
                    </div>
                    <div style={{ paddingBottom:i<arr.length-1?22:0, flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, color:s.color, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, fontWeight:600 }}>{s.time}</span>
                        <div style={{ height:1, width:16, background:`${s.color}40` }}/>
                        <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>{s.goal}</span>
                      </div>
                      <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.3)", lineHeight:1.8, maxWidth:500, fontFamily:"'Inter',sans-serif" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab==="faq" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { q:"How accurate is this analysis?", a:"MonetizeCheck uses AI to estimate eligibility based on publicly available data and YouTube's official YPP guidelines. It's a strong directional indicator, but final decisions are made by YouTube's review team." },
                  { q:"Does this tool access my private YouTube data?", a:"No. MonetizeCheck only reads publicly available channel information. It does not require login, OAuth, or any YouTube account access." },
                  { q:"Why does my score differ from YouTube Studio?", a:"YouTube Studio shows your exact numbers, while MonetizeCheck estimates from public data. Watch hours are particularly hard to estimate — treat this as a guide, not a guarantee." },
                  { q:"What is the YouTube Partner Program (YPP)?", a:"YPP lets creators monetize with ads, memberships, and Super Thanks. Requirements: 1,000 subscribers, 4,000 public watch hours in 12 months, no active strikes, and a linked AdSense account." },
                  { q:"My channel qualifies — why was I rejected?", a:"YouTube's human reviewers check for ad-friendly content and spam signals beyond basic metrics. Review the Action Plan tab for content improvement tips." },
                  { q:"Does Shorts watch time count toward the 4,000 hours?", a:"No. YouTube Shorts views and watch time do not count toward the 4,000 public watch hours required for standard YPP eligibility. Only long-form public videos count." },
                  { q:"Can I use MonetizeCheck for multiple channels?", a:"Yes. You can analyze as many channels as you like — just paste a different URL each time. There are no limits." },
                ].map((item,i)=>(
                  <details key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden" }}>
                    <summary style={{ padding:`${isMobile?13:17}px ${isMobile?14:20}px`, cursor:"pointer", fontSize:isMobile?13:14, color:"rgba(255,255,255,0.75)", fontWeight:600, listStyle:"none", display:"flex", justifyContent:"space-between", alignItems:"center", userSelect:"none", fontFamily:"'Inter',sans-serif" }}>
                      {item.q}
                      <span style={{ color:"rgba(255,255,255,0.25)", fontSize:18, flexShrink:0, marginLeft:10 }}>+</span>
                    </summary>
                    <div style={{ padding:`0 ${isMobile?14:20}px ${isMobile?13:17}px`, fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.8, borderTop:"1px solid rgba(255,255,255,0.05)", fontFamily:"'Inter',sans-serif" }}>{item.a}</div>
                  </details>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {!data && !loading && (
        <HomeEducationalContent isMobile={isMobile} isTablet={isTablet} setPage={setPage}/>
      )}

      {!data&&!loading&&(
        <div style={{ textAlign:"center", padding:"20px 0 20px", borderTop:"1px solid rgba(0,212,255,0.04)", marginTop:8 }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.08)", letterSpacing:3, animation:"pulse 4s ease infinite", fontFamily:"'DM Mono',monospace" }}>▶ ENTER A CHANNEL URL ABOVE TO BEGIN</div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════ ROOT APP ══════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [loaderDone, setLoaderDone] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  useEffect(() => { injectFonts(); injectFavicon(); }, []);
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [page]);

  return (
    <>
      {!loaderDone && <Loader onDone={() => setLoaderDone(true)} />}
      <div style={{
        minHeight:"100vh", background:"#060D1A", color:"rgba(255,255,255,0.75)",
        fontFamily:"'Inter',sans-serif", overflowX:"hidden",
        opacity: loaderDone ? 1 : 0,
        transition: loaderDone ? "opacity 0.5s ease" : "none",
      }}>
        <style>{`
          * { box-sizing:border-box; margin:0; padding:0; }
          ::-webkit-scrollbar { width:5px; }
          ::-webkit-scrollbar-track { background:#060D1A; }
          ::-webkit-scrollbar-thumb { background:#0D2233; border-radius:3px; }
          input::placeholder { color:rgba(255,255,255,0.18); }
          @keyframes spin    { to { transform:rotate(360deg); } }
          @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
          @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
          @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          .btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg,#00D4FF,#00AACC) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 32px rgba(0,212,255,0.28) !important;
          }
          .tab-btn:hover { color:rgba(255,255,255,0.65) !important; }
          input:focus {
            border-color: rgba(0,212,255,0.45) !important;
            box-shadow: 0 0 0 3px rgba(0,212,255,0.08) !important;
            outline: none;
          }
          details summary::-webkit-details-marker { display:none; }
        `}</style>

        <AmbientBg/>
        <div style={{ position:"relative", zIndex:1 }}>
          <Navbar page={page} setPage={setPage} isMobile={isMobile} isDesktop={isDesktop}/>
          {page==="home"    && <HomePage    isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} setPage={setPage}/>}
          {page==="about"   && <AboutPage   isMobile={isMobile} isTablet={isTablet} setPage={setPage}/>}
          {page==="guide"   && <GuidePage   isMobile={isMobile} isTablet={isTablet} setPage={setPage}/>}
          {page==="privacy" && <PrivacyPage isMobile={isMobile}/>}
          <Footer setPage={setPage} isMobile={isMobile}/>
        </div>
      </div>
    </>
  );
}
