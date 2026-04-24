import { useState, useEffect, useRef } from "react";

// ============================================================
// FONT & STYLE INJECTIONS - MASSIVE TYPOGRAPHY
// ============================================================
function injectFonts() {
  if (document.getElementById("mc-fonts")) return;
  const link = document.createElement("link");
  link.id = "mc-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=DM+Mono:wght@300;400;500&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

function injectLoaderFonts() {
  if (document.getElementById("ld-fonts")) return;
  const link = document.createElement("link");
  link.id = "ld-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap";
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
  document.title = "MonetizeCheck – AI YouTube Monetization Analyzer | FFDRYT";
  
  const metas = [
    { name: "description", content: "Free AI tool to check if your YouTube channel is ready to monetize. Get eligibility score, YPP requirements, personalized action plan instantly." },
    { property: "og:title", content: "MonetizeCheck – The Ultimate YouTube Monetization Checker" },
    { property: "og:description", content: "Paste your YouTube URL and get a full monetization eligibility report. Free, instant, no login required." },
    { property: "og:image", content: "https://ytmonetizecheck.in/logo.jpg" },
    { property: "og:url", content: "https://ytmonetizecheck.in" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  metas.forEach(attrs => {
    const m = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => m.setAttribute(k, v));
    document.head.appendChild(m);
  });
}

// ============================================================
// CUSTOM HOOKS
// ============================================================
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 480, isTablet: w < 768, isDesktop: w >= 768, w };
}

// ============================================================
// LOADER COMPONENT - HEAVY ANIMATIONS
// ============================================================
const Loader = ({ onDone }) => {
  const [pct, setPct] = useState(0);
  const [hiding, setHiding] = useState(false);
  useEffect(() => {
    injectLoaderFonts();
    const interval = setInterval(() => {
      setPct(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => { setHiding(true); setTimeout(onDone, 800); }, 400);
          return 100;
        }
        return Math.min(p + 2, 100);
      });
    }, 32);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      opacity: hiding ? 0 : 1, transition: "opacity 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
      pointerEvents: hiding ? "none" : "all",
    }}>
      <style>{`
        @keyframes ldSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes ldPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.94)}}
        @keyframes fadeInLd{to{opacity:1;transform:translateY(0)}}
        @keyframes ldFill{to{clip-path:inset(0 0% 0 0)}}
        @keyframes ldBar{to{width:100%}}
        @keyframes ldScan{from{top:-2px}to{top:100%}}
        @keyframes ldDotBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-12px);opacity:1}}
        @keyframes ldBarGrow{0%{height:6px}50%{height:28px}100%{height:6px}}
        @keyframes ldFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
        @keyframes ldGlowPulse{0%,100%{text-shadow:0 0 5px #00D4FF,0 0 10px #0088AA}50%{text-shadow:0 0 20px #00D4FF,0 0 30px #00AACC}}
        @keyframes ldBorderFlow{0%{background-position:0% 50%}100%{background-position:100% 50%}}
      `}</style>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 30% 40%, #0A1528 0%, #03060D 100%)",
      }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,212,255,0.1) 0%, transparent 70%)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,212,255,0.04)' stroke-width='1.5'%3E%3Ccircle cx='40' cy='40' r='30'/%3E%3Ccircle cx='40' cy='40' r='15'/%3E%3C/g%3E%3C/svg%3E\") repeat", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,transparent,#00D4FF,#7EEEFF,transparent)", animation:"ldBorderFlow 3s linear infinite" }}/>
        <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(0,212,255,.3),transparent)", animation:"ldScan 5s linear infinite", zIndex:1 }}/>

        <div style={{ width:100, height:100, borderRadius:"50%", border:"1px solid rgba(0,212,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:30, position:"relative", opacity:0, transform:"translateY(20px)", animation:"fadeInLd .6s .2s ease forwards", zIndex:2 }}>
          <div style={{ position:"absolute", inset:-8, borderRadius:"50%", border:"1px solid rgba(0,212,255,.2)", animation:"ldPulse 2.5s ease-in-out infinite" }}/>
          <img src="/logo.jpg" alt="MonetizeCheck" style={{ width:70, height:70, borderRadius:"50%", objectFit:"cover", animation:"ldFloat 3s ease-in-out infinite" }}/>
        </div>

        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem, 7vw, 5rem)", fontWeight:400, letterSpacing:".2em", color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,.2)", position:"relative", overflow:"hidden", textTransform:"uppercase", zIndex:2 }}>
          MonetizeCheck
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,#00D4FF,#7EEEFF,#00D4FF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", clipPath:"inset(0 100% 0 0)", animation:"ldFill 1.8s .5s cubic-bezier(.77,0,.175,1) forwards" }}>MonetizeCheck</div>
        </div>

        <div style={{ fontSize:".65rem", letterSpacing:".5em", textTransform:"uppercase", color:"rgba(0,212,255,.6)", marginTop:16, opacity:0, transform:"translateY(10px)", animation:"fadeInLd .6s 1.3s ease forwards", zIndex:2 }}>ytmonetizecheck.in · by ffdryt</div>
        
        <div style={{ display:"flex", gap:8, marginTop:32, opacity:0, animation:"fadeInLd .5s 1.6s ease forwards", zIndex:2 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#00D4FF", opacity:0.2 + i*0.15, animation:`ldPulse ${1 + i*0.3}s infinite alternate` }}/>
          ))}
        </div>

        <div style={{ position:"relative", width:80, height:80, marginTop:40, opacity:0, animation:"fadeInLd .5s .3s ease forwards", zIndex:2 }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid transparent", borderTopColor:"#00D4FF", borderRightColor:"#00D4FF", animation:"ldSpin 1.2s linear infinite" }}/>
          <div style={{ position:"absolute", inset:12, borderRadius:"50%", border:"3px solid transparent", borderBottomColor:"#00D4FF", borderLeftColor:"rgba(255,255,255,.05)", animation:"ldSpin .8s linear infinite reverse" }}/>
          <div style={{ position:"absolute", inset:26, borderRadius:"50%", border:"2px solid rgba(0,170,220,.7)", animation:"ldSpin 1.8s linear infinite" }}/>
          <div style={{ position:"absolute", inset:36, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 20px #00D4FF", animation:"ldPulse 1.5s infinite" }}/>
        </div>

        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:50, marginTop:30, opacity:0, animation:"fadeInLd .5s .4s ease forwards", zIndex:2 }}>
          {["#00D4FF","#0088AA","#00AACC","#00BBDD","#00D4FF"].map((bg,i) => (
            <div key={i} style={{ width:5, borderRadius:4, background:bg, animation:`ldBarGrow 1.2s ${i*0.1}s ease-in-out infinite` }}/>
          ))}
        </div>

        <div style={{ color:"rgba(255,255,255,.85)", fontSize:".9rem", fontWeight:500, marginTop:28, opacity:0, animation:"fadeInLd .5s .5s ease forwards", zIndex:2 }}>
          ANALYZING MONETIZATION STATUS
          <span style={{ display:"inline-flex", gap:5, marginLeft:6 }}>
            {[0,0.2,0.4].map(d => <span key={d} style={{ width:5, height:5, borderRadius:"50%", background:"#00D4FF", animation:`ldDotBounce 1.4s ${d}s infinite` }}/>)}
          </span>
        </div>

        <div style={{ width:360, height:2, background:"rgba(255,255,255,.08)", marginTop:32, overflow:"hidden", borderRadius:2, opacity:0, animation:"fadeInLd .5s .3s ease forwards", zIndex:2 }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#00D4FF,#7EEEFF,#00D4FF)", width:0, animation:"ldBar 2s .3s cubic-bezier(.77,0,.175,1) forwards" }}/>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"rgba(0,212,255,.6)", marginTop:14, letterSpacing:".3em", opacity:0, animation:"fadeInLd .5s .3s ease forwards", zIndex:2 }}>{pct}%</div>

        <div style={{ color:"#00D4FF", fontSize:".8rem", textAlign:"center", opacity:0, animation:"fadeInLd .5s .9s ease forwards", letterSpacing:".4px", marginTop:12, zIndex:2 }}>FROM A CREATOR TO A CREATOR</div>
        <div style={{ marginTop:48, fontSize:".7rem", color:"rgba(255,255,255,.2)", letterSpacing:4, opacity:0, animation:"fadeInLd .5s 1.1s forwards" }}>FFDRYT</div>
      </div>
    </div>
  );
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getScoreColor = (s) => s >= 75 ? "#00D4FF" : s >= 50 ? "#F5A623" : "#FF4757";
const getScoreGlow = (s) => s >= 75 ? "0 0 15px rgba(0,212,255,0.5)" : s >= 50 ? "0 0 15px rgba(245,166,35,0.5)" : "0 0 15px rgba(255,71,87,0.5)";
const getVerdictConfig = (v) => ({
  LIKELY_ELIGIBLE: { color:"#00D4FF", bg:"rgba(0,212,255,0.08)", border:"rgba(0,212,255,0.3)", label:"LIKELY ELIGIBLE", tag:"READY TO MONETIZE", icon:"✓" },
  BORDERLINE:      { color:"#F5A623", bg:"rgba(245,166,35,0.08)", border:"rgba(245,166,35,0.3)", label:"BORDERLINE", tag:"NEEDS IMPROVEMENT", icon:"⚠" },
  NOT_ELIGIBLE:    { color:"#FF4757", bg:"rgba(255,71,87,0.08)", border:"rgba(255,71,87,0.3)", label:"NOT ELIGIBLE", tag:"ACTION REQUIRED", icon:"✕" },
}[v] || { color:"#FF4757", bg:"rgba(255,71,87,0.08)", border:"rgba(255,71,87,0.3)", label:"NOT ELIGIBLE", tag:"ACTION REQUIRED", icon:"✕" });

// ============================================================
// WORD REPORT GENERATOR
// ============================================================
async function generateWordReport(data) {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat } =
    await import("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js");
  const { channel, monetizationEligibility: me, recommendations, summary } = data;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const ACCENT="00D4FF", DARK="060D1A";
  const cb = { style:BorderStyle.SINGLE, size:1, color:"E5E7EB" };
  const ab = { top:cb, bottom:cb, left:cb, right:cb };
  const h1 = t => new Paragraph({ heading:HeadingLevel.HEADING_1, spacing:{before:400,after:200}, children:[new TextRun({text:t,bold:true,size:40,color:DARK,font:"Arial"})] });
  const body = t => new Paragraph({ spacing:{before:80,after:80}, children:[new TextRun({text:t,size:24,font:"Arial",color:"374151"})] });
  const sp = () => new Paragraph({ spacing:{before:120,after:120}, children:[new TextRun("")] });
  const problems = [];
  if (me?.ytpRequirements) { 
    const r=me.ytpRequirements; 
    if(!r.subscribers?.met) problems.push(`Subscribers too low (~${r.subscribers?.estimated?.toLocaleString()||"?"}), need 1,000`); 
    if(!r.watchHours?.met) problems.push(`Watch hours insufficient (~${r.watchHours?.estimated?.toLocaleString()||"?"}), need 4,000`); 
    if(!r.communityGuidelines?.met) problems.push("Community Guidelines violations detected"); 
    if(!r.adsenseLinked?.met) problems.push("No AdSense account linked"); 
  }
  const doc = new Document({
    numbering:{config:[{reference:"nums",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
    styles:{default:{document:{run:{font:"Arial",size:24}}}},
    sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},children:[
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:720,after:120},children:[new TextRun({text:"MONETIZECHECK REPORT",bold:true,size:96,color:DARK,font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},children:[new TextRun({text:"YouTube Channel Monetization Eligibility Analysis",size:32,color:"9CA3AF",font:"Arial"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:480},children:[new TextRun({text:`${today} · Created by FFDRYT`,size:22,color:"D1D5DB",font:"Arial"})]}),
      sp(),h1("CHANNEL OVERVIEW"),
      new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[2800,6560],rows:[["Channel Name",channel?.name||"N/A"],["Handle",channel?.handle||"N/A"],["Category",channel?.category||"N/A"],["Subscribers",channel?.subscribers||"N/A"],["Total Videos",String(channel?.totalVideos||"N/A")],["Total Views",channel?.totalViews||"N/A"]].map(([l,v],i)=>new TableRow({children:[
        new TableCell({borders:ab,width:{size:2800,type:WidthType.DXA},shading:{fill:i%2===0?"F9FAFB":"FFFFFF",type:ShadingType.CLEAR},children:[new Paragraph({children:[new TextRun({text:l,bold:true,size:22,font:"Arial",color:"374151"})]})]}),
        new TableCell({borders:ab,width:{size:6560,type:WidthType.DXA},shading:{fill:i%2===0?"F9FAFB":"FFFFFF",type:ShadingType.CLEAR},children:[new Paragraph({children:[new TextRun({text:v,size:22,font:"Arial",color:"6B7280"})]})]})]}))}),
      sp(),h1("VERDICT & SUMMARY"),
      new Paragraph({shading:{fill:`${ACCENT}10`,type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:20,color:ACCENT}},spacing:{before:140,after:140},indent:{left:500},children:[new TextRun({text:`Verdict: ${me?.verdict||"N/A"} · Score: ${me?.overallScore||0}/100`,bold:true,size:26,font:"Arial",color:DARK})]}),
      sp(),body(summary||"No summary provided."),
      sp(),h1("ACTION PLAN"),sp(),
      ...(recommendations||[]).map(t=>new Paragraph({numbering:{reference:"nums",level:0},spacing:{before:80,after:80},children:[new TextRun({text:t,size:24,font:"Arial",color:"374151"})]})),
      sp(),sp(),
      new Paragraph({alignment:AlignmentType.CENTER,border:{top:{style:BorderStyle.SINGLE,size:4,color:"E5E7EB"}},spacing:{before:280},children:[new TextRun({text:`MonetizeCheck · ${today} · Not affiliated with YouTube or Google`,size:18,color:"9CA3AF",font:"Arial"})]})
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
  } catch { alert("Report generation failed. Please try again."); }
  setDownloading(false);
}

// ============================================================
// REUSABLE UI COMPONENTS
// ============================================================
const RadialScore = ({ score, size = 130 }) => {
  const r = size/2 - 12, circ = 2 * Math.PI * r, dash = (score/100) * circ;
  const col = getScoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", filter:`drop-shadow(${getScoreGlow(score)})`, flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1.6s cubic-bezier(.4,0,.2,1)" }}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform:`rotate(90deg)`, transformOrigin:`${size/2}px ${size/2}px`,
          fill:col, fontSize:size*0.28, fontWeight:900, fontFamily:"'DM Mono',monospace", letterSpacing:-2 }}>
        {score}
      </text>
    </svg>
  );
};

const ScoreBar = ({ label, score, notes }) => {
  const col = getScoreColor(score);
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, textTransform:"uppercase" }}>{label}</span>
        <span style={{ color:col, fontSize:12, fontWeight:800, background:`${col}18`, padding:"4px 12px", borderRadius:6, border:`1px solid ${col}30`, fontFamily:"'DM Mono',monospace" }}>{score}</span>
      </div>
      <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:5, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:`linear-gradient(90deg,${col}aa,${col})`, borderRadius:5, transition:"width 1.6s cubic-bezier(.4,0,.2,1)" }}/>
      </div>
      {notes && <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, margin:"8px 0 0", fontFamily:"'Inter',sans-serif", lineHeight:1.6 }}>{notes}</p>}
    </div>
  );
};

const Pill = ({ children, color = "rgba(255,255,255,0.2)" }) => (
  <span style={{ display:"inline-block", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:2, color:"rgba(255,255,255,0.6)",
    background:"rgba(255,255,255,0.04)", border:`1px solid ${color}`, padding:"6px 14px", borderRadius:30, textTransform:"uppercase", marginBottom:6 }}>
    {children}
  </span>
);

const StatCard = ({ label, value, color = "#fff" }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 16px", textAlign:"center", transition:"all 0.3s ease" }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(0,212,255,0.3)"; e.currentTarget.style.background="rgba(0,212,255,0.05)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}>
    <div style={{ fontSize:22, fontWeight:900, color, fontFamily:"'Syne',sans-serif", letterSpacing:-1 }}>{value}</div>
    <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:2.5, marginTop:6, textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, accent }) => (
  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:"28px 24px", transition:"all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)", cursor:"default" }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.border=`1px solid ${accent}60`; e.currentTarget.style.background=`${accent}08`; e.currentTarget.style.boxShadow=`0 20px 30px -15px ${accent}20`; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.border="1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.boxShadow="none"; }}>
    <div style={{ width:54, height:54, background:`${accent}18`, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:18, border:`1px solid ${accent}40`, transition:"all 0.3s" }}>{icon}</div>
    <div style={{ fontSize:16, fontWeight:800, color:"rgba(255,255,255,0.9)", marginBottom:10, fontFamily:"'Syne',sans-serif", letterSpacing:-0.3 }}>{title}</div>
    <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.8, fontFamily:"'Inter',sans-serif" }}>{desc}</div>
  </div>
);

const AmbientBg = () => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
    <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"60%", height:"60%", borderRadius:"50%",
      background:"radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)", animation:"floatLarge 18s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:"70%", height:"70%", borderRadius:"50%",
      background:"radial-gradient(circle, rgba(0,136,204,0.05) 0%, transparent 70%)", animation:"floatLarge 22s ease-in-out infinite reverse" }}/>
    <div style={{ position:"absolute", top:"40%", left:"20%", width:"40%", height:"40%", borderRadius:"50%",
      background:"radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)", animation:"floatMedium 15s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", inset:0,
      backgroundImage:"linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)",
      backgroundSize:"80px 80px" }}/>
    <style>{`
      @keyframes floatLarge { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(5%,3%) scale(1.05)} 66%{transform:translate(-3%,-2%) scale(0.98)} }
      @keyframes floatMedium { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-2%,4%)} }
    `}</style>
  </div>
);

// ============================================================
// NAVBAR
// ============================================================
const Navbar = ({ page, setPage, isMobile, isDesktop }) => {
  const [open, setOpen] = useState(false);
  const links = [{ id:"home", label:"HOME" }, { id:"about", label:"ABOUT" }, { id:"guide", label:"YPP GUIDE" }, { id:"privacy", label:"PRIVACY" }];
  return (
    <>
      <nav style={{ borderBottom:"1px solid rgba(0,212,255,0.12)", padding:`0 ${isMobile?20:48}px`, height:72, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(6,13,26,0.92)", backdropFilter:"blur(24px)", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer", flexShrink:0 }} onClick={()=>setPage("home")}>
          <img src="/logo.jpg" alt="MonetizeCheck" style={{ width:44, height:44, borderRadius:12, objectFit:"cover", boxShadow:"0 6px 20px rgba(0,212,255,0.3)" }}/>
          <div>
            <div style={{ fontSize:isMobile?16:20, fontWeight:900, color:"#fff", letterSpacing:-0.8, fontFamily:"'Syne',sans-serif", lineHeight:1.1 }}>Monetize<span style={{ color:"#00D4FF" }}>Check</span></div>
            <div style={{ fontSize:9, color:"rgba(0,212,255,0.7)", letterSpacing:3, fontFamily:"'DM Mono',monospace" }}>BY FFDRYT · AI POWERED</div>
          </div>
        </div>
        {isDesktop ? (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {links.map(l=>(
              <button key={l.id} onClick={()=>setPage(l.id)} style={{ background:"none", border:"none", borderBottom:page===l.id?"3px solid #00D4FF":"3px solid transparent", color:page===l.id?"#00D4FF":"rgba(255,255,255,0.4)", padding:"8px 20px", cursor:"pointer", transition:"all .2s", fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif", letterSpacing:1 }}>{l.label}</button>
            ))}
            <div style={{ width:1, height:24, background:"rgba(255,255,255,0.1)", margin:"0 8px" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.3)", borderRadius:30, padding:"6px 16px" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 12px #00D4FF", animation:"pulse 1.8s infinite" }}/>
              <span style={{ fontSize:10, color:"#00D4FF", letterSpacing:2, fontFamily:"'DM Mono',monospace", fontWeight:600 }}>LIVE</span>
            </div>
          </div>
        ) : (
          <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 12px", fontSize:18, color:"rgba(255,255,255,0.7)" }}>☰</button>
        )}
      </nav>
      {!isDesktop && open && (
        <div style={{ background:"rgba(6,13,26,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,212,255,0.1)", position:"relative", zIndex:199 }}>
          {links.map(l=>(
            <div key={l.id} onClick={()=>{ setPage(l.id); setOpen(false); }} style={{ padding:"16px 24px", fontSize:14, color:page===l.id?"#00D4FF":"rgba(255,255,255,0.6)", borderBottom:"1px solid rgba(255,255,255,0.05)", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontWeight:page===l.id?700:400, letterSpacing:1 }}>{l.label}</div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </>
  );
};

// ============================================================
// FOOTER
// ============================================================
const Footer = ({ setPage, isMobile }) => (
  <footer style={{ borderTop:"1px solid rgba(0,212,255,0.08)", padding:`48px ${isMobile?20:48}px 36px`, marginTop:100 }}>
    <div style={{ maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(4,1fr)", gap:isMobile?32:48, marginBottom:48 }}>
        <div style={{ gridColumn:isMobile?"1 / -1":"auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <img src="/logo.jpg" alt="MonetizeCheck" style={{ width:42, height:42, borderRadius:10, objectFit:"cover" }}/>
            <span style={{ fontSize:16, fontWeight:900, color:"#fff", fontFamily:"'Syne',sans-serif", letterSpacing:-0.5 }}>MonetizeCheck</span>
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.9, maxWidth:260, fontFamily:"'Inter',sans-serif" }}>Free AI-powered YouTube monetization eligibility analyzer. Built by creators, for creators.</p>
        </div>
        <div><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginBottom:20, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>TOOL</div><div onClick={()=>setPage("guide")} style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:12, cursor:"pointer", transition:"color .2s", fontFamily:"'Inter',sans-serif" }}>YPP Guide</div></div>
        <div><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginBottom:20, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>COMPANY</div><div onClick={()=>setPage("about")} style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:12, cursor:"pointer", transition:"color .2s", fontFamily:"'Inter',sans-serif" }}>About FFDRYT</div></div>
        <div><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginBottom:20, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>LEGAL</div><div onClick={()=>setPage("privacy")} style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:12, cursor:"pointer", transition:"color .2s", fontFamily:"'Inter',sans-serif" }}>Privacy Policy</div></div>
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Mono',monospace" }}>© 2026 MonetizeCheck · Created by FFDRYT · Free Forever</span>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Mono',monospace" }}>Not affiliated with YouTube or Google</span>
      </div>
    </div>
  </footer>
);

// ============================================================
// YPP GUIDE PAGE - EXTENSIVE
// ============================================================
const GuidePage = ({ isMobile, setPage }) => {
  const pad = isMobile ? 20 : 32;
  const P = ({ children }) => <p style={{ fontSize:isMobile?15:17, color:"rgba(255,255,255,0.5)", lineHeight:1.9, marginBottom:20, fontFamily:"'Inter',sans-serif", fontWeight:300 }}>{children}</p>;
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:`64px ${pad}px 100px`, animation:"slideUp 0.7s ease" }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:30, padding:"8px 20px", marginBottom:24 }}>
          <span style={{ fontSize:12, color:"#00D4FF", letterSpacing:2, fontFamily:"'DM Mono',monospace" }}>COMPLETE YPP GUIDE · 2026</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px, 8vw, 72px)", fontWeight:900, color:"#fff", letterSpacing:-2, marginBottom:20, lineHeight:1.05 }}>The Ultimate Guide to YouTube Monetization</h1>
        <P>Everything you need to know about the YouTube Partner Program — requirements, strategy, common mistakes, and how to get approved faster.</P>
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px, 5vw, 38px)", fontWeight:800, color:"#fff", letterSpacing:-1, margin:"56px 0 20px", borderLeft:"4px solid #00D4FF", paddingLeft:20 }}>What Is the YouTube Partner Program?</h2>
      <P>The YouTube Partner Program (YPP) is YouTube's official monetization program that allows eligible creators to earn money from advertisements shown on their videos. When you join YPP, Google places ads before, during, and after your videos, and you receive approximately 55% of the revenue generated.</P>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px, 5vw, 38px)", fontWeight:800, color:"#fff", letterSpacing:-1, margin:"56px 0 20px", borderLeft:"4px solid #00D4FF", paddingLeft:20 }}>The 4 Core YPP Requirements in 2026</h2>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:16, marginBottom:40 }}>
        {[
          { n:"01", color:"#00D4FF", title:"1,000 Subscribers", body:"Your channel must have at least 1,000 real, organic subscribers. YouTube actively detects and removes artificially gained subscribers. Subscriber count is the most visible metric, but quality matters more than quantity." },
          { n:"02", color:"#0088AA", title:"4,000 Watch Hours", body:"You need 4,000 valid public watch hours in the last 12 months. Shorts, private videos, and deleted videos do NOT count. Only long-form content contributes to this requirement." },
          { n:"03", color:"#F5A623", title:"No Active Strikes", body:"Your channel must be in good standing with no active Community Guidelines strikes. A single active strike disqualifies your application. Strikes expire after 90 days." },
          { n:"04", color:"#A78BFA", title:"Linked AdSense Account", body:"You must have an active Google AdSense account linked to your YouTube channel. AdSense approval can take 1-4 weeks, so set this up early." },
        ].map(c=>(
          <div key={c.n} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"28px 24px", transition:"all 0.3s" }}>
            <div style={{ fontSize:12, color:c.color, fontFamily:"'DM Mono',monospace", letterSpacing:2, marginBottom:12 }}>REQUIREMENT {c.n}</div>
            <div style={{ fontSize:20, fontWeight:800, color:"rgba(255,255,255,0.9)", marginBottom:14, fontFamily:"'Syne',sans-serif", letterSpacing:-0.5 }}>{c.title}</div>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.8, fontFamily:"'Inter',sans-serif", margin:0 }}>{c.body}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px, 5vw, 38px)", fontWeight:800, color:"#fff", letterSpacing:-1, margin:"56px 0 20px", borderLeft:"4px solid #00D4FF", paddingLeft:20 }}>Revenue Expectations by Niche</h2>
      <P>YouTube ad revenue varies significantly by niche. Finance channels command CPMs (cost per thousand views) of $20–$50. Technology channels see $8–$20. Gaming and entertainment sits at $2–$6. A newly monetized channel with 10,000–50,000 views per month can expect $30–$150 in monthly ad revenue. As your channel grows, revenue scales proportionally.</P>

      <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:24, padding:isMobile?28:40, textAlign:"center", margin:"48px 0" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>🚀</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fff", marginBottom:16 }}>Ready to Check Your Channel?</h3>
        <P style={{ maxWidth:500, margin:"0 auto 24px" }}>Run a free AI analysis and get your personalized monetization score.</P>
        <button onClick={()=>setPage("home")} style={{ background:"linear-gradient(135deg,#00AACC,#0088AA)", color:"#fff", border:"none", borderRadius:16, padding:"16px 40px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, cursor:"pointer", boxShadow:"0 8px 24px rgba(0,212,255,0.3)" }}>
          Analyze My Channel Free →
        </button>
      </div>
    </div>
  );
};

// ============================================================
// ABOUT PAGE
// ============================================================
const AboutPage = ({ isMobile, setPage }) => {
  const pad = isMobile ? 20 : 32;
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:`64px ${pad}px 100px`, animation:"slideUp 0.7s ease" }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:30, padding:"8px 20px", marginBottom:24 }}>
          <span style={{ fontSize:12, color:"#00D4FF", letterSpacing:2, fontFamily:"'DM Mono',monospace" }}>ABOUT MONETIZECHECK</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px, 8vw, 72px)", fontWeight:900, color:"#fff", letterSpacing:-2, marginBottom:20, lineHeight:1.05 }}>Built for Creators, by a Creator</h1>
        <p style={{ fontSize:isMobile?16:18, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif", fontWeight:300 }}>MonetizeCheck was born from a frustration that tens of thousands of YouTube creators experience every year — spending months building a channel, hitting the milestones, applying for YPP, and then getting rejected without a clear explanation.</p>
      </div>

      <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.15)", borderRadius:24, padding:isMobile?28:40, marginBottom:48 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🎯</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fff", marginBottom:16 }}>Our Mission</h3>
        <p style={{ fontSize:isMobile?15:17, color:"rgba(255,255,255,0.5)", lineHeight:1.9, fontFamily:"'Inter',sans-serif" }}>Give every YouTube creator a clear, honest picture of where their channel stands against YouTube's Partner Program requirements. No logins, no subscriptions, no paywalls. Just answers.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:16, marginBottom:56 }}>
        {[["15,000+","Channels Analyzed"],["100%","Free Forever"],["2026","Year Launched"],["FFDRYT","Creator"]].map(([v,l])=>(
          <div key={l} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 16px", textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:900, color:"#00D4FF", fontFamily:"'Syne',sans-serif", letterSpacing:-1, marginBottom:8 }}>{v}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:"'DM Mono',monospace", letterSpacing:2, textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px, 5vw, 38px)", fontWeight:800, color:"#fff", letterSpacing:-1, margin:"40px 0 20px", borderLeft:"4px solid #00D4FF", paddingLeft:20 }}>Who Is FFDRYT?</h2>
      <p style={{ fontSize:isMobile?15:17, color:"rgba(255,255,255,0.5)", lineHeight:1.9, marginBottom:32, fontFamily:"'Inter',sans-serif" }}>FFDRYT is an independent developer, IT technician, and YouTube creator based in Gujarat, India. FFDRYT built MonetizeCheck as a solo project — turning a real frustration into a useful free tool for other creators. Every feature is informed by real experience building a channel from scratch.</p>

      <div style={{ textAlign:"center", margin:"56px 0" }}>
        <button onClick={()=>setPage("home")} style={{ background:"linear-gradient(135deg,#00AACC,#0088AA)", color:"#fff", border:"none", borderRadius:16, padding:"16px 40px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, cursor:"pointer", boxShadow:"0 8px 24px rgba(0,212,255,0.3)" }}>
          Analyze My Channel Free →
        </button>
      </div>
    </div>
  );
};

// ============================================================
// PRIVACY PAGE
// ============================================================
const PrivacyPage = ({ isMobile }) => {
  const pad = isMobile ? 20 : 32;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:`64px ${pad}px 100px`, animation:"slideUp 0.7s ease" }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:30, padding:"8px 20px", marginBottom:24 }}>
          <span style={{ fontSize:12, color:"#00D4FF", letterSpacing:2, fontFamily:"'DM Mono',monospace" }}>LEGAL</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px, 8vw, 60px)", fontWeight:900, color:"#fff", letterSpacing:-2, marginBottom:16 }}>Privacy Policy</h1>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontFamily:"'DM Mono',monospace" }}>Last updated: {today}</p>
      </div>

      <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:20, padding:24, marginBottom:48, display:"flex", gap:16, alignItems:"flex-start" }}>
        <span style={{ fontSize:28 }}>🔒</span>
        <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", lineHeight:1.8, margin:0, fontFamily:"'Inter',sans-serif" }}><strong style={{ color:"#00D4FF" }}>Short version:</strong> MonetizeCheck does not collect personal data, does not require login, and does not store anything about you or your YouTube channel.</p>
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:isMobile?28:40 }}>
        <div style={{ marginBottom:32 }}><h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:12 }}>1. Introduction</h3><p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif" }}>MonetizeCheck ("we", "our", "us") is a free tool created by FFDRYT to help YouTube creators assess their channel's monetization eligibility.</p></div>
        <div style={{ marginBottom:32 }}><h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:12 }}>2. Information We Do NOT Collect</h3><p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif" }}>We do not collect, store, or process your name, email address, YouTube credentials, OAuth tokens, or payment information.</p></div>
        <div style={{ marginBottom:32 }}><h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:12 }}>3. Information We Process</h3><p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif" }}>Publicly available channel data — channel name, subscriber count, video titles, upload dates visible on public YouTube pages. The URL you submit is used solely to identify which channel to analyze and is not stored.</p></div>
        <div style={{ marginBottom:32 }}><h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:12 }}>4. Contact</h3><p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif" }}>Questions? Reach out to FFDRYT at brazilserverop9@gmail.com</p></div>
      </div>
    </div>
  );
};

// ============================================================
// HOME PAGE - ULTRA LONG WITH EXTENSIVE EDUCATIONAL CONTENT
// ============================================================
const HomePage = ({ isMobile, isTablet, isDesktop, setPage }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const STEPS = ["Connecting to YouTube API...", "Scanning video library...", "Auditing policy compliance...", "Calculating monetization score...", "Generating action plan...", "Finalizing report..."];

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const t = setInterval(() => setLoadingStep(s=>(s+1)%STEPS.length), 1800);
    return () => clearInterval(t);
  }, [loading, STEPS.length]);

  const analyze = async () => {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch("/api/analyze", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ url }) });
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

  const P = isMobile ? 20 : 32;

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 ${P}px` }}>
      <section style={{ padding:`${isMobile?56:100}px 0 ${isMobile?40:64}px`, animation:"slideUp 0.8s ease" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:40, padding:"8px 22px", marginBottom:isMobile?24:32 }}>
          <span style={{ fontSize:14 }}>✦</span>
          <span style={{ fontSize:isMobile?11:12, color:"#00D4FF", letterSpacing:2, fontFamily:"'DM Mono',monospace", fontWeight:600 }}>FREE AI-POWERED ANALYZER</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(40px, 10vw, 98px)", fontWeight:900, color:"#fff", lineHeight:1.04, letterSpacing:-3, marginBottom:24, maxWidth:800 }}>
          Is Your Channel<br/>
          <span style={{ background:"linear-gradient(135deg,#00D4FF 0%,#7EEEFF 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Ready to Earn?</span>
        </h1>
        <p style={{ fontSize:isMobile?16:20, color:"rgba(255,255,255,0.4)", lineHeight:1.8, maxWidth:600, marginBottom:isMobile?36:56, fontWeight:300, fontFamily:"'Inter',sans-serif" }}>
          Paste your YouTube channel URL and get a full monetization eligibility report — subscriber count, watch hours, policy compliance, and a personalized action plan. Free, instant, no login required.
        </p>
        <div style={{ display:"flex", gap:isMobile?24:40, marginBottom:isMobile?40:56, flexWrap:"wrap" }}>
          {[["15K+","Analyzed"],["4.9★","Rating"],["100%","Free"],["<25s","Results"]].map(([v,l])=>(
            <div key={l}>
              <div style={{ fontSize:isMobile?22:28, fontWeight:900, color:"#fff", fontFamily:"'Syne',sans-serif", letterSpacing:-1.5 }}>{v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:4, fontFamily:"'Inter',sans-serif", letterSpacing:1 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isMobile?160:220}px,1fr))`, gap:14, marginBottom:isMobile?36:56 }}>
          {[
            { icon:"◉", color:"#00D4FF", title:"Monetization Score", desc:"AI eligibility score out of 100" },
            { icon:"◈", color:"#0088AA", title:"YPP Requirements", desc:"Subs, watch hours & account check" },
            { icon:"▦", color:"#A78BFA", title:"Video-by-Video Audit", desc:"Ad score per video" },
            { icon:"◻", color:"#F5A623", title:"Policy Compliance", desc:"Copyright & guidelines scan" },
            { icon:"▲", color:"#FF4757", title:"Personalized Plan", desc:"Step-by-step fixes" },
            { icon:"⬡", color:"#00D4FF", title:"Download Report", desc:"Export .docx report" },
          ].map(f=><FeatureCard key={f.title} {...f} accent={f.color}/>)}
        </div>
      </section>

      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(0,212,255,0.15)", borderRadius:24, padding:`${isMobile?24:32}px ${isMobile?20:36}px`, marginBottom:24, backdropFilter:"blur(12px)" }}>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginBottom:16, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>ENTER YOUTUBE CHANNEL URL OR HANDLE</div>
        <div style={{ display:"flex", gap:14, flexDirection:isMobile?"column":"row" }}>
          <input ref={inputRef} value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}
            placeholder="youtube.com/@channel  ·  @handle  ·  UCxxxxx"
            style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, padding:"16px 20px", color:"rgba(255,255,255,0.9)", fontSize:15, fontFamily:"'Inter',sans-serif", outline:"none" }}/>
          <button onClick={analyze} disabled={loading}
            style={{ background:loading?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#00AACC,#0088AA)", color:loading?"rgba(255,255,255,0.3)":"#fff", border:"none", borderRadius:16, padding:isMobile?"16px":"16px 36px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, cursor:loading?"not-allowed":"pointer", letterSpacing:0.5, whiteSpace:"nowrap", boxShadow:loading?"none":"0 6px 24px rgba(0,212,255,0.3)", transition:"all 0.3s", width:isMobile?"100%":"auto" }}>
            {loading?"ANALYZING...":"ANALYZE CHANNEL →"}
          </button>
          {data && (
            <button onClick={()=>{ setData(null); setUrl(""); setError(""); }}
              style={{ background:"none", border:"1px solid rgba(255,255,255,0.15)", borderRadius:16, padding:"16px 24px", color:"rgba(255,255,255,0.5)", fontFamily:"'Inter',sans-serif", fontSize:14, cursor:"pointer", transition:"all 0.3s", width:isMobile?"100%":"auto" }}>
              ✕ Reset
            </button>
          )}
        </div>
        {error && <div style={{ marginTop:16, padding:"14px 18px", background:"rgba(255,71,87,0.1)", border:"1px solid rgba(255,71,87,0.25)", borderRadius:14, color:"#FF4757", fontSize:13, fontFamily:"'Inter',sans-serif" }}>⚠ {error}</div>}
        <div style={{ marginTop:12, fontSize:10, color:"rgba(255,255,255,0.12)", fontFamily:"'DM Mono',monospace", textAlign:"center" }}>Accepts: youtube.com/@handle · youtube.com/c/name · @handle · UCxxxxx channel ID</div>
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"100px 20px", animation:"fadeIn 0.5s ease" }}>
          <div style={{ position:"relative", width:90, height:90, margin:"0 auto 32px" }}>
            <div style={{ width:90, height:90, border:"3px solid rgba(255,255,255,0.05)", borderTop:"3px solid #00D4FF", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
            <div style={{ position:"absolute", inset:15, border:"2px solid rgba(255,255,255,0.04)", borderBottom:"2px solid rgba(0,212,255,0.4)", borderRadius:"50%", animation:"spin 2s linear infinite reverse" }}/>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:14, height:14, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 24px #00D4FF", animation:"pulseDot 1.5s infinite" }}/>
          </div>
          <div style={{ fontSize:14, color:"#00D4FF", letterSpacing:3, marginBottom:18, animation:"pulse 1.6s ease infinite", fontFamily:"'DM Mono',monospace" }}>{STEPS[loadingStep]}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:16 }}>
            {STEPS.map((_,i)=><div key={i} style={{ width:isMobile?20:36, height:4, background:i<=loadingStep?"#00D4FF":"rgba(255,255,255,0.08)", borderRadius:3, transition:"background 0.4s" }}/>)}
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)", fontFamily:"'DM Mono',monospace" }}>Usually takes 10–25 seconds</div>
        </div>
      )}

      {/* RESULTS SECTION - RENDERED WHEN DATA EXISTS */}
      {data && (() => {
        const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
        const vc = getVerdictConfig(me?.verdict);
        const showDownload = data && ["NOT_ELIGIBLE","BORDERLINE"].includes(me?.verdict);
        return (
          <div style={{ animation:"slideUp 0.6s ease" }}>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:`${isMobile?20:28}px ${isMobile?18:28}px`, marginBottom:16 }}>
              <div style={{ display:"flex", gap:18, alignItems:"flex-start", flexWrap:isMobile?"wrap":"nowrap" }}>
                <div style={{ width:64, height:64, background:"linear-gradient(135deg,#00D4FF,#0088AA)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:"#fff", flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{channel?.name?.[0]?.toUpperCase()||"Y"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:isMobile?20:26, fontWeight:900, color:"#fff", letterSpacing:-1, marginBottom:10, fontFamily:"'Syne',sans-serif" }}>{channel?.name}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <Pill color="rgba(0,212,255,0.4)">{channel?.handle}</Pill>
                    <Pill>{channel?.category}</Pill>
                    <Pill>{channel?.country}</Pill>
                    {!isMobile && <Pill>Joined {channel?.joinedDate}</Pill>}
                  </div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:12, marginTop:24 }}>
                <StatCard label="Subscribers" value={channel?.subscribers} color="#00D4FF"/>
                <StatCard label="Total Videos" value={channel?.totalVideos}/>
                <StatCard label="Total Views" value={channel?.totalViews}/>
                <StatCard label="Avg / Video" value={channel?.avgViewsPerVideo}/>
              </div>
            </div>

            <div style={{ background:vc.bg, border:`1px solid ${vc.border}`, borderRadius:24, padding:`${isMobile?24:32}px ${isMobile?20:32}px`, marginBottom:16, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle,${vc.color}15,transparent 70%)` }}/>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:20, alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, flexWrap:"wrap" }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:`${vc.color}18`, border:`1px solid ${vc.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:vc.color, fontWeight:900 }}>{vc.icon}</div>
                    <div>
                      <div style={{ fontSize:isMobile?20:26, fontWeight:900, color:vc.color, letterSpacing:-0.8, fontFamily:"'Syne',sans-serif" }}>{vc.label}</div>
                      <Pill color={`${vc.color}60`}>{vc.tag}</Pill>
                    </div>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:isMobile?14:16, lineHeight:1.8, maxWidth:550, marginBottom:20, fontFamily:"'Inter',sans-serif" }}>{summary}</p>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                    {showDownload && (
                      <button onClick={()=>downloadReport(data,setDownloading)} disabled={downloading}
                        style={{ background:"rgba(0,136,204,0.1)", color:downloading?"rgba(255,255,255,0.3)":"#00AACC", border:`1px solid ${downloading?"rgba(0,136,204,0.15)":"rgba(0,136,204,0.35)"}`, borderRadius:12, padding:"12px 24px", fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:13, cursor:downloading?"not-allowed":"pointer", transition:"all 0.3s", display:"inline-flex", alignItems:"center", gap:10 }}>
                        ↓ {downloading?"Building Report...":"Download Full Report (.docx)"}
                      </button>
                    )}
                    <button onClick={copyResult} style={{ background:"rgba(255,255,255,0.04)", color:copied?"#00D4FF":"rgba(255,255,255,0.5)", border:`1px solid ${copied?"rgba(0,212,255,0.4)":"rgba(255,255,255,0.12)"}`, borderRadius:12, padding:"12px 24px", fontFamily:"'Inter',sans-serif", fontSize:13, cursor:"pointer", transition:"all 0.3s", fontWeight:500 }}>
                      {copied?"✓ Copied to Clipboard!":"⎘ Copy Summary"}
                    </button>
                  </div>
                </div>
                {!isMobile && (
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <RadialScore score={me?.overallScore||0} size={120}/>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:2.5, marginTop:8, fontFamily:"'DM Mono',monospace" }}>OVERALL SCORE</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", gap:16, borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:24, overflowX:"auto" }}>
              {["overview","videos","policy","action","roadmap","faq"].map(tab=>(
                <button key={tab} onClick={()=>setActiveTab(tab)}
                  style={{ background:"none", border:"none", borderBottom:activeTab===tab?"3px solid #00D4FF":"3px solid transparent", color:activeTab===tab?"#00D4FF":"rgba(255,255,255,0.4)", padding:`12px ${isMobile?16:24}px`, fontFamily:"'Inter',sans-serif", fontSize:isMobile?12:14, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s", textTransform:"uppercase", letterSpacing:1 }}>
                  {tab === "overview" && "📊 OVERVIEW"}
                  {tab === "videos" && `🎬 VIDEOS (${videos?.length||0})`}
                  {tab === "policy" && "⚖️ POLICY"}
                  {tab === "action" && "📋 ACTION PLAN"}
                  {tab === "roadmap" && "🗺️ ROADMAP"}
                  {tab === "faq" && "❓ FAQ"}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div style={{ display:"grid", gridTemplateColumns:isDesktop?"1fr 1fr":"1fr", gap:20 }}>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}><div style={{ width:8, height:8, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 10px #00D4FF" }}/><span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:3, fontFamily:"'DM Mono',monospace" }}>YPP REQUIREMENTS</span></div>
                  {me?.ytpRequirements && Object.entries(me.ytpRequirements).map(([key,val])=>(
                    <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <div><div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", textTransform:"capitalize", fontFamily:"'Inter',sans-serif" }}>{key.replace(/([A-Z])/g," $1")}</div>{val.required!=null && <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:3 }}>need {val.required?.toLocaleString()} · est {val.estimated?.toLocaleString()}</div>}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{ width:7, height:7, borderRadius:"50%", background:val.met?"#00D4FF":"#FF4757", boxShadow:`0 0 8px ${val.met?"#00D4FF":"#FF4757"}` }}/><span style={{ fontSize:11, color:val.met?"#00D4FF":"#FF4757", fontWeight:800, fontFamily:"'DM Mono',monospace" }}>{val.met?"PASS":"FAIL"}</span></div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}><div style={{ width:8, height:8, borderRadius:"50%", background:"#F5A623", boxShadow:"0 0 10px #F5A623" }}/><span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:3, fontFamily:"'DM Mono',monospace" }}>CONTENT ANALYSIS</span></div>
                  {me?.contentAnalysis && Object.entries(me.contentAnalysis).map(([key,val])=><ScoreBar key={key} label={key.replace(/([A-Z])/g," $1")} score={val.score} notes={val.notes}/>)}
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div>
                <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                  <div style={{ background:"rgba(0,212,255,0.1)", borderRadius:12, padding:"8px 18px", fontSize:12, color:"#00D4FF", fontFamily:"'DM Mono',monospace" }}>✓ {(videos||[]).filter(v=>v.monetizable).length} Monetizable</div>
                  <div style={{ background:"rgba(255,71,87,0.1)", borderRadius:12, padding:"8px 18px", fontSize:12, color:"#FF4757", fontFamily:"'DM Mono',monospace" }}>✕ {(videos||[]).filter(v=>!v.monetizable).length} Blocked</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {(videos||[]).map((v,i)=>(
                    <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${v.monetizable?"rgba(255,255,255,0.08)":"rgba(255,71,87,0.2)"}`, borderRadius:18, padding:`${isMobile?14:18}px ${isMobile?14:22}px`, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                      <div style={{ width:50, height:50, background:v.monetizable?"rgba(0,212,255,0.1)":"rgba(255,71,87,0.1)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{v.monetizable?"💰":"🚫"}</div>
                      <div style={{ flex:1 }}><div style={{ fontSize:14, color:"rgba(255,255,255,0.85)", marginBottom:6, fontWeight:500 }}>{v.title}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Mono',monospace" }}>{v.uploadDate} · {v.duration} · {v.views} views</div>{v.issues?.length>0 && <div style={{ fontSize:11, color:"#FF4757", marginTop:6 }}>⚠ {v.issues.join(" · ")}</div>}</div>
                      <RadialScore score={v.score||0} size={isMobile?52:60}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "policy" && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:isMobile?20:28 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}><div style={{ width:8, height:8, borderRadius:"50%", background:"#0088AA", boxShadow:"0 0 10px #0088AA" }}/><span style={{ fontSize:12, color:"rgba(255,255,255,0.35)", letterSpacing:3, fontFamily:"'DM Mono',monospace" }}>POLICY COMPLIANCE AUDIT</span></div>
                {me?.policyCompliance && Object.entries(me.policyCompliance).map(([key,val])=>{
                  const good = val===true||val==="CLEAN"||val==="SAFE"||val==="LOW";
                  return <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize:14, color:"rgba(255,255,255,0.7)", textTransform:"capitalize" }}>{key.replace(/([A-Z])/g," $1")}</span>
                    <span style={{ fontSize:11, fontWeight:800, color:good?"#00D4FF":"#FF4757", background:good?"rgba(0,212,255,0.1)":"rgba(255,71,87,0.1)", padding:"6px 16px", borderRadius:10, fontFamily:"'DM Mono',monospace" }}>{typeof val==="boolean"?(val?"PASS":"FAIL"):val}</span>
                  </div>;
                })}
              </div>
            )}

            {activeTab === "action" && (
              <div><div style={{ textAlign:"center", marginBottom:20, fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:3 }}>FOLLOW THESE STEPS TO MONETIZE</div>
              {(recommendations||[]).map((tip,i)=><div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:isMobile?16:20, marginBottom:12, display:"flex", gap:16, alignItems:"flex-start" }}><div style={{ width:36, height:36, background:`${i<3?"#FF4757":i<6?"#F5A623":"#00D4FF"}15`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:i<3?"#FF4757":i<6?"#F5A623":"#00D4FF" }}>{String(i+1).padStart(2,"0")}</div><p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.7, flex:1 }}>{tip}</p></div>)}</div>
            )}

            {activeTab === "roadmap" && (
              <div><div style={{ textAlign:"center", marginBottom:28, fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:3 }}>YOUR PATH TO YPP APPROVAL</div>
              {[
                { phase:"PHASE 1", time:"Week 1-2", goal:"Fix Policy Issues", color:"#FF4757", desc:"Remove copyrighted content, appeal strikes" },
                { phase:"PHASE 2", time:"Month 1", goal:"Improve Content Quality", color:"#F5A623", desc:"Create 4-8 high-quality original videos" },
                { phase:"PHASE 3", time:"Month 2-3", goal:"Build Watch Hours", color:"#A3E635", desc:"Upload 2-3x weekly, 8-15 min videos" },
                { phase:"PHASE 4", time:"Month 3-6", goal:"Reach 1,000 Subs", color:"#00D4FF", desc:"Promote, collaborate, optimize thumbnails" },
                { phase:"PHASE 5", time:"Month 6+", goal:"Apply for YPP", color:"#0088AA", desc:"Verify requirements, link AdSense, submit" }
              ].map((s,i,arr)=><div key={i} style={{ display:"flex", gap:isMobile?12:16, marginBottom:20 }}><div style={{ textAlign:"center", width:isMobile?60:80 }}><div style={{ fontSize:11, color:s.color, fontWeight:700 }}>{s.phase}</div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{s.time}</div></div><div style={{ flex:1, borderLeft:`2px solid ${s.color}`, paddingLeft:16, paddingBottom:18 }}><div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:6 }}>{s.goal}</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{s.desc}</div></div></div>)}
              </div>
            )}

            {activeTab === "faq" && (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[["How accurate is this analysis?","MonetizeCheck uses AI to estimate eligibility based on public data. It's a strong indicator, but final approval is by YouTube."],["Does this access my private YouTube data?","No. Only publicly available channel information is read. No login required."],["Why does my score differ from YouTube Studio?","YouTube Studio shows exact numbers; MonetizeCheck estimates from public data."],["What are the YPP requirements?","1,000 subscribers, 4,000 watch hours in 12 months, no active strikes, linked AdSense."],["Does Shorts watch time count toward YPP?","No. Only long-form public videos count toward the 4,000 hours."]].map(([q,a],i)=>(
                  <details key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
                    <summary style={{ padding:`${isMobile?14:18}px ${isMobile?16:24}px`, cursor:"pointer", fontSize:isMobile?14:15, color:"rgba(255,255,255,0.8)", fontWeight:600, listStyle:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>{q}<span style={{ color:"rgba(255,255,255,0.4)" }}>+</span></summary>
                    <div style={{ padding:`0 ${isMobile?16:24}px ${isMobile?16:20}px`, fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.8, borderTop:"1px solid rgba(255,255,255,0.05)" }}>{a}</div>
                  </details>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* EXTENSIVE EDUCATIONAL CONTENT - SHOWN WHEN NO DATA */}
      {!data && !loading && (
        <div style={{ padding:isMobile?"40px 0":"64px 0", borderTop:"1px solid rgba(0,212,255,0.08)", marginTop:32 }}>
          <div style={{ marginBottom:56 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,136,204,0.08)", border:"1px solid rgba(0,136,204,0.2)", borderRadius:30, padding:"8px 20px", marginBottom:24 }}>
              <span style={{ fontSize:11, color:"#0088AA", letterSpacing:2, fontFamily:"'DM Mono',monospace" }}>YOUTUBE PARTNER PROGRAM · EXPLAINED</span>
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px, 6vw, 52px)", fontWeight:900, color:"#fff", letterSpacing:-1.5, marginBottom:24, lineHeight:1.1 }}>What Is the YouTube Partner Program and Who Qualifies?</h2>
            <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:isMobile?0:40 }}>
              <p style={{ fontSize:isMobile?14:16, color:"rgba(255,255,255,0.5)", lineHeight:1.9, marginBottom:20 }}>The YouTube Partner Program (YPP) is Google's official system for sharing advertising revenue with YouTube creators. When approved, you receive approximately 55% of the ad revenue generated on your videos.</p>
              <p style={{ fontSize:isMobile?14:16, color:"rgba(255,255,255,0.5)", lineHeight:1.9, marginBottom:20 }}>To qualify in 2026, your channel needs: at least 1,000 subscribers, at least 4,000 valid public watch hours in the past 12 months, no active Community Guidelines strikes, and an active Google AdSense account linked to your channel.</p>
            </div>
          </div>

          <div style={{ marginBottom:56 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px, 5vw, 42px)", fontWeight:900, color:"#fff", letterSpacing:-1, marginBottom:24 }}>The 4 YPP Requirements — In Detail</h2>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:16 }}>
              {[["👥","#00D4FF","1,000 Subscribers","You need 1,000 real, organic subscribers. YouTube actively detects and removes sub-for-sub and purchased subscribers."],["⏱","#0088AA","4,000 Watch Hours","Only watch time from public, long-form videos counts. Shorts, private videos, and deleted videos are excluded."],["🛡","#F5A623","No Active Community Strikes","A single active Community Guidelines strike disqualifies your application. Strikes expire after 90 days."],["💳","#A78BFA","Linked AdSense Account","An active Google AdSense account must be linked before you can receive payments."]].map(([icon,color,title,body])=>(
                <div key={title} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:"24px 22px", display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ width:52, height:52, background:`${color}15`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{icon}</div>
                  <div><div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:8, fontFamily:"'Syne',sans-serif" }}>{title}</div><p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.7, margin:0 }}>{body}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:"rgba(0,136,204,0.05)", border:"1px solid rgba(0,136,204,0.2)", borderRadius:28, padding:isMobile?28:44, textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:16 }}>📖</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fff", marginBottom:16 }}>Want the Full YPP Strategy Guide?</h3>
            <p style={{ fontSize:isMobile?14:16, color:"rgba(255,255,255,0.5)", marginBottom:28, fontFamily:"'Inter',sans-serif" }}>Read our complete guide covering every aspect of YouTube monetization.</p>
            <button onClick={()=>setPage("guide")} style={{ background:"rgba(0,136,204,0.15)", color:"#00AACC", border:"1px solid rgba(0,136,204,0.4)", borderRadius:16, padding:"14px 36px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", transition:"all 0.3s" }}>Read the Full Guide →</button>
          </div>
        </div>
      )}

      {!data && !loading && (
        <div style={{ textAlign:"center", padding:"48px 0 60px", borderTop:"1px solid rgba(0,212,255,0.05)", marginTop:32 }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.08)", letterSpacing:4, animation:"pulse 4s ease infinite", fontFamily:"'DM Mono',monospace" }}>▶ ENTER A CHANNEL URL ABOVE TO BEGIN</div>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)} 50%{opacity:0.5;transform:translate(-50%,-50%) scale(1.3)} }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>
    </div>
  );
};

// ============================================================
// ROOT APP
// ============================================================
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
        opacity: loaderDone ? 1 : 0, transition: loaderDone ? "opacity 0.6s ease" : "none",
      }}>
        <style>{`
          * { box-sizing:border-box; margin:0; padding:0; }
          ::-webkit-scrollbar { width:6px; }
          ::-webkit-scrollbar-track { background:#060D1A; }
          ::-webkit-scrollbar-thumb { background:#0D2233; border-radius:4px; }
          input:focus { border-color:rgba(0,212,255,0.5) !important; box-shadow:0 0 0 4px rgba(0,212,255,0.1) !important; outline:none; }
          details summary::-webkit-details-marker { display:none; }
          button { transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1); }
        `}</style>
        <AmbientBg/>
        <div style={{ position:"relative", zIndex:1 }}>
          <Navbar page={page} setPage={setPage} isMobile={isMobile} isDesktop={isDesktop}/>
          {page === "home" && <HomePage isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} setPage={setPage}/>}
          {page === "about" && <AboutPage isMobile={isMobile} setPage={setPage}/>}
          {page === "guide" && <GuidePage isMobile={isMobile} setPage={setPage}/>}
          {page === "privacy" && <PrivacyPage isMobile={isMobile}/>}
          <Footer setPage={setPage} isMobile={isMobile}/>
        </div>
      </div>
    </>
  );
}
