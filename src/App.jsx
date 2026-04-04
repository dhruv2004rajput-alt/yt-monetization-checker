import { useState } from "react";

const getScoreColor = (score) => {
  if (score >= 75) return "#00e5a0";
  if (score >= 50) return "#ffd93d";
  return "#ff6b6b";
};

const getVerdictConfig = (verdict) => {
  if (verdict === "LIKELY_ELIGIBLE") return { color: "#00e5a0", bg: "#00e5a01a", label: "✅ Likely Eligible for Monetization" };
  if (verdict === "BORDERLINE") return { color: "#ffd93d", bg: "#ffd93d1a", label: "⚠️ Borderline - Needs Improvement" };
  return { color: "#ff6b6b", bg: "#ff6b6b1a", label: "❌ Not Eligible Yet" };
};

const RadialScore = ({ score, size = 100 }) => {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = getScoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a2e" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px`, fill: color, fontSize: size * 0.22, fontWeight: 800, fontFamily: "monospace" }}>
        {score}
      </text>
    </svg>
  );
};

const ScoreBar = ({ label, score, notes }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ color: "#aaa", fontSize: 12, fontFamily: "monospace" }}>{label}</span>
      <span style={{ color: getScoreColor(score), fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{score}/100</span>
    </div>
    <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${score}%`, background: getScoreColor(score), borderRadius: 3, transition: "width 1s ease" }} />
    </div>
    {notes && <p style={{ color: "#555", fontSize: 11, margin: "3px 0 0", fontStyle: "italic" }}>{notes}</p>}
  </div>
);

// ── Word Document Generator ──────────────────────────────────────────────────
async function generateWordReport(data) {
  const docxModule = await import("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js");
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat
  } = docxModule;

  const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const RED = "CC0000";
  const LIGHT_RED_BG = "FDECEA";
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

  const h1 = (text) => new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, color: RED, font: "Arial" })]
  });

  const body = (text, opts = {}) => new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: "333333", ...opts })]
  });

  const spacer = () => new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] });

  // Build problems list
  const problems = [];
  if (me?.ytpRequirements) {
    const r = me.ytpRequirements;
    if (!r.subscribers?.met) problems.push(`Subscribers too low — Channel has approximately ${r.subscribers?.estimated?.toLocaleString() || "unknown"} subscribers but needs at least 1,000 to qualify for the YouTube Partner Program.`);
    if (!r.watchHours?.met) problems.push(`Watch hours insufficient — Estimated ${r.watchHours?.estimated?.toLocaleString() || "unknown"} watch hours but YouTube requires 4,000 public watch hours in the last 12 months.`);
    if (!r.communityGuidelines?.met) problems.push(`Community Guidelines violations detected — The channel has active strikes or warnings which immediately disqualify it from monetization until resolved.`);
    if (!r.adsenseLinked?.met) problems.push(`No AdSense account linked — A valid Google AdSense account must be connected to your YouTube channel before monetization can be approved.`);
  }
  if (me?.contentAnalysis) {
    const c = me.contentAnalysis;
    if (c.originalContent?.score < 60) problems.push(`Low original content score (${c.originalContent?.score}/100) — ${c.originalContent?.notes || "Content appears to be reused or duplicated. YouTube requires original content to qualify for monetization."}`);
    if (c.adFriendliness?.score < 60) problems.push(`Poor ad-friendliness score (${c.adFriendliness?.score}/100) — ${c.adFriendliness?.notes || "Content may include topics advertisers avoid such as violence, controversy, or mature themes."}`);
    if (c.consistencyScore?.score < 50) problems.push(`Inconsistent upload schedule (${c.consistencyScore?.score}/100) — ${c.consistencyScore?.notes || "Irregular uploads significantly slow down watch hour accumulation and subscriber growth."}`);
    if (c.engagementRate?.score < 50) problems.push(`Low engagement rate (${c.engagementRate?.score}/100) — ${c.engagementRate?.notes || "Low likes and comments relative to views suggests the audience is not engaged enough."}`);
    if (c.spamRisk?.score > 50) problems.push(`High spam risk (${c.spamRisk?.score}/100) — ${c.spamRisk?.notes || "Spam-like patterns detected which could result in the channel being demoted or removed."}`);
  }
  if (me?.policyCompliance) {
    const p = me.policyCompliance;
    if (p.copyrightStatus === "STRIKES") problems.push("Active copyright strikes — Copyright strikes on your channel will block monetization approval. Each strike must expire (90 days) or be successfully appealed.");
    if (p.copyrightStatus === "SOME_CLAIMS") problems.push("Copyright claims present — Some videos have Content ID claims. While claims don't block monetization, revenue from those videos goes to the copyright owner.");
    if (p.communityStrike) problems.push("Community Guidelines strike active — An active community strike must expire or be appealed before monetization can proceed.");
    if (p.ageRestricted) problems.push("Age-restricted content detected — Age-restricted videos cannot display ads and lower your overall channel monetization potential.");
    if (p.duplicationRisk === "HIGH") problems.push("High content duplication risk — Content appears heavily duplicated from other sources, which violates YouTube's spam and deceptive practices policy and can lead to channel termination.");
    if (p.duplicationRisk === "MEDIUM") problems.push("Medium duplication risk — Some content may be re-uploaded or repurposed without sufficient original commentary or transformation.");
  }

  const badVideos = (videos || []).filter(v => !v.monetizable || v.score < 60);
  const isNotEligible = me?.verdict === "NOT_ELIGIBLE";
  const verdictText = isNotEligible ? "NOT ELIGIBLE FOR MONETIZATION" : "BORDERLINE — NEEDS IMPROVEMENT";
  const verdictColor = isNotEligible ? RED : "B8860B";
  const verdictBg = isNotEligible ? LIGHT_RED_BG : "FFFDE7";

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
        },
        {
          reference: "numbers",
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
        }
      ]
    },
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Arial" },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [

        // COVER
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 720, after: 120 },
          children: [
            new TextRun({ text: "MONETIZE", bold: true, size: 80, color: RED, font: "Arial" }),
            new TextRun({ text: "CHECK", bold: true, size: 80, color: "222222", font: "Arial" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: "YouTube Monetization Eligibility Report", size: 28, color: "888888", font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 480 },
          children: [new TextRun({ text: `Generated: ${today}`, size: 20, color: "AAAAAA", font: "Arial" })]
        }),

        // VERDICT BOX
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { fill: verdictBg, type: ShadingType.CLEAR },
          border: {
            top: { style: BorderStyle.SINGLE, size: 10, color: verdictColor },
            bottom: { style: BorderStyle.SINGLE, size: 10, color: verdictColor },
            left: { style: BorderStyle.SINGLE, size: 10, color: verdictColor },
            right: { style: BorderStyle.SINGLE, size: 10, color: verdictColor }
          },
          spacing: { before: 200, after: 200 },
          children: [new TextRun({ text: `${isNotEligible ? "❌" : "⚠️"}  ${verdictText}`, bold: true, size: 34, color: verdictColor, font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: `Overall Monetization Score: ${me?.overallScore || 0} / 100`, bold: true, size: 26, color: "555555", font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: `Channel: ${channel?.name || "Unknown"} (${channel?.handle || ""})`, size: 22, color: "777777", font: "Arial" })]
        }),

        spacer(),

        // 1. CHANNEL OVERVIEW
        h1("1. Channel Overview"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3000, 6360],
          rows: [
            ["Channel Name", channel?.name || "N/A"],
            ["Handle / URL", channel?.handle || "N/A"],
            ["Category / Niche", channel?.category || "N/A"],
            ["Subscribers", channel?.subscribers || "N/A"],
            ["Total Videos Published", String(channel?.totalVideos || "N/A")],
            ["Total Channel Views", channel?.totalViews || "N/A"],
            ["Average Views per Video", channel?.avgViewsPerVideo || "N/A"],
            ["Country", channel?.country || "N/A"],
            ["Channel Created", channel?.joinedDate || "N/A"],
            ["Channel Description", channel?.description || "N/A"],
          ].map(([label, value], i) => new TableRow({
            children: [
              new TableCell({
                borders: allBorders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? "F5F5F5" : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: "333333" })] })]
              }),
              new TableCell({
                borders: allBorders, width: { size: 6360, type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? "F5F5F5" : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial", color: "444444" })] })]
              })
            ]
          }))
        }),

        spacer(),

        // 2. AI SUMMARY
        h1("2. AI Analysis Summary"),
        new Paragraph({
          shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
          border: { left: { style: BorderStyle.SINGLE, size: 14, color: RED } },
          spacing: { before: 120, after: 120 },
          indent: { left: 360, right: 240 },
          children: [new TextRun({ text: summary || "No summary available.", size: 22, font: "Arial", color: "444444", italic: true })]
        }),

        spacer(),

        // 3. YPP REQUIREMENTS
        h1("3. YouTube Partner Program (YPP) Requirements"),
        body("To be eligible for YouTube monetization, your channel must meet ALL of the following requirements:"),
        spacer(),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3200, 1800, 2000, 2360],
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["Requirement", "Required", "Your Estimate", "Status"].map((h, i) =>
                new TableCell({
                  borders: allBorders,
                  width: { size: [3200, 1800, 2000, 2360][i], type: WidthType.DXA },
                  shading: { fill: "CC0000", type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
                })
              )
            }),
            ...Object.entries(me?.ytpRequirements || {}).map(([key, val], i) =>
              new TableRow({
                children: [
                  new TableCell({ borders: allBorders, width: { size: 3200, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: key.replace(/([A-Z])/g, ' $1').trim(), size: 20, font: "Arial", color: "333333" })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val.required ? val.required.toLocaleString() : "—", size: 20, font: "Arial", color: "555555" })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val.estimated ? val.estimated.toLocaleString() : "—", size: 20, font: "Arial", color: "555555" })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 2360, type: WidthType.DXA }, shading: { fill: val.met ? "E8F5E9" : LIGHT_RED_BG, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val.met ? "✅ PASS" : "❌ FAIL", bold: true, size: 20, font: "Arial", color: val.met ? "2E7D32" : RED })] })] })
                ]
              })
            )
          ]
        }),

        spacer(),

        // 4. PROBLEMS
        h1("4. Problems Preventing Monetization"),
        body(`Your channel has ${problems.length} identified problem(s) blocking monetization. Each is explained in full detail below:`),
        spacer(),

        ...problems.flatMap((p, i) => [
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [new TextRun({ text: `Problem ${i + 1}`, bold: true, size: 24, color: RED, font: "Arial" })]
          }),
          new Paragraph({
            shading: { fill: LIGHT_RED_BG, type: ShadingType.CLEAR },
            border: { left: { style: BorderStyle.SINGLE, size: 16, color: RED } },
            spacing: { before: 80, after: 80 },
            indent: { left: 360, right: 240 },
            children: [new TextRun({ text: p, size: 22, font: "Arial", color: "333333" })]
          }),
          spacer()
        ]),

        // 5. CONTENT ANALYSIS
        h1("5. Content Analysis Scores"),
        body("These scores reflect how well your content aligns with YouTube advertiser-friendly guidelines. Scores below 60 are problems."),
        spacer(),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3000, 1200, 5160],
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["Area", "Score", "Details"].map((h, i) =>
                new TableCell({
                  borders: allBorders, width: { size: [3000, 1200, 5160][i], type: WidthType.DXA },
                  shading: { fill: "333333", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
                })
              )
            }),
            ...Object.entries(me?.contentAnalysis || {}).map(([key, val], i) => {
              const scoreColor = val.score >= 75 ? "2E7D32" : val.score >= 50 ? "E65100" : RED;
              const scoreBg = val.score >= 75 ? "E8F5E9" : val.score >= 50 ? "FFF3E0" : LIGHT_RED_BG;
              return new TableRow({
                children: [
                  new TableCell({ borders: allBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: key.replace(/([A-Z])/g, ' $1').trim(), bold: true, size: 20, font: "Arial", color: "333333" })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: scoreBg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${val.score}/100`, bold: true, size: 20, font: "Arial", color: scoreColor })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 5160, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: val.notes || "—", size: 20, font: "Arial", color: "555555", italic: true })] })] })
                ]
              });
            })
          ]
        }),

        spacer(),

        // 6. POLICY COMPLIANCE
        h1("6. YouTube Policy Compliance Check"),
        spacer(),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5000, 4360],
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["Policy Area", "Result"].map((h, i) =>
                new TableCell({
                  borders: allBorders, width: { size: [5000, 4360][i], type: WidthType.DXA },
                  shading: { fill: "333333", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
                })
              )
            }),
            ...Object.entries(me?.policyCompliance || {}).map(([key, val], i) => {
              const good = val === true || val === "CLEAN" || val === "SAFE" || val === "LOW" ||
                (typeof val === "boolean" && !val && (key === "communityStrike" || key === "ageRestricted"));
              const displayVal = typeof val === "boolean"
                ? ((key === "communityStrike" || key === "ageRestricted") ? (!val ? "✅ PASS" : "❌ FAIL") : (val ? "✅ PASS" : "❌ FAIL"))
                : val;
              return new TableRow({
                children: [
                  new TableCell({ borders: allBorders, width: { size: 5000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: key.replace(/([A-Z])/g, ' $1').trim(), size: 20, font: "Arial", color: "333333" })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 4360, type: WidthType.DXA }, shading: { fill: good ? "E8F5E9" : LIGHT_RED_BG, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: String(displayVal), bold: true, size: 20, font: "Arial", color: good ? "2E7D32" : RED })] })] })
                ]
              });
            })
          ]
        }),

        spacer(),

        // 7. PROBLEMATIC VIDEOS (conditional)
        ...(badVideos.length > 0 ? [
          h1("7. Videos With Monetization Issues"),
          body(`${badVideos.length} of your video(s) are not monetizable or have low ad-friendliness scores. These need to be fixed or removed:`),
          spacer(),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [4200, 1200, 3960],
            rows: [
              new TableRow({
                tableHeader: true,
                children: ["Video Title", "Score", "Issues"].map((h, i) =>
                  new TableCell({
                    borders: allBorders, width: { size: [4200, 1200, 3960][i], type: WidthType.DXA },
                    shading: { fill: "CC0000", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
                  })
                )
              }),
              ...badVideos.map((v, i) => new TableRow({
                children: [
                  new TableCell({ borders: allBorders, width: { size: 4200, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: v.title || "Untitled", size: 20, font: "Arial", color: "333333" })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: LIGHT_RED_BG, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${v.score || 0}/100`, bold: true, size: 20, font: "Arial", color: RED })] })] }),
                  new TableCell({ borders: allBorders, width: { size: 3960, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: v.issues?.length > 0 ? v.issues.join(", ") : "Low ad score", size: 20, font: "Arial", color: "666666", italic: true })] })] })
                ]
              }))
            ]
          }),
          spacer(),
        ] : []),

        // 8. ACTION PLAN
        h1(`${badVideos.length > 0 ? "8" : "7"}. Action Plan — Steps to Become Monetizable`),
        body("Follow these steps carefully and in order to fix your channel and qualify for YouTube monetization:"),
        spacer(),

        ...(recommendations || []).map((tip) => new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: tip, size: 22, font: "Arial", color: "333333" })]
        })),

        spacer(),

        // 9. TIMELINE
        h1(`${badVideos.length > 0 ? "9" : "8"}. Estimated Timeline to Monetization`),
        body("Here is a realistic roadmap based on your current channel status:"),
        spacer(),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2000, 3400, 3960],
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["Timeframe", "Goal", "Actions Required"].map((h, i) =>
                new TableCell({
                  borders: allBorders, width: { size: [2000, 3400, 3960][i], type: WidthType.DXA },
                  shading: { fill: "CC0000", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
                })
              )
            }),
            ...[
              ["Week 1-2", "Fix all policy issues", "Resolve copyright claims, strikes, and remove violating content"],
              ["Month 1", "Improve content quality", "Create 4-8 high quality, fully original videos"],
              ["Month 2-3", "Build watch hours", "Upload 2-3 times per week consistently"],
              ["Month 3-6", "Reach 1,000 subscribers", "Promote on social media, Reddit, and YouTube communities"],
              ["Month 4-6", "Reach 4,000 watch hours", "Create longer videos (8-15 mins) and playlists"],
              ["Month 6+", "Apply for YPP", "Submit application once all requirements are confirmed met"],
            ].map(([time, goal, action], i) => new TableRow({
              children: [time, goal, action].map((text, j) =>
                new TableCell({
                  borders: allBorders, width: { size: [2000, 3400, 3960][j], type: WidthType.DXA },
                  shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial", color: "333333" })] })]
                })
              )
            }))
          ]
        }),

        spacer(), spacer(),

        // FOOTER
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "EEEEEE" } },
          spacing: { before: 240 },
          children: [new TextRun({ text: `MonetizeCheck · AI-Powered YouTube Analysis · Report generated ${today} · Not affiliated with YouTube or Google`, size: 16, color: "AAAAAA", font: "Arial" })]
        })

      ]
    }]
  });

  return await Packer.toBuffer(doc);
}

// ── Download Helper ──────────────────────────────────────────────────────────
async function downloadReport(data, setDownloading) {
  setDownloading(true);
  try {
    const buffer = await generateWordReport(data);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.channel?.name || "channel").replace(/\s+/g, "_")}_monetization_report.docx`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Word generation error:", e);
    alert("Failed to generate report. Please try again.");
  }
  setDownloading(false);
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }
      const json = await res.json();
      setData(json);
      setActiveTab("overview");
    } catch (e) {
      setError(e.message || "Failed to analyze. Please try again.");
    }
    setLoading(false);
  };

  const showDownloadButton = data && (
    data.monetizationEligibility?.verdict === "NOT_ELIGIBLE" ||
    data.monetizationEligibility?.verdict === "BORDERLINE"
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#e0e0e0", fontFamily: "Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "18px 24px", display: "flex", alignItems: "center", gap: 12, background: "#0d0d1a" }}>
        <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #ff0000, #cc0000)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>▶</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontFamily: "'Bebas Neue', cursive", letterSpacing: 3, color: "#fff" }}>
            MONETIZE<span style={{ color: "#ff0000" }}>CHECK</span>
          </h1>
          <p style={{ margin: 0, fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 1 }}>FREE YOUTUBE MONETIZATION ANALYZER · POWERED BY GOOGLE GEMINI</p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px" }}>

        <div style={{ textAlign: "center", marginBottom: 20, background: "#0d0d1a", border: "1px dashed #1e1e35", borderRadius: 8, padding: 10, fontSize: 11, color: "#2a2a40", fontFamily: "monospace" }}>
          [ PASTE YOUR GOOGLE ADSENSE CODE HERE ]
        </div>

        {/* Search */}
        <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <p style={{ color: "#444", fontSize: 11, fontFamily: "monospace", letterSpacing: 2, marginTop: 0, marginBottom: 10 }}>ENTER YOUTUBE CHANNEL URL OR @HANDLE</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="https://youtube.com/@MrBeast  or  @MrBeast"
              style={{ flex: 1, minWidth: 220, background: "#0a0a14", border: "1px solid #2a2a45", borderRadius: 8, padding: "13px 16px", color: "#e0e0e0", fontSize: 14, outline: "none" }} />
            <button onClick={analyze} disabled={loading}
              style={{ background: loading ? "#1a1a2e" : "linear-gradient(135deg, #ff2200, #cc0000)", color: "#fff", border: "none", borderRadius: 8, padding: "13px 28px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 1 }}>
              {loading ? "ANALYZING..." : "ANALYZE →"}
            </button>
          </div>
          {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10, fontFamily: "monospace" }}>⚠ {error}</p>}
          <p style={{ color: "#222", fontSize: 11, marginTop: 8, marginBottom: 0 }}>Works with: youtube.com/@handle · youtube.com/c/name · youtube.com/channel/UCxxxxx · @handle</p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: 52, height: 52, border: "4px solid #1a1a2e", borderTop: "4px solid #ff0000", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#444", fontFamily: "monospace", fontSize: 12, letterSpacing: 2 }}>GEMINI AI IS ANALYZING YOUR CHANNEL...</p>
          </div>
        )}

        {/* Results */}
        {data && (() => {
          const { channel, monetizationEligibility: me, videos, recommendations, summary } = data;
          const verdictC = getVerdictConfig(me?.verdict);
          return (
            <div>
              {/* Channel Card */}
              <div style={{ background: "linear-gradient(135deg, #0d0d1a, #111128)", border: "1px solid #1e1e35", borderRadius: 12, padding: 22, marginBottom: 14, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ width: 62, height: 62, background: "linear-gradient(135deg, #ff2200, #440000)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {channel?.name?.[0]?.toUpperCase() || "Y"}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <h2 style={{ margin: "0 0 4px", fontSize: 20, fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, color: "#fff" }}>{channel?.name}</h2>
                  <p style={{ margin: "0 0 5px", color: "#ff5555", fontSize: 12, fontFamily: "monospace" }}>{channel?.handle} · {channel?.category}</p>
                  <p style={{ margin: "0 0 4px", color: "#666", fontSize: 12 }}>{channel?.description}</p>
                  <p style={{ margin: 0, color: "#333", fontSize: 11 }}>📅 {channel?.joinedDate} &nbsp;·&nbsp; 🌍 {channel?.country}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["SUBSCRIBERS", channel?.subscribers], ["VIDEOS", channel?.totalVideos], ["TOTAL VIEWS", channel?.totalViews], ["AVG VIEWS", channel?.avgViewsPerVideo]].map(([l, v]) => (
                    <div key={l} style={{ background: "#0a0a14", border: "1px solid #1a1a2e", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 82 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace", color: "#ddd" }}>{v}</div>
                      <div style={{ fontSize: 9, color: "#333", fontFamily: "monospace", letterSpacing: 1, marginTop: 3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict + Download */}
              <div style={{ background: verdictC.bg, border: `1px solid ${verdictC.color}44`, borderRadius: 12, padding: "18px 22px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 19, fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, color: verdictC.color, marginBottom: 8 }}>{verdictC.label}</div>
                    <p style={{ margin: "0 0 16px", color: "#999", fontSize: 13, lineHeight: 1.7 }}>{summary}</p>

                    {showDownloadButton && (
                      <div>
                        <button onClick={() => downloadReport(data, setDownloading)} disabled={downloading}
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: downloading ? "#111" : "linear-gradient(135deg, #0d2340, #1a3a5c)", color: downloading ? "#444" : "#60aaff", border: "1px solid #1e3a5c", borderRadius: 8, padding: "11px 20px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: downloading ? "not-allowed" : "pointer", letterSpacing: 1 }}>
                          {downloading ? "⏳ GENERATING REPORT..." : "📄 DOWNLOAD FULL REPORT (.DOCX)"}
                        </button>
                        <p style={{ margin: "6px 0 0", fontSize: 11, color: "#2a3a4a", fontFamily: "monospace" }}>
                          Word document with all problems, scores, video issues &amp; full action plan
                        </p>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <RadialScore score={me?.overallScore || 0} size={88} />
                    <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", marginTop: 4, letterSpacing: 1 }}>OVERALL SCORE</div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", marginBottom: 14, background: "#0d0d1a", border: "1px dashed #1e1e35", borderRadius: 8, padding: 10, fontSize: 11, color: "#222", fontFamily: "monospace" }}>
                [ PASTE YOUR GOOGLE ADSENSE CODE HERE ]
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", marginBottom: 16, borderBottom: "1px solid #1a1a2e" }}>
                {[{ id: "overview", label: "📊 Overview" }, { id: "videos", label: `🎬 Videos (${videos?.length || 0})` }, { id: "policy", label: "📋 Policy" }, { id: "tips", label: "💡 Tips" }].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ background: "none", border: "none", borderBottom: activeTab === tab.id ? "2px solid #ff2200" : "2px solid transparent", color: activeTab === tab.id ? "#fff" : "#444", padding: "10px 16px", fontFamily: "monospace", fontSize: 11, letterSpacing: 1, cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                  <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 11, fontFamily: "monospace", letterSpacing: 2, color: "#444" }}>YPP REQUIREMENTS</h3>
                    {me?.ytpRequirements && Object.entries(me.ytpRequirements).map(([key, val]) => (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0f0f1f" }}>
                        <div>
                          <div style={{ fontSize: 13, color: "#ccc", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                          {val.required != null && <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>Need: {val.required?.toLocaleString()} · Est: {val.estimated?.toLocaleString()}</div>}
                        </div>
                        <span style={{ fontSize: 20 }}>{val.met ? "✅" : "❌"}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 11, fontFamily: "monospace", letterSpacing: 2, color: "#444" }}>CONTENT ANALYSIS</h3>
                    {me?.contentAnalysis && Object.entries(me.contentAnalysis).map(([key, val]) => (
                      <ScoreBar key={key} label={key.replace(/([A-Z])/g, ' $1').toUpperCase()} score={val.score} notes={val.notes} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "videos" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(videos || []).map((v, i) => (
                    <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${v.monetizable ? "#152015" : "#201515"}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                      <div style={{ width: 46, height: 46, background: v.monetizable ? "#00e5a010" : "#ff6b6b10", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{v.monetizable ? "💰" : "🚫"}</div>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#ddd", marginBottom: 4 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace" }}>{v.uploadDate} · ⏱ {v.duration} · 👁 {v.views} · 👍 {v.likes}</div>
                        {v.issues?.length > 0 && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>⚠ {v.issues.join(", ")}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <RadialScore score={v.score || 0} size={52} />
                        <span style={{ fontSize: 9, color: "#333", fontFamily: "monospace", marginTop: 2 }}>AD SCORE</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "policy" && (
                <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 12, padding: 22 }}>
                  <h3 style={{ margin: "0 0 18px", fontSize: 11, fontFamily: "monospace", letterSpacing: 2, color: "#444" }}>YOUTUBE POLICY COMPLIANCE</h3>
                  {me?.policyCompliance && Object.entries(me.policyCompliance).map(([key, val]) => {
                    const good = val === true || val === "CLEAN" || val === "SAFE" || val === "LOW" ||
                      (typeof val === "boolean" && !val && (key === "communityStrike" || key === "ageRestricted"));
                    return (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #0f0f1f" }}>
                        <span style={{ color: "#bbb", fontSize: 13, textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: good ? "#00e5a0" : "#ff6b6b", background: good ? "#00e5a010" : "#ff6b6b10", padding: "4px 12px", borderRadius: 6 }}>
                          {typeof val === "boolean" ? (key === "communityStrike" || key === "ageRestricted" ? (!val ? "PASS ✅" : "FAIL ❌") : (val ? "PASS ✅" : "FAIL ❌")) : val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "tips" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(recommendations || []).map((tip, i) => (
                    <div key={i} style={{ background: "#0d0d1a", borderLeft: "3px solid #ffd93d", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 14 }}>
                      <span style={{ color: "#ffd93d", fontFamily: "monospace", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                      <p style={{ margin: 0, color: "#bbb", fontSize: 13, lineHeight: 1.7 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 24, background: "#0d0d1a", border: "1px dashed #1e1e35", borderRadius: 8, padding: 10, fontSize: 11, color: "#222", fontFamily: "monospace" }}>[ PASTE YOUR GOOGLE ADSENSE CODE HERE ]</div>
            </div>
          );
        })()}

        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "70px 20px" }}>
            <div style={{ fontSize: 60, marginBottom: 16, opacity: 0.1 }}>▶</div>
            <p style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 2, color: "#2a2a40" }}>ENTER A YOUTUBE CHANNEL URL TO BEGIN</p>
            <p style={{ fontSize: 12, color: "#1a1a28", marginTop: 8 }}>Powered by Google Gemini AI — 100% Free</p>
          </div>
        )}

        <div style={{ marginTop: 48, borderTop: "1px solid #0f0f1f", paddingTop: 18, textAlign: "center" }}>
          <p style={{ color: "#1e1e30", fontSize: 11, fontFamily: "monospace" }}>
            MonetizeCheck · Powered by Google Gemini AI · <a href="/privacy.html" style={{ color: "#2a2a45" }}>Privacy Policy</a> · Not affiliated with YouTube or Google
          </p>
        </div>
      </div>
    </div>
  );
}
