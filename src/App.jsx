import { useState, useEffect, useRef } from "react";

function injectFonts() {
  if (document.getElementById("mc-fonts")) return;
  const link = document.createElement("link");
  link.id = "mc-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

const getScoreColor = (s) => s >= 75 ? "#00E5A0" : s >= 50 ? "#F5A623" : "#FF4757";
const getScoreGlow  = (s) => s >= 75 ? "rgba(0,229,160,0.35)" : s >= 50 ? "rgba(245,166,35,0.35)" : "rgba(255,71,87,0.35)";
const getVerdictConfig = (v) => ({
  LIKELY_ELIGIBLE: { color:"#00E5A0", bg:"rgba(0,229,160,0.06)",  border:"rgba(0,229,160,0.2)",  label:"LIKELY ELIGIBLE", tag:"READY TO MONETIZE",  icon:"✓" },
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
      background:"radial-gradient(circle,rgba(0,229,160,0.07) 0%,transparent 70%)", animation:"float 9s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", bottom:-300, right:-150, width:700, height:700, borderRadius:"50%",
      background:"radial-gradient(circle,rgba(0,150,255,0.04) 0%,transparent 70%)", animation:"float 12s ease-in-out infinite reverse" }}/>
    <div style={{ position:"absolute", inset:0,
      backgroundImage:"linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)",
      backgroundSize:"64px 64px" }}/>
  </div>
);

async function generateWordReport(data) {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat } =
    await import("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js");
  const { channel, monetizationEligibility: me, recommendations, summary } = data;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const ACCENT="00C980", LIGHT="F0FFF8", DARK="0A0F0D";
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
      <nav style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:`0 ${isMobile?16:40}px`, height:60, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(7,9,12,0.92)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }} onClick={()=>setPage("home")}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#00E5A0,#00A870)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, boxShadow:"0 4px 14px rgba(0,229,160,0.3)" }}>▶</div>
          <div>
            <div style={{ fontSize:isMobile?14:16, fontWeight:800, color:"#fff", letterSpacing:-0.5, fontFamily:"'Syne',sans-serif", lineHeight:1.1 }}>Monetize<span style={{ color:"#00E5A0" }}>Check</span></div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.2)", letterSpacing:2, fontFamily:"'DM Mono',monospace" }}>by FFDRYT · Free AI</div>
          </div>
        </div>
        {isDesktop ? (
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {links.map(l=>(
              <button key={l.id} onClick={()=>setPage(l.id)} style={{ background:"none", border:"none", borderBottom:page===l.id?"2px solid #00E5A0":"2px solid transparent", color:page===l.id?"#00E5A0":"rgba(255,255,255,0.35)", padding:"6px 14px", borderRadius:0, cursor:"pointer", transition:"color .2s", fontWeight:600, fontSize:12, fontFamily:"'Inter',sans-serif" }}>{l.label}</button>
            ))}
            <div style={{ width:1, height:18, background:"rgba(255,255,255,0.08)", margin:"0 6px" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(0,229,160,0.08)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:20, padding:"5px 12px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#00E5A0", boxShadow:"0 0 8px #00E5A0" }}/>
              <span style={{ fontSize:10, color:"#00E5A0", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>LIVE</span>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(0,229,160,0.08)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:20, padding:"4px 10px" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#00E5A0", boxShadow:"0 0 6px #00E5A0" }}/>
              <span style={{ fontSize:9, color:"#00E5A0", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>LIVE</span>
            </div>
            <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"7px 10px", cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:14 }}>{open?"✕":"☰"}</button>
          </div>
        )}
      </nav>
      {!isDesktop && open && (
        <div style={{ background:"rgba(10,12,16,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.07)", position:"relative", zIndex:199 }}>
          {links.map(l=>(
            <div key={l.id} onClick={()=>{ setPage(l.id); setOpen(false); }} style={{ padding:"14px 20px", fontSize:14, color:page===l.id?"#00E5A0":"rgba(255,255,255,0.5)", borderBottom:"1px solid rgba(255,255,255,0.04)", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontWeight:page===l.id?700:400 }}>{l.label}</div>
          ))}
        </div>
      )}
    </>
  );
};

/* ══════════════════════════ FOOTER ════════════════════════════════════════ */
const Footer = ({ setPage, isMobile }) => (
  <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:`36px ${isMobile?16:40}px 28px`, marginTop:80 }}>
    <div style={{ maxWidth:1080, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?28:40, marginBottom:36 }}>
        <div style={{ gridColumn:isMobile?"1 / -1":"auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:30, height:30, background:"linear-gradient(135deg,#00E5A0,#00A870)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>▶</div>
            <span style={{ fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif" }}>MonetizeCheck</span>
          </div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", lineHeight:1.8, maxWidth:200, fontFamily:"'Inter',sans-serif" }}>Free AI-powered YouTube monetization eligibility analyzer by FFDRYT.</p>
        </div>
        {[
          { title:"Tool",    items:[["YPP Guide",()=>setPage("guide")],["FAQ",null],["Changelog",null]] },
          { title:"Company", items:[["About",()=>setPage("about")],["Contact",null],["Blog",null]] },
          { title:"Legal",   items:[["Privacy Policy",()=>setPage("privacy")],["Terms of Use",null],["Disclaimer",null]] },
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
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.14)", fontFamily:"'DM Mono',monospace" }}>© 2025 FFDRYT · MonetizeCheck · Free Tool</span>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.1)", fontFamily:"'DM Mono',monospace" }}>Not affiliated with YouTube™ or Google LLC</span>
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
  const Callout = ({ color="#00E5A0", icon, children }) => (
    <div style={{ background:`${color}06`, border:`1px solid ${color}20`, borderRadius:14, padding:"18px 20px", marginBottom:20, display:"flex", gap:14, alignItems:"flex-start" }}>
      <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.9, fontFamily:"'Inter',sans-serif" }}>{children}</div>
    </div>
  );
  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:`56px ${pad}px 80px`, animation:"slideUp .5s ease" }}>
      <div style={{ marginBottom:36 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:18 }}>
          <span style={{ fontSize:10, color:"#00E5A0", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>COMPLETE YPP GUIDE · 2025</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:800, color:"#fff", letterSpacing:-1.5, marginBottom:14, lineHeight:1.06 }}>The Complete Guide to<br/>YouTube Monetization</h1>
        <P>Everything you need to know about the YouTube Partner Program — requirements, strategy, common mistakes, and how to get approved faster. This guide is written for creators at every stage, from just starting out to already applying and getting rejected.</P>
      </div>

      <H2>What Is the YouTube Partner Program?</H2>
      <P>The YouTube Partner Program (YPP) is YouTube's official monetization program that allows eligible creators to earn money from advertisements shown on their videos. When you join YPP, Google places ads before, during, and after your videos, and you receive a share of the revenue generated. Beyond advertising, YPP membership also unlocks access to channel memberships, Super Thanks, Super Chat during live streams, merchandise shelves, and the YouTube Shopping affiliate program.</P>
      <P>YPP was introduced in 2007, making it one of the longest-running creator monetization programs on any platform. Since then, YouTube has significantly tightened its eligibility criteria to ensure that only channels with genuine, advertiser-friendly content participate in revenue sharing. Understanding exactly what YouTube looks for is the first step toward getting approved.</P>

      <H2>The 4 Core YPP Requirements in 2025</H2>
      <P>To apply for the YouTube Partner Program, your channel must simultaneously meet all four of the following requirements. Missing even one will result in your application being rejected or delayed.</P>

      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { n:"01", color:"#00E5A0", title:"1,000 Subscribers", body:"Your channel must have at least 1,000 subscribers. These must be real, organic subscribers — YouTube actively detects and removes artificially gained subscribers from sub-for-sub schemes or purchased lists. Channels caught using these tactics face permanent suspension." },
          { n:"02", color:"#00B8FF", title:"4,000 Watch Hours", body:"You need 4,000 valid public watch hours accumulated in the last 12 months. Private videos, deleted videos, and YouTube Shorts do not count toward this total. Live streams do count, provided they are public and were not removed for policy violations." },
          { n:"03", color:"#F5A623", title:"No Active Strikes", body:"Your channel must be in good standing with no active Community Guidelines strikes. A single active strike makes you ineligible to apply. If you have a strike, wait for it to expire (90 days from the date of issue) before applying." },
          { n:"04", color:"#A78BFA", title:"Linked AdSense Account", body:"You must have an active Google AdSense account linked to your YouTube channel. If you don't have one, you can create it during the YPP application process. AdSense requires accurate payment information and tax details depending on your country." },
        ].map(c=>(
          <div key={c.n} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"22px 20px" }}>
            <div style={{ fontSize:10, color:c.color, fontFamily:"'DM Mono',monospace", letterSpacing:2, marginBottom:10 }}>REQUIREMENT {c.n}</div>
            <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:10, fontFamily:"'Syne',sans-serif" }}>{c.title}</div>
            <P style={{ marginBottom:0, fontSize:13 }}>{c.body}</P>
          </div>
        ))}
      </div>

      <H2>What Happens During the YPP Review?</H2>
      <P>Meeting the four numerical requirements gets your application into the review queue, but it does not guarantee approval. YouTube's team — a combination of automated systems and human reviewers — evaluates your entire channel against their advertiser-friendly content guidelines. This is where many creators get surprised: they hit 1,000 subscribers and 4,000 watch hours, apply, and then get rejected anyway.</P>
      <P>The human review process typically takes between 1 and 4 weeks. During this period, reviewers look at your most recent videos (usually the last 20 to 30 uploads), your channel description, your playlists, your community posts, and even your channel name and profile picture. All of these elements contribute to whether YouTube considers your channel a suitable environment for brand advertising.</P>

      <Callout color="#F5A623" icon="⚠">
        <strong style={{ color:"rgba(255,255,255,0.8)" }}>Common rejection reason:</strong> Many channels are rejected not because of explicit policy violations, but because the overall channel lacks a consistent identity, niche, or demonstrated value to viewers. A channel that uploads 200 unrelated short clips without a clear topic signals low quality to reviewers, regardless of watch hours.
      </Callout>

      <H2>Understanding Advertiser-Friendly Content</H2>
      <P>One of the most misunderstood aspects of YPP is the difference between content that doesn't violate Community Guidelines and content that is advertiser-friendly. YouTube has two separate standards: one for what can exist on the platform, and one for what can carry advertising. The bar for advertising is significantly higher.</P>
      <H3>Content That Typically Passes Advertiser Review</H3>
      <P>Educational and informational videos, how-to tutorials, product reviews, gaming content without excessive profanity, cooking channels, travel vlogs, finance and investing content, technology reviews, music covers (with proper licensing), fitness and wellness content, and family-friendly entertainment all tend to perform well in review. These niches have deep advertiser interest and low brand-safety risk.</P>
      <H3>Content That Risks Limited Ads or Rejection</H3>
      <P>Videos covering controversial political topics, graphic real-world violence (even in news context), adult humor, excessive profanity, discussions of drugs or alcohol (even from an educational angle), videos about dangerous activities, or content that could be considered disturbing may be approved for the platform but marked as unsuitable for advertising. YouTube refers to this as "limited or no ads" (LNA) status. If a large portion of your library falls under LNA, reviewers may reject your application even if no individual video technically violates the rules.</P>

      <H2>The Role of Watch Time — Quality vs. Quantity</H2>
      <P>Reaching 4,000 watch hours sounds daunting, but the manner in which you accumulate those hours matters as much as the number itself. YouTube's algorithm weighs Average View Duration (AVD) and Audience Retention heavily. A channel that reaches 4,000 hours through a handful of long, well-watched videos is viewed far more favorably than one that barely scrapes 4,000 hours through hundreds of short clips with low retention.</P>
      <P>Aim for an audience retention rate above 50% on your videos. This means viewers are watching more than half of your average video. Strong retention signals to YouTube that your content is genuinely engaging, which helps during the human review process and improves your algorithmic visibility after approval.</P>

      <H2>Growing Subscribers Organically — What Actually Works</H2>
      <P>Reaching 1,000 subscribers requires a deliberate strategy. Simply uploading videos and hoping the algorithm finds them rarely works for new channels. The creators who reach 1,000 subscribers fastest tend to follow a predictable playbook.</P>
      <H3>Pick a Specific Niche and Stick to It</H3>
      <P>Channels that focus on a single, well-defined topic grow faster because YouTube can accurately categorize them and serve them to the right audience. A channel about "budget travel in Southeast Asia" will grow faster than a channel about "travel and cooking and tech reviews" because YouTube knows exactly who to recommend it to.</P>
      <H3>Optimize Your Titles and Thumbnails</H3>
      <P>Click-through rate (CTR) is one of the most important signals YouTube uses to decide whether to promote your videos. A strong thumbnail with clear text, contrasting colors, and a compelling visual combined with a title that creates curiosity or promises a clear benefit will outperform a generic thumbnail with your channel name on it every single time. Study the thumbnails of the top-performing videos in your niche and understand what patterns drive clicks.</P>
      <H3>Publish Consistently</H3>
      <P>YouTube rewards consistency. Channels that upload on a predictable schedule — whether that's daily, twice a week, or weekly — build subscriber habits. Viewers who know when to expect new content from a channel are more likely to return, watch fully, and subscribe. Even two uploads per week done consistently over six months will outperform sporadic daily uploads followed by long gaps.</P>
      <H3>Respond to Comments and Build Community</H3>
      <P>Engagement rate — the ratio of likes, comments, and shares relative to views — is a quality signal that YouTube uses in its ranking system. Replying to every comment in your first few hours after posting, asking genuine questions in your video, and pinning a comment to encourage discussion all improve your engagement rate and signal to YouTube that your audience finds your content worth interacting with.</P>

      <H2>YouTube Shorts and the 2024 Monetization Update</H2>
      <P>As of 2024 and continuing into 2025, YouTube has expanded its monetization eligibility for Shorts creators. There is now a separate "lighter" tier of YPP access that requires only 500 subscribers and 3,000 watch hours from long-form content, or 3 million Shorts views in the last 90 days. This tier grants access to channel memberships and Super Thanks, but not ad revenue from long-form videos.</P>
      <P>To unlock full ad revenue from your Shorts, you still need to meet the standard 1,000-subscriber and 4,000-watch-hour thresholds. Shorts watch time itself does not count toward the 4,000-hour requirement. However, Shorts are an extremely effective growth tool for rapidly building subscribers, which then accelerates your path to the 4,000-hour goal through increased visibility on long-form videos.</P>

      <H2>After Rejection — What to Do Next</H2>
      <P>Getting rejected from YPP is not a permanent ban. YouTube allows you to reapply after 30 days. But reapplying immediately without addressing the underlying reasons for rejection is a waste of time. Use the 30-day window strategically.</P>
      <P>First, carefully read the rejection email. YouTube typically provides a general category for rejection (content quality, advertiser-friendliness, etc.). Go through your entire video library with fresh eyes and ask yourself honestly: would a Fortune 500 brand want its advertisement to appear before this video? If the answer is no for more than 20% of your uploads, you need to clean up your library before reapplying.</P>
      <P>Second, consider unlisting or deleting low-quality, off-topic, or policy-adjacent videos. Your oldest content from when you were still finding your niche often does more harm than good during review. A tighter, more focused library of 40 strong videos is better than 200 mixed-quality uploads.</P>

      <Callout color="#00E5A0" icon="✓">
        <strong style={{ color:"rgba(255,255,255,0.8)" }}>Pro tip:</strong> After making improvements, run your channel through MonetizeCheck again before reapplying to get an updated eligibility score and confirm your content analysis has improved. This prevents wasting another 30-day waiting period on a rejection.
      </Callout>

      <H2>Tax and Payment Setup — Don't Get Caught Off Guard</H2>
      <P>Once approved for YPP, you'll need to complete your tax information in AdSense before receiving payments. Creators in most countries are required to submit a W-8BEN form (for non-US creators) or W-9 form (for US creators) declaring their tax status. Failure to complete this results in YouTube withholding 24% of your earnings as a precaution.</P>
      <P>Payments from YouTube are sent monthly, typically between the 21st and 26th of the month, for the previous month's earnings. The minimum payment threshold is $100. If your earnings don't reach $100 in a given month, the balance carries over to the next month.</P>

      <H2>Revenue Expectations — Being Realistic</H2>
      <P>YouTube ad revenue varies significantly by niche, audience location, and time of year. The metric used is CPM (Cost Per Mille), meaning the amount advertisers pay per 1,000 ad impressions. Finance and investing channels command CPMs of $20 to $50. Technology, software, and business channels typically see $8 to $20. Gaming, entertainment, and vlog content sits at $2 to $6. Channels with audiences primarily in the US, UK, Canada, and Australia earn higher CPMs than channels with audiences in developing markets.</P>
      <P>A realistic expectation for a newly monetized channel with 10,000 to 50,000 views per month is between $30 and $150 per month in ad revenue. Building a sustainable income from YouTube requires scale — typically 100,000 to 500,000 monthly views to earn $300 to $1,500 per month from ads alone. Most successful creators diversify their income with sponsorships, merchandise, digital products, and memberships alongside ad revenue.</P>

      <H2>Using MonetizeCheck Effectively</H2>
      <P>MonetizeCheck is designed to give you an honest, unbiased assessment of where your channel stands before you formally apply to YPP. Our AI analyzer reads your public channel data — subscriber count, video library, upload frequency, content topics, and policy signals — and generates a score out of 100 along with a detailed breakdown of every eligibility factor.</P>
      <P>Use MonetizeCheck at least once per month while you're growing your channel. Pay particular attention to the Content Analysis tab, which scores your original content quality, ad-friendliness, upload consistency, and engagement rate. These four scores together give you a realistic picture of what a YouTube reviewer would see when evaluating your application.</P>
      <P>The Action Plan tab provides prioritized recommendations specific to your channel's weakest areas. Address the top three items first — these are ordered by impact and fixing them will produce the greatest improvement in your eligibility score. Once your MonetizeCheck score consistently sits above 75, your channel is statistically in a strong position for approval.</P>

      <div style={{ marginTop:48, background:"rgba(0,229,160,0.05)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:16, padding:isMobile?20:32, textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:12 }}>🚀</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:10 }}>Ready to Check Your Channel?</h3>
        <P style={{ maxWidth:420, margin:"0 auto 20px" }}>Run a free AI analysis of your channel right now and get your personalized monetization score and action plan.</P>
        <button onClick={()=>setPage("home")} style={{ background:"linear-gradient(135deg,#00C980,#00A870)", color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 20px rgba(0,201,128,0.22)" }}>
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

      {/* Hero */}
      <div style={{ marginBottom:44 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:18 }}>
          <span style={{ fontSize:10, color:"#00E5A0", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>ABOUT MONETIZECHECK</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:800, color:"#fff", letterSpacing:-1.5, marginBottom:14, lineHeight:1.06 }}>Built for Creators,<br/>by a Creator</h1>
        <P>MonetizeCheck was born out of a frustration that tens of thousands of YouTube creators experience every year — spending months building a channel, hitting the subscriber and watch hour milestones, applying for YPP, and then getting rejected without a clear explanation. This tool exists so that no creator has to guess whether they're actually ready.</P>
      </div>

      {/* Mission */}
      <div style={{ background:"rgba(0,229,160,0.04)", border:"1px solid rgba(0,229,160,0.14)", borderRadius:20, padding:isMobile?20:32, marginBottom:14 }}>
        <div style={{ fontSize:26, marginBottom:12 }}>🎯</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:"#fff", marginBottom:10 }}>Our Mission</h3>
        <P>Give every YouTube creator — beginner or seasoned — a clear, honest picture of where their channel stands against YouTube's Partner Program requirements. No logins, no subscriptions, no paywalls. Just answers. MonetizeCheck analyzes your publicly available channel data using AI and cross-references it with YouTube's official YPP policies to generate a detailed eligibility report in under 30 seconds.</P>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:10, marginBottom:36 }}>
        {[["10,000+","Channels Analyzed"],["100%","Free Forever"],["2025","Year Launched"],["1","Creator Behind It"]].map(([v,l])=>(
          <div key={l} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"18px 14px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:800, color:"#00E5A0", fontFamily:"'Syne',sans-serif", letterSpacing:-0.5, marginBottom:6 }}>{v}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Mono',monospace", letterSpacing:1.5, textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      <H2>The Problem MonetizeCheck Solves</H2>
      <P>The YouTube Partner Program is not a simple checkbox system. Yes, there are numerical thresholds — 1,000 subscribers and 4,000 watch hours — but getting approved requires meeting a much broader set of standards that YouTube does not make entirely transparent. Creators who reach the milestones and apply are often blindsided when their application comes back rejected after a 30-day wait, with only a vague explanation pointing toward "content quality" or "advertiser guidelines."</P>
      <P>This gap between meeting the numbers and understanding the full picture is what MonetizeCheck was designed to close. Our AI doesn't just check your subscriber count. It evaluates your content originality, your upload consistency, your video-level ad-friendliness, your community guideline standing, and a dozen other signals that YouTube's own reviewers consider when evaluating an application. The result is a score and a prioritized action plan — so you know exactly where you stand and exactly what to fix before you spend another 30 days waiting.</P>

      <H2>Who Is FFDRYT?</H2>
      <P>FFDRYT is an independent developer, IT technician, and YouTube creator based in Gujarat, India. The name comes from a personal handle used across YouTube and social platforms. FFDRYT built MonetizeCheck as a solo project during a period of hands-on learning in cloud computing, web development, and AI integration — turning a real frustration into a useful free tool for other creators.</P>
      <P>As someone who has been through the process of building a channel from zero, studying monetization requirements, and navigating YouTube's opaque review system, FFDRYT brings a creator-first perspective to every feature decision. The tool is designed the way a creator would want it to be: fast, honest, and free — with no account required and no data stored.</P>
      <P>MonetizeCheck is currently a solo project. Every design decision, every piece of code, every line of content, and every AI prompt that powers the analysis was built by one person with the goal of making the creator journey a little less confusing.</P>

      {/* Two cards */}
      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:12, marginBottom:12 }}>
        {[
          { icon:"F", iconBg:"linear-gradient(135deg,#00E5A0,#00A870)", title:"Created by FFDRYT", body:"FFDRYT is an independent developer and YouTube creator who built MonetizeCheck to solve a real problem: knowing when your channel is actually ready to monetize — before wasting months going in the wrong direction. Every feature is informed by real experience building a channel from scratch." },
          { icon:"🤖", iconBg:"rgba(0,184,255,0.15)", title:"Powered by AI", body:"MonetizeCheck uses large language models to analyze publicly available channel data, cross-reference it with YouTube's official YPP guidelines, and generate a personalized eligibility score and action plan — all in under 30 seconds. No YouTube API key or login required." },
        ].map(c=>(
          <div key={c.title} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:isMobile?20:26 }}>
            <div style={{ width:46, height:46, background:c.iconBg, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:14, fontWeight:900, color:"#fff" }}>{c.icon}</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:8 }}>{c.title}</h3>
            <P style={{ marginBottom:0, fontSize:12 }}>{c.body}</P>
          </div>
        ))}
      </div>

      <H2>Our Commitment to Creator Privacy</H2>
      <P>MonetizeCheck was built with privacy as a core principle, not an afterthought. When you paste your YouTube channel URL into our tool, we only read information that is already publicly visible to anyone who visits your channel page. We do not require you to log in with your Google account. We do not access your YouTube Studio analytics. We do not read your private videos, unlisted videos, subscriber lists, or any other data that is not publicly accessible.</P>
      <P>We do not store your channel URL, your analysis results, or any identifying information after your session ends. When you close the browser tab, your report is gone permanently. This is by design. We believe creators should be able to get honest feedback about their channel without worrying about who else can see that information.</P>
      <P>The only data we collect is completely anonymous — aggregate counts of how many analyses have been run, which help us improve the tool over time. This data contains no personally identifiable information and cannot be traced back to any individual user or channel.</P>

      <H2>How the AI Analysis Works</H2>
      <P>When you submit a channel URL, MonetizeCheck sends a request to our backend, which reads the publicly available data on your YouTube channel page. This includes your channel name, subscriber count (if public), total video count, upload frequency over recent months, video titles, video duration patterns, and visible community guideline standing.</P>
      <P>This data is passed to a large language model trained to evaluate YouTube channels against the YPP eligibility framework. The AI generates a structured analysis covering six key dimensions: YPP numerical requirements, content originality, ad-friendliness, upload consistency, engagement signals, and policy compliance. Each dimension receives a score from 0 to 100, and these are weighted and combined into an overall eligibility score.</P>
      <P>The AI also generates a plain-language summary of your channel's current standing and a prioritized list of recommendations ordered by impact. The highest-priority recommendations address the factors most likely to cause a rejection or significantly improve your score if fixed. The analysis typically completes in 10 to 25 seconds depending on the size of your channel's public data.</P>

      {/* How it works steps */}
      <H2>Step-by-Step: How to Use MonetizeCheck</H2>
      <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:36 }}>
        {[
          { n:"01", color:"#00E5A0", title:"Enter Your Channel URL", desc:"Paste any YouTube channel URL, handle (@channel), or channel ID starting with UC. MonetizeCheck accepts all three formats automatically." },
          { n:"02", color:"#00B8FF", title:"AI Scans Public Data", desc:"Our backend reads your public channel page — subscriber count, video count, upload frequency, titles, and community guideline signals." },
          { n:"03", color:"#F5A623", title:"Policy & Content Audit", desc:"The AI cross-checks your content against YouTube's advertiser-friendly guidelines and community policies, flagging any risk areas." },
          { n:"04", color:"#A78BFA", title:"Score & Verdict", desc:"You receive an overall monetization score out of 100, plus a pass/fail assessment for each individual YPP requirement." },
          { n:"05", color:"#FF4757", title:"Personalized Action Plan", desc:"A prioritized list of exactly what to fix, ordered by impact. The top three items will move your score the most." },
        ].map((s,i,arr)=>(
          <div key={i} style={{ display:"flex" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:18, flexShrink:0 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${s.color}18`, border:`1px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:s.color, fontFamily:"'DM Mono',monospace", marginTop:2 }}>{s.n}</div>
              {i<arr.length-1&&<div style={{ width:1, flex:1, minHeight:26, background:`linear-gradient(${s.color}40,${arr[i+1].color}40)`, margin:"4px 0" }}/>}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?20:0, paddingTop:6, flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:4, fontFamily:"'Syne',sans-serif" }}>{s.title}</div>
              <P style={{ margin:0, fontSize:12 }}>{s.desc}</P>
            </div>
          </div>
        ))}
      </div>

      <H2>Future Plans for MonetizeCheck</H2>
      <P>MonetizeCheck is an actively developed tool. The roadmap includes several planned improvements based on creator feedback and evolving YouTube policies. Upcoming features include a channel comparison tool (benchmark your metrics against similar channels in your niche), a historical score tracker (monitor your eligibility improvement over weeks and months), email alerts when your channel crosses key thresholds, and an expanded video-by-video analysis with more detailed content scoring.</P>
      <P>There are also plans to add a YouTube Shorts-specific analysis track, reflecting YouTube's evolving policies around Shorts monetization. As YouTube continues to update its YPP criteria, MonetizeCheck's AI analysis will be updated to match, ensuring the tool always reflects the current state of the program.</P>
      <P>If you have a feature request, have encountered a bug, or want to suggest an improvement, the best way to reach FFDRYT is through the contact channels listed below. Genuine creator feedback directly shapes what gets built next.</P>

      {/* What we don't do */}
      <div style={{ background:"rgba(255,71,87,0.04)", border:"1px solid rgba(255,71,87,0.14)", borderRadius:16, padding:isMobile?18:24, marginBottom:32 }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:"#FF4757", marginBottom:14 }}>⚠ What MonetizeCheck Does NOT Do</h3>
        <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:8 }}>
          {["Access private channel data or analytics","Require any YouTube login or API token","Guarantee monetization approval by YouTube","Store or share your channel information","Make decisions on behalf of YouTube","Provide legal or financial advice of any kind"].map(item=>(
            <div key={item} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <span style={{ color:"#FF4757", fontSize:13, flexShrink:0 }}>✕</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)", lineHeight:1.7, fontFamily:"'Inter',sans-serif" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:isMobile?18:24, marginBottom:24 }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:10 }}>Get in Touch</h3>
        <P style={{ marginBottom:16 }}>Have a suggestion, found a bug, or want to collaborate? Reach out through any of the channels below. Responses typically arrive within 24 to 48 hours.</P>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[["Instagram","@FFDRYT","#00B8FF"],["YouTube","youtube.com/@ffdryt","#FF4757"],["Email","brazilserverop9@gmail.com","#00E5A0"]].map(([p,v,c])=>(
            <div key={p} style={{ background:`${c}08`, border:`1px solid ${c}25`, borderRadius:10, padding:"10px 16px" }}>
              <div style={{ fontSize:9, color:c, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, marginBottom:4 }}>{p}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontFamily:"'Inter',sans-serif" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:"center" }}>
        <button onClick={()=>setPage("home")} style={{ background:"linear-gradient(135deg,#00C980,#00A870)", color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 20px rgba(0,201,128,0.22)" }}>
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
      <span style={{ color:"#00E5A0", fontSize:14, flexShrink:0, marginTop:1 }}>›</span>
      <span>{children}</span>
    </div>
  );
  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:`56px ${pad}px 80px`, animation:"slideUp .5s ease" }}>
      <div style={{ marginBottom:44 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:16 }}>
          <span style={{ fontSize:10, color:"#00E5A0", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>LEGAL</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,5vw,44px)", fontWeight:800, color:"#fff", letterSpacing:-1, marginBottom:10, lineHeight:1.1 }}>Privacy Policy</h1>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.28)", fontFamily:"'DM Mono',monospace" }}>Last updated: {today}</p>
      </div>
      <div style={{ background:"rgba(0,229,160,0.05)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:14, padding:"16px 20px", marginBottom:36, display:"flex", gap:12, alignItems:"flex-start" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🔒</span>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontFamily:"'Inter',sans-serif", margin:0 }}>
          <strong style={{ color:"#00E5A0" }}>Short version:</strong> MonetizeCheck does not collect personal data, does not require login, and does not store anything about you or your YouTube channel. We only read publicly available data.
        </p>
      </div>
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:isMobile?20:36 }}>
        <Sec title="1. Introduction">
          <p style={{ marginBottom:10 }}>MonetizeCheck ("we", "our", "us") is a free tool created by FFDRYT to help YouTube creators assess their channel's monetization eligibility. This Privacy Policy explains how we handle data when you use our website and services.</p>
          <p>By using MonetizeCheck, you agree to the practices described in this policy.</p>
        </Sec>
        <Sec title="2. Information We Do NOT Collect">
          <p style={{ marginBottom:12 }}>MonetizeCheck is designed with privacy-by-default. We do <strong style={{ color:"rgba(255,255,255,0.75)" }}>not</strong> collect, store, or process:</p>
          <Li>Your name, email address, or any personal identifiers</Li>
          <Li>YouTube account credentials or private channel data</Li>
          <Li>OAuth tokens or any form of YouTube account authorization</Li>
          <Li>Payment information of any kind</Li>
          <Li>Device fingerprints or persistent user identifiers</Li>
          <Li>Any data from inside your YouTube Studio dashboard</Li>
        </Sec>
        <Sec title="3. Information We DO Process">
          <p style={{ marginBottom:12 }}>When you submit a YouTube channel URL, our service temporarily processes:</p>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Publicly available channel data</strong> — channel name, subscriber count (if public), video titles, upload dates, and other information visible on the public YouTube page.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>The URL you submit</strong> — used solely to identify which channel to analyze. It is not stored after analysis.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Basic usage analytics</strong> — anonymous, aggregated data such as page views and analysis request counts, which do not identify individual users.</Li>
        </Sec>
        <Sec title="4. How We Use Data">
          <p style={{ marginBottom:12 }}>The data we process is used exclusively to:</p>
          <Li>Generate your channel's monetization eligibility report</Li>
          <Li>Improve the accuracy of our AI analysis model (using anonymized, aggregated patterns only)</Li>
          <Li>Monitor service performance and prevent abuse</Li>
          <p style={{ marginTop:10 }}>We do not sell, rent, trade, or share any data with third parties for marketing purposes.</p>
        </Sec>
        <Sec title="5. Third-Party Services">
          <p style={{ marginBottom:12 }}>MonetizeCheck may use the following third-party services, each with their own privacy policies:</p>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Google Fonts</strong> — used to load typography. May log the request IP address per Google's standard practices.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>YouTube Data</strong> — we access only publicly available YouTube pages, the same data any visitor can see. We are not affiliated with YouTube or Google LLC.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>AI / LLM Providers</strong> — channel data may be passed to an AI service for analysis. This data is public and contains no personal information.</Li>
        </Sec>
        <Sec title="6. Cookies">
          <p style={{ marginBottom:12 }}>MonetizeCheck uses minimal cookies:</p>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Strictly necessary cookies</strong> — required for the website to function. These cannot be disabled.</Li>
          <Li><strong style={{ color:"rgba(255,255,255,0.65)" }}>Analytics cookies</strong> — anonymous, aggregated usage data. No personal identifiers are stored.</Li>
          <p style={{ marginTop:10 }}>We do not use advertising cookies or third-party tracking cookies.</p>
        </Sec>
        <Sec title="7. Data Retention"><p>Because we do not store personal data or channel reports on our servers, there is nothing to retain or delete. Each analysis request is processed in real time and the results exist only in your browser session. Closing your browser tab discards the results permanently.</p></Sec>
        <Sec title="8. Children's Privacy"><p>MonetizeCheck is intended for users aged 13 and older, consistent with YouTube's own Terms of Service. We do not knowingly collect any data from children under 13.</p></Sec>
        <Sec title="9. Your Rights">
          <p style={{ marginBottom:12 }}>Depending on your location, you may have the right to:</p>
          <Li>Access the personal data we hold about you (in our case, there is none)</Li>
          <Li>Request deletion of any data associated with you</Li>
          <Li>Object to processing of your data</Li>
          <Li>Lodge a complaint with a data protection authority</Li>
        </Sec>
        <Sec title="10. Security"><p>All data transmitted between your browser and MonetizeCheck is encrypted via HTTPS/TLS. Since we do not store personal data or credentials, the risk of a data breach affecting your personal information is minimal.</p></Sec>
        <Sec title="11. Changes to This Policy"><p>We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last updated" date at the top of this page. Continued use of MonetizeCheck after changes constitutes acceptance of the revised policy.</p></Sec>
        <Sec title="12. Contact Us">
          <p style={{ marginBottom:16 }}>If you have questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
          <div style={{ background:"rgba(0,229,160,0.05)", border:"1px solid rgba(0,229,160,0.15)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:2.2, fontFamily:"'DM Mono',monospace" }}>
              <div><span style={{ color:"rgba(255,255,255,0.28)" }}>Creator: </span>FFDRYT</div>
              <div><span style={{ color:"rgba(255,255,255,0.28)" }}>Email: </span>brazilserverop9@gmail.com</div>
              <div><span style={{ color:"rgba(255,255,255,0.28)" }}>YouTube: </span>@FFDRYT</div>
            </div>
          </div>
        </Sec>
      </div>
    </div>
  );
};

/* ══════════════════════════ HOME EDUCATIONAL CONTENT ══════════════════════ */
const HomeEducationalContent = ({ isMobile, isTablet, setPage }) => {
  const P = ({ children }) => <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.9, marginBottom:14, fontFamily:"'Inter',sans-serif", fontWeight:300 }}>{children}</p>;
  return (
    <section style={{ padding:`${isMobile?48:80}px 0`, borderTop:"1px solid rgba(255,255,255,0.05)" }}>

      {/* What is YPP */}
      <div style={{ marginBottom:56 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,184,255,0.07)", border:"1px solid rgba(0,184,255,0.18)", borderRadius:24, padding:"5px 14px", marginBottom:20 }}>
          <span style={{ fontSize:10, color:"#00B8FF", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>YOUTUBE PARTNER PROGRAM · EXPLAINED</span>
        </div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,4vw,38px)", fontWeight:800, color:"#fff", letterSpacing:-1, marginBottom:18, lineHeight:1.1, maxWidth:680 }}>What Is the YouTube Partner Program and Who Qualifies?</h2>
        <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:isMobile?0:32 }}>
          <div>
            <P>The YouTube Partner Program (YPP) is Google's official system for sharing advertising revenue with YouTube creators. When your channel is approved, Google places ads on your videos and you receive approximately 55% of the ad revenue generated. For creators with large, engaged audiences in high-CPM niches like finance, technology, or education, this can represent thousands of dollars per month. For most creators, it represents a meaningful supplement that makes the work of content creation financially sustainable.</P>
            <P>To qualify for YPP in 2025, your channel needs to satisfy four simultaneous requirements: at least 1,000 subscribers, at least 4,000 valid public watch hours in the past 12 months, no active Community Guidelines strikes, and an active Google AdSense account linked to your channel. Meeting all four gets your application into the review queue, where a team of reviewers evaluates your entire channel for advertiser-friendliness.</P>
          </div>
          <div>
            <P>What many creators don't realize is that meeting the numbers is only the first step. YouTube's reviewers look far beyond subscriber count and watch hours. They evaluate whether your content is original (not just reposted or aggregated from other sources), whether your videos are suitable for brand advertising (no excessive profanity, violence, controversial politics, or sensitive topics without appropriate context), and whether your channel has a coherent identity and genuine value for viewers.</P>
            <P>This is where MonetizeCheck comes in. Our AI evaluates your channel against all of these dimensions simultaneously — not just the numbers — and gives you a score out of 100 along with a specific action plan. Creators who address the recommendations before applying have a significantly higher approval rate than those who apply the moment they hit 1,000 subscribers and 4,000 hours.</P>
          </div>
        </div>
      </div>

      {/* Requirements grid */}
      <div style={{ marginBottom:56 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(20px,3vw,32px)", fontWeight:800, color:"#fff", letterSpacing:-0.8, marginBottom:20, lineHeight:1.2 }}>The 4 YPP Requirements — In Detail</h2>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?1:2},1fr)`, gap:12 }}>
          {[
            { icon:"👥", color:"#00E5A0", title:"1,000 Subscribers", body:"You need 1,000 real, organic subscribers. YouTube actively detects and removes sub-for-sub and purchased subscribers. Building genuine subscribers requires consistent, quality content in a defined niche over 3 to 12 months depending on competition and content quality." },
            { icon:"⏱", color:"#00B8FF", title:"4,000 Watch Hours (12 months)", body:"Only watch time from public, long-form videos counts. Shorts, private videos, and deleted videos are excluded. The 12-month rolling window means old watch hours expire — active uploading is essential to maintain your total above the threshold." },
            { icon:"🛡", color:"#F5A623", title:"No Active Community Strikes", body:"A single active Community Guidelines strike disqualifies your application. Strikes expire after 90 days, but having had strikes in the past can still raise red flags during human review, especially if the offending content is still public on your channel." },
            { icon:"💳", color:"#A78BFA", title:"Linked AdSense Account", body:"An active Google AdSense account must be linked before you can receive payments. If you're under 18, AdSense requires a parent or guardian to hold the account in some countries. The account also requires accurate tax information submission before any payments are released." },
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

      {/* Why channels get rejected */}
      <div style={{ marginBottom:56 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(20px,3vw,32px)", fontWeight:800, color:"#fff", letterSpacing:-0.8, marginBottom:16, lineHeight:1.2 }}>Why Channels Get Rejected from YPP — The Real Reasons</h2>
        <P>The most common reason creators get rejected from YPP despite meeting the numerical requirements is low content quality or poor advertiser-friendliness — and neither of these is directly visible in the basic metrics. YouTube's review team looks at your last 20 to 30 videos and asks a simple question: would a mainstream advertiser be comfortable having their brand associated with this content?</P>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?1:isTablet?2:3},1fr)`, gap:10, marginBottom:20 }}>
          {[
            { color:"#FF4757", title:"Reposted or Compilation Content", desc:"Channels that primarily upload other creators' content, news clips, movie scenes, or sports highlights without adding meaningful commentary are frequently rejected for lack of originality." },
            { color:"#F5A623", title:"No Clear Channel Identity", desc:"If your channel uploads gaming one week, cooking tutorials the next, and political commentary after that, reviewers see an unfocused channel without a genuine audience. Niche consistency matters." },
            { color:"#A78BFA", title:"Excessive Profanity or Mature Themes", desc:"Content that is technically allowed on YouTube but not suitable for advertising — excessive profanity, violence, adult humor, or disturbing imagery — triggers limited or no ads flags that can sink an application." },
            { color:"#00B8FF", title:"Very Low Watch Time Retention", desc:"If viewers consistently drop off within the first 30 seconds of your videos, it signals poor content quality. Average audience retention below 30% across your library is a significant red flag." },
            { color:"#00E5A0", title:"Inactive or Inconsistent Uploading", desc:"A channel that uploaded 50 videos two years ago and then went quiet raises questions about whether it's still active and worth admitting to the program. Recent, consistent activity matters." },
            { color:"#FF8C42", title:"Misleading Titles or Thumbnails", desc:"YouTube's policies explicitly prohibit misleading metadata. Channels using clickbait thumbnails or titles that don't match video content are flagged for deceptive practices and routinely rejected." },
          ].map(r=>(
            <div key={r.title} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${r.color}18`, borderRadius:14, padding:"18px 16px" }}>
              <div style={{ fontSize:10, color:r.color, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>REJECTION REASON</div>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:8, fontFamily:"'Syne',sans-serif" }}>{r.title}</div>
              <P>{r.desc}</P>
            </div>
          ))}
        </div>
      </div>

      {/* Tips to grow */}
      <div style={{ marginBottom:56 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(20px,3vw,32px)", fontWeight:800, color:"#fff", letterSpacing:-0.8, marginBottom:16, lineHeight:1.2 }}>Proven Strategies to Reach 1,000 Subscribers Faster</h2>
        <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:isMobile?0:32 }}>
          <div>
            <P>Growing a YouTube channel to 1,000 subscribers is one of the most psychologically difficult milestones in the creator journey — not because it is technically hard, but because progress feels slow and unpredictable in the early months. Understanding what actually drives subscriber growth changes the approach entirely.</P>
            <P><strong style={{ color:"rgba(255,255,255,0.7)" }}>Choose a specific, searchable niche.</strong> Generic channels compete against every other creator on YouTube. Niche channels compete against a much smaller pool and get recommended to a more targeted audience. "Budget travel in South Asia" will grow faster than "travel vlogs" because YouTube can accurately match it to people already watching similar content.</P>
            <P><strong style={{ color:"rgba(255,255,255,0.7)" }}>Front-load your videos with value.</strong> The first 30 seconds determine whether a viewer stays or leaves. Open with your most compelling point, not an introduction about who you are. High audience retention tells YouTube's algorithm that your content is good, which triggers wider distribution.</P>
          </div>
          <div>
            <P><strong style={{ color:"rgba(255,255,255,0.7)" }}>Create evergreen content.</strong> Evergreen videos — tutorials, how-to guides, and educational content that remains relevant for years — continue generating views and subscribers long after publication. A tutorial you made two years ago that still answers a common question will send people to subscribe far more reliably than trending content that dies in a week.</P>
            <P><strong style={{ color:"rgba(255,255,255,0.7)" }}>Optimize your end screens and cards.</strong> Every video should direct viewers to another video with a relevant call to action. End screens are your most powerful tool for converting viewers into subscribers — use them on every upload with at least one subscribe prompt and one related video recommendation.</P>
            <P><strong style={{ color:"rgba(255,255,255,0.7)" }}>Post community updates and polls.</strong> The Community tab keeps subscribers engaged between uploads. Regular posts, polls, and behind-the-scenes updates build a sense of connection that makes subscribers more likely to watch your next video when it publishes.</P>
          </div>
        </div>
      </div>

      {/* CTA to guide */}
      <div style={{ background:"rgba(0,184,255,0.04)", border:"1px solid rgba(0,184,255,0.16)", borderRadius:20, padding:isMobile?20:36, textAlign:"center" }}>
        <div style={{ fontSize:26, marginBottom:12 }}>📖</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:10 }}>Want the Full YPP Strategy Guide?</h3>
        <P>Read our complete guide covering every aspect of YouTube monetization — requirements, content strategy, revenue expectations, handling rejection, and more.</P>
        <button onClick={()=>setPage("guide")} style={{ background:"rgba(0,184,255,0.12)", color:"#00B8FF", border:"1px solid rgba(0,184,255,0.3)", borderRadius:12, padding:"12px 28px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .2s" }}>
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

      {/* Hero */}
      <section style={{ padding:`${isMobile?40:76}px 0 ${isMobile?28:52}px`, animation:"slideUp .6s ease" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:24, padding:"6px 14px", marginBottom:isMobile?18:26 }}>
          <span style={{ fontSize:11 }}>✦</span>
          <span style={{ fontSize:isMobile?10:11, color:"#00E5A0", letterSpacing:1.5, fontFamily:"'DM Mono',monospace" }}>FREE AI-POWERED ANALYZER</span>
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(30px,7vw,66px)", fontWeight:800, color:"#fff", lineHeight:1.06, letterSpacing:-2, marginBottom:16, maxWidth:680 }}>
          Is Your Channel<br/>
          <span style={{ background:"linear-gradient(135deg,#00E5A0 0%,#00B8FF 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Ready to Earn?</span>
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
            { icon:"◉", color:"#00E5A0", title:"Monetization Score",   desc:"AI eligibility score out of 100" },
            { icon:"◈", color:"#00B8FF", title:"YPP Requirements",     desc:"Subs, watch hours & account check" },
            { icon:"▦", color:"#A78BFA", title:"Video-by-Video Audit", desc:"Ad score and issue flags per video" },
            { icon:"◻", color:"#F5A623", title:"Policy Compliance",    desc:"Copyright & guidelines scan" },
            { icon:"▲", color:"#FF4757", title:"Personalized Plan",    desc:"Step-by-step fixes by priority" },
            { icon:"⬡", color:"#00E5A0", title:"Download Report",      desc:"Export full .docx report" },
          ].map(f=><FeatureCard key={f.title} {...f} accent={f.color}/>)}
        </div>
      </section>

      {/* Search */}
      <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:`${isMobile?18:24}px ${isMobile?14:26}px`, marginBottom:16, backdropFilter:"blur(12px)" }}>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.22)", letterSpacing:2.5, marginBottom:12, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>Enter YouTube Channel URL or Handle</div>
        <div style={{ display:"flex", gap:10, flexDirection:isMobile?"column":"row" }}>
          <input ref={inputRef} value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}
            placeholder="youtube.com/@channel  ·  @handle  ·  UC..."
            style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 16px", color:"rgba(255,255,255,0.85)", fontSize:14, fontFamily:"'Inter',sans-serif", transition:"border .2s, box-shadow .2s", width:"100%", outline:"none" }}/>
          <button className="btn-primary" onClick={analyze} disabled={loading}
            style={{ background:loading?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#00C980,#00A870)", color:loading?"rgba(255,255,255,0.25)":"#fff", border:"none", borderRadius:12, padding:isMobile?"14px":"14px 26px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:loading?"not-allowed":"pointer", letterSpacing:0.3, whiteSpace:"nowrap", boxShadow:loading?"none":"0 4px 20px rgba(0,201,128,0.22)", transition:"all .2s", width:isMobile?"100%":"auto" }}>
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

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"72px 20px", animation:"fadeIn .4s ease" }}>
          <div style={{ position:"relative", width:70, height:70, margin:"0 auto 26px" }}>
            <div style={{ width:70, height:70, border:"2px solid rgba(255,255,255,0.05)", borderTop:"2px solid #00E5A0", borderRadius:"50%", animation:"spin .9s linear infinite" }}/>
            <div style={{ position:"absolute", inset:10, border:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(0,229,160,0.3)", borderRadius:"50%", animation:"spin 1.8s linear infinite reverse" }}/>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:"#00E5A0", boxShadow:"0 0 14px #00E5A0" }}/>
          </div>
          <div style={{ fontSize:12, color:"#00E5A0", letterSpacing:2, marginBottom:14, animation:"pulse 1.6s ease infinite", fontFamily:"'DM Mono',monospace" }}>{STEPS[loadingStep]}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:10 }}>
            {STEPS.map((_,i)=><div key={i} style={{ width:isMobile?18:28, height:3, background:i<=loadingStep?"#00E5A0":"rgba(255,255,255,0.07)", borderRadius:2, transition:"background .4s" }}/>)}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"'DM Mono',monospace" }}>Usually takes 10–25 seconds</div>
        </div>
      )}

      {/* Results */}
      {data && (() => {
        const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
        const vc = getVerdictConfig(me?.verdict);
        return (
          <div style={{ animation:"slideUp .5s ease" }}>
            {/* Channel Card */}
            <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:`${isMobile?16:22}px ${isMobile?14:24}px`, marginBottom:12 }}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:isMobile?"wrap":"nowrap" }}>
                <div style={{ width:54, height:54, background:"linear-gradient(135deg,#00E5A0,#00A870)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#fff", flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{channel?.name?.[0]?.toUpperCase()||"Y"}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:isMobile?17:20, fontWeight:800, color:"#fff", letterSpacing:-0.5, marginBottom:8, fontFamily:"'Syne',sans-serif", wordBreak:"break-word" }}>{channel?.name}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <Pill color="rgba(0,229,160,0.3)">{channel?.handle}</Pill>
                    <Pill>{channel?.category}</Pill>
                    <Pill>{channel?.country}</Pill>
                    {!isMobile&&<Pill>Joined {channel?.joinedDate}</Pill>}
                  </div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:8, marginTop:14 }}>
                <StatCard label="Subscribers" value={channel?.subscribers} color="#00E5A0"/>
                <StatCard label="Total Videos" value={channel?.totalVideos}/>
                <StatCard label="Total Views"  value={channel?.totalViews}/>
                <StatCard label="Avg / Video"  value={channel?.avgViewsPerVideo}/>
              </div>
            </div>

            {/* Verdict Card */}
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
                        style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,184,255,0.09)", color:downloading?"rgba(255,255,255,0.3)":"#00B8FF", border:"1px solid rgba(0,184,255,0.22)", borderRadius:10, padding:"10px 16px", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:12, cursor:downloading?"not-allowed":"pointer", transition:"all .2s", width:isMobile?"100%":"auto", justifyContent:"center" }}>
                        ↓ {downloading?"Building…":"Download Report (.docx)"}
                      </button>
                    )}
                    <button onClick={copyResult} style={{ background:"rgba(255,255,255,0.04)", color:copied?"#00E5A0":"rgba(255,255,255,0.35)", border:`1px solid ${copied?"rgba(0,229,160,0.28)":"rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"10px 16px", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", transition:"all .2s", fontWeight:500, width:isMobile?"100%":"auto" }}>
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

            {/* YPP Quick Grid */}
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:4},1fr)`, gap:8, marginBottom:12 }}>
              {[
                { lbl:"Subscribers", met:me?.ytpRequirements?.subscribers?.met, req:"1,000 min" },
                { lbl:"Watch Hours", met:me?.ytpRequirements?.watchHours?.met, req:"4,000 hrs" },
                { lbl:"Guidelines",  met:me?.ytpRequirements?.communityGuidelines?.met, req:"No violations" },
                { lbl:"AdSense",     met:me?.ytpRequirements?.adsenseLinked?.met, req:"Must be linked" },
              ].map(s=>(
                <div key={s.lbl} style={{ background:`${s.met?"rgba(0,229,160,0.04)":"rgba(255,71,87,0.04)"}`, border:`1px solid ${s.met?"rgba(0,229,160,0.14)":"rgba(255,71,87,0.14)"}`, borderRadius:12, padding:"13px 14px" }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.22)", letterSpacing:1.5, marginBottom:8, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>{s.lbl}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:s.met?"#00E5A0":"#FF4757", boxShadow:`0 0 7px ${s.met?"#00E5A0":"#FF4757"}`, flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:s.met?"#00E5A0":"#FF4757", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{s.met?"Pass":"Fail"}</span>
                  </div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.18)", fontFamily:"'DM Mono',monospace" }}>{s.req}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:16, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
              {[{ id:"overview",l:"Overview"},{ id:"videos",l:`Videos (${videos?.length||0})`},{ id:"policy",l:"Policy"},{ id:"tips",l:"Action Plan"},{ id:"timeline",l:"Roadmap"},{ id:"faq",l:"FAQ"}].map(t=>(
                <button key={t.id} className="tab-btn" onClick={()=>setActiveTab(t.id)}
                  style={{ background:"none", border:"none", borderBottom:activeTab===t.id?"2px solid #00E5A0":"2px solid transparent", color:activeTab===t.id?"#00E5A0":"rgba(255,255,255,0.28)", padding:`10px ${isMobile?11:16}px`, fontFamily:"'Inter',sans-serif", fontSize:isMobile?11:12, fontWeight:600, cursor:"pointer", marginBottom:-1, whiteSpace:"nowrap", transition:"color .2s" }}>
                  {t.l}
                </button>
              ))}
            </div>

            {activeTab==="overview" && (
              <div style={{ display:"grid", gridTemplateColumns:isDesktop?"1fr 1fr":"1fr", gap:12 }}>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#00E5A0", boxShadow:"0 0 8px #00E5A0" }}/>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.28)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>YPP Requirements</span>
                  </div>
                  {me?.ytpRequirements && Object.entries(me.ytpRequirements).map(([key,val])=>(
                    <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <div>
                        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", textTransform:"capitalize", fontFamily:"'Inter',sans-serif" }}>{key.replace(/([A-Z])/g," $1")}</div>
                        {val.required!=null&&<div style={{ fontSize:10, color:"rgba(255,255,255,0.18)", marginTop:2, fontFamily:"'DM Mono',monospace" }}>need {val.required?.toLocaleString()} · est {val.estimated?.toLocaleString()}</div>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:val.met?"#00E5A0":"#FF4757", boxShadow:`0 0 6px ${val.met?"#00E5A0":"#FF4757"}` }}/>
                        <span style={{ fontSize:10, color:val.met?"#00E5A0":"#FF4757", fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>{val.met?"PASS":"FAIL"}</span>
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
                  <div style={{ background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.18)", borderRadius:10, padding:"7px 14px", fontSize:11, color:"#00E5A0", fontFamily:"'DM Mono',monospace", letterSpacing:1.5 }}>✓ {(videos||[]).filter(v=>v.monetizable).length} Monetizable</div>
                  <div style={{ background:"rgba(255,71,87,0.07)", border:"1px solid rgba(255,71,87,0.18)", borderRadius:10, padding:"7px 14px", fontSize:11, color:"#FF4757", fontFamily:"'DM Mono',monospace", letterSpacing:1.5 }}>✕ {(videos||[]).filter(v=>!v.monetizable).length} Blocked</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(videos||[]).map((v,i)=>(
                    <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${v.monetizable?"rgba(255,255,255,0.07)":"rgba(255,71,87,0.15)"}`, borderRadius:14, padding:`${isMobile?12:16}px ${isMobile?12:18}px`, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <div style={{ width:42, height:42, background:v.monetizable?"rgba(0,229,160,0.08)":"rgba(255,71,87,0.08)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, border:`1px solid ${v.monetizable?"rgba(0,229,160,0.14)":"rgba(255,71,87,0.14)"}` }}>{v.monetizable?"💰":"🚫"}</div>
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
                  <div style={{ width:7, height:7, borderRadius:"50%", background:"#00B8FF", boxShadow:"0 0 8px #00B8FF" }}/>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.28)", letterSpacing:2.5, fontFamily:"'DM Mono',monospace", textTransform:"uppercase" }}>Policy Compliance Audit</span>
                </div>
                {me?.policyCompliance && Object.entries(me.policyCompliance).map(([key,val])=>{
                  const good = val===true||val==="CLEAN"||val==="SAFE"||val==="LOW"||(typeof val==="boolean"&&!val&&(key==="communityStrike"||key==="ageRestricted"));
                  return (
                    <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:good?"#00E5A0":"#FF4757", boxShadow:`0 0 6px ${good?"#00E5A0":"#FF4757"}`, flexShrink:0 }}/>
                        <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13, textTransform:"capitalize", fontFamily:"'Inter',sans-serif" }}>{key.replace(/([A-Z])/g," $1")}</span>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, color:good?"#00E5A0":"#FF4757", background:good?"rgba(0,229,160,0.08)":"rgba(255,71,87,0.08)", padding:"5px 12px", borderRadius:8, border:`1px solid ${good?"rgba(0,229,160,0.2)":"rgba(255,71,87,0.2)"}`, fontFamily:"'DM Mono',monospace", letterSpacing:1.5, whiteSpace:"nowrap" }}>
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
                    const ac=i<3?"#FF4757":i<6?"#F5A623":"#00E5A0";
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
                  { time:"Month 4–6", goal:"Reach 4,000 Watch Hours",  desc:"Repurpose videos into Shorts, focus on evergreen topics, use strong end-screen CTAs.", color:"#00E5A0" },
                  { time:"Month 6+",  goal:"Apply for YPP",            desc:"Verify all requirements in YouTube Studio. Link AdSense account. Submit and await review.", color:"#00B8FF" },
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
                  { q:"How often should I re-analyze my channel?", a:"Re-run the check after every major content batch, or at least monthly while growing. Watch hours and subscriber counts change fast." },
                  { q:"Does Shorts watch time count toward the 4,000 hours?", a:"No. YouTube Shorts views and watch time do not count toward the 4,000 public watch hours required for standard YPP eligibility. Only long-form public videos count." },
                  { q:"Can I use MonetizeCheck for multiple channels?", a:"Yes. You can analyze as many channels as you like — just paste a different URL each time. There are no limits on how many analyses you can run." },
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

      {/* Educational content always visible when no results */}
      {!data && !loading && (
        <HomeEducationalContent isMobile={isMobile} isTablet={isTablet} setPage={setPage}/>
      )}

      {!data&&!loading&&(
        <div style={{ textAlign:"center", padding:"20px 0 20px", borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:8 }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.08)", letterSpacing:3, animation:"pulse 4s ease infinite", fontFamily:"'DM Mono',monospace" }}>▶ ENTER A CHANNEL URL ABOVE TO BEGIN</div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════ ROOT APP ══════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  useEffect(() => { injectFonts(); }, []);
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [page]);

  return (
    <div style={{ minHeight:"100vh", background:"#07090C", color:"rgba(255,255,255,0.75)", fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#07090C; }
        ::-webkit-scrollbar-thumb { background:#1E2530; border-radius:3px; }
        input::placeholder { color:rgba(255,255,255,0.18); }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg,#00E5A0,#00C980) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(0,229,160,0.28) !important;
        }
        .tab-btn:hover { color:rgba(255,255,255,0.65) !important; }
        input:focus {
          border-color: rgba(0,229,160,0.45) !important;
          box-shadow: 0 0 0 3px rgba(0,229,160,0.08) !important;
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
  );
}
