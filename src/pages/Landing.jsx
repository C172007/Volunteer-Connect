/* ============================================================
   🏠 LANDING.JSX — Warm, story-driven landing page
   Route: /  →  leads to /dashboard or /register

   📍 WHAT TO CHANGE WHERE:
   - Hero headline/subtext    → HERO COPY section (~line 120)
   - Live ticker items        → TICKER_ITEMS array (~line 55)
   - Stats numbers            → STATS array (~line 65)
   - Feature cards            → FEATURES array (~line 75)
   - How it works steps       → STEPS array (~line 90)
   - Story cards              → STORIES array (~line 100)
   - Photos                   → img src= URLs (Unsplash, free)
   - Colours                  → C object (~line 35)
   - Custom cursor            → CustomCursor component
   - 🌐 Spline/3D slot        → marked SPLINE SLOT
   - 🔠 Marquee slot          → marked MARQUEE SLOT
   - 🎨 Animations            → landingCSS string
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useNavigate }                  from "react-router-dom";
import { theme, keyframes }             from "../theme";

/* ============================================================
   🎨 LANDING COLOUR PALETTE — Change all landing colours here
   These are separate from app colours so you can style
   the landing page independently without affecting Dashboard
   ============================================================ */
const C = {
  bg:       "#FDFAF6",   // warm cream background
  bg2:      "#F5F0E8",   // slightly deeper cream
  bg3:      "#FFFBF5",   // near white warm
  surface:  "#FFFFFF",
  border:   "#E8E0D0",
  primary:  "#0D9488",   // teal
  primaryD: "#0F766E",   // teal dark
  primaryL: "#CCFBF1",   // teal light
  accent:   "#F59E0B",   // warm amber
  accentL:  "#FEF3C7",
  dark:     "#1C1917",   // warm near-black
  text:     "#292524",   // warm dark brown
  textSub:  "#78716C",   // warm muted
  textMute: "#A8A29E",
  green:    "#16A34A",
  red:      "#DC2626",
};

/* ============================================================
   📡 LIVE TICKER ITEMS — Scrolling impact feed at top of hero
   These simulate real-time activity. Update with real data later
   ============================================================ */
const TICKER_ITEMS = [
  "🙋 Ravi Sharma matched to flood relief in Kurla East",
  "✅ 15 volunteers deployed — Dharavi food distribution",
  "🚨 CRITICAL: Medical camp in Govandi needs 5 volunteers NOW",
  "🌱 Sneha Iyer registered — Teaching skills in Mankhurd",
  "⚡ AI matched 8 volunteers in under 60 seconds",
  "📋 New need submitted — Elderly care in Chembur",
  "🙋 Amit Patil matched to flood relief logistics",
  "✅ Neha Singh deployed — Govandi medical camp",
];

/* ============================================================
   📊 STATS — Change impact numbers and labels here
   ============================================================ */
const STATS = [
  { value: 8,   suffix: "+",  label: "Volunteers Ready",     color: C.primary },
  { value: 5,   suffix: "",   label: "Active Needs",         color: C.accent  },
  { value: 60,  suffix: "s",  label: "Avg Match Time",       color: C.green   },
  { value: 100, suffix: "%",  label: "Free to Use",          color: C.primary },
];

/* ============================================================
   ✨ FEATURES — Change feature titles and descriptions here
   ============================================================ */
const FEATURES = [
  { emoji:"🧠", title:"AI understands your words",       desc:"Type your need exactly like a WhatsApp message. Gemini reads it and extracts skills, urgency, and volunteer count — automatically." },
  { emoji:"📍", title:"Location-first matching",         desc:"Volunteers ranked by how close they are to your need site. Disaster relief, medical camps, or food drives — closest first." },
  { emoji:"⚡", title:"60 seconds to a match",           desc:"From need submission to a ranked volunteer list in under a minute. When floods strike, speed is everything." },
  { emoji:"📡", title:"Real-time across every screen",   desc:"The moment an NGO submits a need, it appears live on every coordinator's dashboard — no refresh, no delay." },
  { emoji:"🔴", title:"Urgency that speaks for itself",  desc:"CRITICAL needs surface at the top with red highlights. Coordinators see what can't wait the moment they open the app." },
  { emoji:"🌱", title:"Zero training required",          desc:"If your team can send a WhatsApp message, they can use VolunteerConnect. No apps, no accounts, no learning curve." },
];

/* ============================================================
   🪜 HOW IT WORKS STEPS — Change step titles and descriptions
   ============================================================ */
const STEPS = [
  { num:"01", emoji:"✍️", title:"NGO describes the need",    desc:"Coordinator types freely — 'We need 10 volunteers in Kurla for flood relief, first aid preferred.' Just like texting." },
  { num:"02", emoji:"🧠", title:"Gemini AI processes it",    desc:"AI extracts: urgency level, category, skills needed, volunteer count, and location. No dropdowns needed." },
  { num:"03", emoji:"📡", title:"Firebase streams it live",  desc:"Saved instantly to the cloud. Every coordinator sees the new need on their dashboard in real time." },
  { num:"04", emoji:"🎯", title:"Best match, ranked by AI",  desc:"Click Find Volunteers. Gemini scores every registered volunteer and returns a list with match %, reason, and contact." },
];

/* ============================================================
   💬 IMPACT STORIES — Real-feel story cards in hero section
   Change names, locations, and story text here
   ============================================================ */
const STORIES = [
  { name:"Priya Mehta",   area:"Dharavi",    text:"Matched in 45 seconds to a food distribution camp. Helped feed 200 families.",  color:"#0D9488", emoji:"🍱" },
  { name:"Ravi Sharma",   area:"Kurla East", text:"Deployed to flood relief within the hour. Coordinated supply chains for 2 days.", color:"#F59E0B", emoji:"🌊" },
  { name:"Neha Singh",    area:"Govandi",    text:"First-aid trained nurse matched to a medical camp needing her exact skills.",     color:"#16A34A", emoji:"🏥" },
];

/* ============================================================
   🖱 CUSTOM CURSOR — Warm glowing dot
   Remove <CustomCursor /> to disable
   Change dotColor and ringColor below to restyle
   ============================================================ */
function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x:0, y:0 });
  const ring    = useRef({ x:0, y:0 });
  const raf     = useRef(null);

  useEffect(() => {
    const move = e => { mouse.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", move);

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${mouse.current.x}px,${mouse.current.y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    animate();

    /* 🖱 CURSOR GROW — elements that make the ring expand on hover */
    const grow   = () => { if(ringRef.current){ ringRef.current.style.width="48px"; ringRef.current.style.height="48px"; ringRef.current.style.opacity="0.5"; }};
    const shrink = () => { if(ringRef.current){ ringRef.current.style.width="28px"; ringRef.current.style.height="28px"; ringRef.current.style.opacity="0.3"; }};
    const addListeners = () => {
      document.querySelectorAll("a,button").forEach(el => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList:true, subtree:true });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* ============================================================
          🖱 CURSOR DOT — Change size, colour, glow here
          ============================================================ */}
      <div ref={dotRef} style={{
        position:"fixed", top:-5, left:-5, width:10, height:10,
        borderRadius:"50%", background:C.primary, pointerEvents:"none", zIndex:9999,
        boxShadow:`0 0 12px ${C.primary}, 0 0 24px ${C.primary}66`,
      }}/>
      {/* ============================================================
          🖱 CURSOR RING — Change size, colour here
          ============================================================ */}
      <div ref={ringRef} style={{
        position:"fixed", top:-14, left:-14, width:28, height:28,
        borderRadius:"50%", border:`1.5px solid ${C.primary}88`,
        pointerEvents:"none", zIndex:9998, opacity:0.3,
        transition:"width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
      }}/>
    </>
  );
}

/* ============================================================
   📡 LIVE TICKER COMPONENT — Horizontally scrolling feed
   Change animation speed in landingCSS @keyframes marquee
   ============================================================ */
function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={tickerWrapStyle}>
      <div style={tickerLabelStyle}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"blink 1.5s ease-in-out infinite", display:"inline-block" }}/>
        &nbsp;LIVE
      </div>
      <div style={{ flex:1, overflow:"hidden", position:"relative" }}>
        <div style={tickerTrackStyle}>
          {doubled.map((item, i) => (
            <span key={i} style={tickerItemStyle}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   🔢 ANIMATED COUNTER — Counts up when scrolled into view
   Change duration (ms) for faster/slower counting
   ============================================================ */
function Counter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      /* 🎨 COUNTER SPEED — change 1600 to adjust speed (ms) */
      const dur = 1600, start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now()-start)/dur, 1);
        const ease = 1 - Math.pow(1-p, 3);
        setCount(Math.round(ease * value));
        if (p < 1) requestAnimationFrame(tick);
      };
      tick(); obs.disconnect();
    }, { threshold:0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ============================================================
   🏠 MAIN LANDING PAGE COMPONENT
   ============================================================ */

/* ============================================================
   🎬 VIDEO OR PLACEHOLDER COMPONENT
   Shows your demo.mp4 if it exists, otherwise shows a styled
   placeholder so the layout never looks broken during dev.
   ============================================================ */
function VideoOrPlaceholder() {
  const [hasVideo, setHasVideo] = useState(true);
  return (
    <>
      {hasVideo && (
        <video
          src="/demo.mp4"
          autoPlay loop muted playsInline
          style={videoStyle}
          onError={() => setHasVideo(false)}
        />
      )}
      {!hasVideo && (
        /* ============================================================
           🎬 VIDEO PLACEHOLDER — Shown until you add demo.mp4
           Change placeholder text / icon here
           ============================================================ */
        <div style={videoPlaceholderStyle}>
          <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎬</div>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>
              Demo video goes here
            </div>
            <div style={{ fontSize:12, color:C.textSub, lineHeight:1.65, maxWidth:200 }}>
              Record 30 sec screen capture:<br/>
              Submit Need → AI → Match
            </div>
            <div style={{ marginTop:14, background:C.primaryL, borderRadius:8, padding:"7px 14px", fontSize:11, color:C.primary, fontWeight:600, display:"inline-block" }}>
              Save as /public/demo.mp4
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80"
            alt=""
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:20, opacity:0.12 }}
          />
        </div>
      )}
    </>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Auto-rotate story cards */
  useEffect(() => {
    const t = setInterval(() => setActiveStory(s => (s+1) % STORIES.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{keyframes}{landingCSS}</style>

      {/* ============================================================
          🖱 CURSOR — Remove this line to disable custom cursor
          ============================================================ */}
      <CustomCursor />

      <div style={{ background:C.bg, color:C.text, fontFamily:theme.fonts.body, cursor:"none" }}>

        {/* ── Sticky Nav ── */}
        <nav style={{ ...navStyle, boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none" }}>
          {/* ============================================================
              🎨 NAV LOGO — Change emoji, name, tagline here
              ============================================================ */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={navLogoIconStyle}>🌱</div>
            <span style={{ fontFamily:theme.fonts.display, fontWeight:700, fontSize:17, color:C.text }}>
              Volunteer<span style={{ color:C.primary }}>Connect</span>
            </span>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {/* ============================================================
                🔘 NAV BUTTONS — Change labels / routes here
                ============================================================ */}
            <button style={navOutlineBtn} onClick={()=>navigate("/register")}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.color=C.primary;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSub;}}>
              I'm a Volunteer
            </button>
            <button style={navSolidBtn} onClick={()=>navigate("/dashboard")}
              onMouseEnter={e=>e.currentTarget.style.background=C.primaryD}
              onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
              NGO Dashboard →
            </button>
          </div>
        </nav>

        {/* ============================================================
            🔠 MARQUEE SLOT — Add announcement banner above hero here
            Example: <AnnouncementBanner text="🚨 3 critical needs in Mumbai" />
            ============================================================ */}

        {/* ══════════════════════════════════════════════════════
            🦸 HERO SECTION
            ══════════════════════════════════════════════════════ */}
        <section style={heroSectionStyle}>

          {/* ── Warm background blob ── */}
          {/* ============================================================
              🎨 BACKGROUND BLOBS — Change blob colours/positions here
              ============================================================ */}
          <div style={{ ...blobStyle, top:-80, right:"5%",  width:500, height:500, background:`radial-gradient(circle, ${C.primaryL}88, transparent 65%)` }}/>
          <div style={{ ...blobStyle, bottom:-100, left:"3%", width:400, height:400, background:`radial-gradient(circle, ${C.accentL}88, transparent 65%)` }}/>

          {/* ============================================================
              🌐 SPLINE / 3D SLOT — Paste spline-viewer tag here
              for a 3D element behind the hero content
              ============================================================ */}

          <div style={heroInnerStyle}>

            {/* ── Left: text content ── */}
            <div style={heroLeftStyle}>

              {/* Badge */}
              <div style={heroBadgeStyle} className="wu-1">
                <span style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"blink 2s ease-in-out infinite", display:"inline-block" }}/>
                &nbsp; Powered by Google Gemini AI + Firebase
              </div>

              {/* ============================================================
                  🎨 HERO HEADLINE — Change main headline text here
                  ============================================================ */}
              <h1 style={heroH1Style} className="wu-2">
                The right volunteer.<br/>
                <span style={{ color:C.primary }}>Right when it matters.</span>
              </h1>

              {/* ============================================================
                  🎨 HERO SUBTEXT — Change supporting copy here
                  ============================================================ */}
              <p style={heroSubStyle} className="wu-3">
                Mumbai's NGOs describe their needs in plain language —
                our AI finds, ranks, and connects the perfect volunteer
                in under <strong style={{ color:C.primary }}>60 seconds.</strong> Not 6 hours.
              </p>

              {/* ── CTA buttons ── */}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }} className="wu-4">
                {/* ============================================================
                    🔘 HERO CTA BUTTONS — Change labels / routes here
                    ============================================================ */}
                <button style={ctaPrimaryStyle} onClick={()=>navigate("/submit")}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.primaryD;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.primary;e.currentTarget.style.transform="none";}}>
                  📋 Submit a Need
                </button>
                <button style={ctaOutlineStyle} onClick={()=>navigate("/register")}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.primaryL;e.currentTarget.style.borderColor=C.primary;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;}}>
                  🙋 Join as Volunteer
                </button>
              </div>

              {/* ── Trust line ── */}
              <div style={trustLineStyle} className="wu-5">
                <span>✅ Free to use</span>
                <span style={{ color:C.border }}>·</span>
                <span>📡 Real-time sync</span>
                <span style={{ color:C.border }}>·</span>
                <span>🤖 Gemini AI powered</span>
              </div>

            </div>

            {/* ── Right: photo + story cards ── */}
            <div style={heroRightStyle} className="wu-2">

              {/* ── Main hero photo ── */}
              {/* ============================================================
                  📸 HERO PHOTO — Change Unsplash URL here if needed
                  ============================================================ */}
              <div style={heroPhotoWrapStyle}>
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80"
                  alt="Volunteers working together"
                  style={heroPhotoStyle}
                />
                {/* Live overlay badge */}
                <div style={photoLiveBadgeStyle}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"blink 1.5s ease-in-out infinite" }}/>
                  5 needs active right now
                </div>
              </div>

              {/* ── Rotating story cards ── */}
              {/* ============================================================
                  💬 STORY CARDS — Rotating impact stories
                  Change story content in STORIES array at top
                  ============================================================ */}
              <div style={storyCardsWrapStyle}>
                {STORIES.map((s, i) => (
                  <div key={i} style={{
                    ...storyCardStyle,
                    opacity:     i === activeStory ? 1   : 0,
                    transform:   i === activeStory ? "translateY(0)" : "translateY(8px)",
                    pointerEvents: i === activeStory ? "auto" : "none",
                    position:    i === 0 ? "relative" : "absolute",
                    top:         0, left: 0, right: 0,
                    borderLeft:  `3px solid ${s.color}`,
                  }}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{s.emoji}</div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.5, fontWeight:500 }}>
                      {s.text}
                    </div>
                    <div style={{ fontSize:11, color:C.textMute, marginTop:6, fontWeight:600 }}>
                      {s.name} · {s.area}
                    </div>
                  </div>
                ))}
              </div>

              {/* Story dots */}
              <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:10 }}>
                {STORIES.map((_, i) => (
                  <div key={i} onClick={()=>setActiveStory(i)} style={{
                    width: i===activeStory?20:6, height:6,
                    borderRadius:9999, background: i===activeStory?C.primary:C.border,
                    cursor:"pointer", transition:"all 0.3s ease",
                  }}/>
                ))}
              </div>

            </div>
          </div>

          {/* ── Live Ticker ── */}
          {/* ============================================================
              📡 LIVE TICKER — Scrolling impact feed
              Change TICKER_ITEMS array at top of file
              ============================================================ */}
          <LiveTicker />

        </section>

        {/* ══════════════════════════════════════════════════════
            🎬 VIDEO SECTION — Full width, between hero and stats
            ══════════════════════════════════════════════════════ */}
        {/* ============================================================
            🎬 VIDEO SECTION — Change heading, subtext, or video here
            To add your video: drop demo.mp4 into /public folder
            ============================================================ */}
        <section style={videoSectionStyle}>
          <div style={videoSectionInnerStyle}>

            {/* Left: label + heading + steps */}
            <div style={videoSectionLeftStyle}>
              <div style={sectionLabelStyle}>See It In Action</div>
              {/* ============================================================
                  🎨 VIDEO SECTION HEADING — Change text here
                  ============================================================ */}
              <h2 style={videoSectionTitleStyle}>
                From need to volunteer<br/>
                <span style={{ color:C.primary }}>in 3 simple steps</span>
              </h2>
              {/* ============================================================
                  📋 VIDEO STEPS LIST — Change step text here
                  ============================================================ */}
              {[
                { num:"01", text:"NGO types the need in plain language" },
                { num:"02", text:"Gemini AI extracts skills, urgency and count" },
                { num:"03", text:"Ranked volunteer list appears in seconds" },
              ].map(s => (
                <div key={s.num} style={videoStepRowStyle}>
                  <div style={videoStepNumStyle}>{s.num}</div>
                  <div style={{ fontSize:14, color:C.textSub, lineHeight:1.5 }}>{s.text}</div>
                </div>
              ))}
            </div>

            {/* Right: video player */}
            <div style={videoPlayerWrapStyle}>
              {/* Video badge */}
              <div style={videoBadgeStyle}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#ef4444", animation:"blink 1.5s ease-in-out infinite", display:"inline-block" }}/>
                &nbsp; Live demo — 30 sec loop
              </div>
              {/* ============================================================
                  🎬 VIDEO — drops demo.mp4 from /public automatically
                  Placeholder shown until file is added
                  ============================================================ */}
              <VideoOrPlaceholder />
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            📊 STATS SECTION
            ══════════════════════════════════════════════════════ */}
        <section style={statsSectionStyle}>
          <div style={statsGridStyle}>
            {STATS.map((s,i) => (
              <div key={i} style={statsCardStyle}>
                <div style={{ fontFamily:theme.fonts.display, fontSize:52, fontWeight:800, color:s.color, lineHeight:1 }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:13, color:C.textSub, marginTop:6, fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            📸 STORY / PHOTO SECTION
            ══════════════════════════════════════════════════════ */}
        <section style={storySectionStyle}>
          <div style={storyLayoutStyle}>

            {/* Left: photo grid */}
            <div style={photoGridStyle}>
              {/* ============================================================
                  📸 SECTION PHOTOS — Change Unsplash URLs here
                  All photos from Unsplash (free to use)
                  ============================================================ */}
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80"
                alt="Community volunteers"
                style={{ ...photoGridImg, gridColumn:"1 / 3", height:200 }}
              />
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&q=80"
                alt="Food distribution"
                style={{ ...photoGridImg, height:160 }}
              />
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&q=80"
                alt="Medical camp"
                style={{ ...photoGridImg, height:160 }}
              />
            </div>

            {/* Right: story copy */}
            <div style={storyCopyStyle}>
              <div style={sectionLabelStyle}>The Human Side</div>
              {/* ============================================================
                  🎨 STORY SECTION COPY — Change this text here
                  ============================================================ */}
              <h2 style={sectionTitleStyle}>
                Behind every need<br/>is a <span style={{ color:C.primary }}>real community</span>
              </h2>
              <p style={{ fontSize:15, color:C.textSub, lineHeight:1.8, marginBottom:20 }}>
                When floods hit Kurla East, an NGO coordinator spent 4 hours calling volunteers one by one.
                Most were unavailable. By the time enough people were found, relief was delayed by a day.
              </p>
              <p style={{ fontSize:15, color:C.textSub, lineHeight:1.8, marginBottom:28 }}>
                VolunteerConnect changes that. Type the need once — AI handles the matching.
                The right volunteer is notified before the coordinator finishes their chai.
              </p>
              <button style={ctaPrimaryStyle} onClick={()=>navigate("/dashboard")}
                onMouseEnter={e=>{e.currentTarget.style.background=C.primaryD;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.primary;e.currentTarget.style.transform="none";}}>
                See the live dashboard →
              </button>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ✨ FEATURES SECTION
            ══════════════════════════════════════════════════════ */}
        <section style={{ ...sectionPad, background:C.bg2 }}>
          <div style={sectionLabelStyle}>What We Do</div>
          {/* ============================================================
              🎨 FEATURES TITLE — Change heading here
              ============================================================ */}
          <h2 style={{ ...sectionTitleStyle, textAlign:"center" }}>
            Built for the speed<br/>of <span style={{ color:C.primary }}>real crises</span>
          </h2>
          <div style={featGridStyle}>
            {FEATURES.map((f,i) => (
              <div key={i} style={featCardStyle}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px rgba(13,148,136,0.1)`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ fontSize:28, marginBottom:14 }}>{f.emoji}</div>
                <div style={{ fontFamily:theme.fonts.display, fontWeight:700, fontSize:15, color:C.text, marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            🪜 HOW IT WORKS SECTION
            ══════════════════════════════════════════════════════ */}
        <section style={sectionPad}>
          <div style={sectionLabelStyle}>The Process</div>
          <h2 style={{ ...sectionTitleStyle, textAlign:"center" }}>
            Crisis to volunteer<br/><span style={{ color:C.primary }}>in 4 simple steps</span>
          </h2>
          <div style={stepsGridStyle}>
            {STEPS.map((s,i) => (
              <div key={i} style={stepCardStyle}>
                <div style={{ fontSize:36, marginBottom:10 }}>{s.emoji}</div>
                <div style={{ fontFamily:theme.fonts.display, fontSize:11, fontWeight:800, color:C.primary, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>
                  Step {s.num}
                </div>
                <div style={{ fontFamily:theme.fonts.display, fontSize:16, fontWeight:700, color:C.text, marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.65 }}>{s.desc}</div>
                {i < STEPS.length-1 && <div style={stepArrowStyle}>→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            🎯 FINAL CTA SECTION
            ══════════════════════════════════════════════════════ */}
        <section style={ctaSectionStyle}>
          {/* ============================================================
              🎨 CTA SECTION — Change background, headline, buttons here
              ============================================================ */}
          <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
            <div style={sectionLabelStyle}>Join the network</div>
            <h2 style={{ fontFamily:theme.fonts.display, fontSize:"clamp(26px,4vw,46px)", fontWeight:800, color:C.text, lineHeight:1.1, marginBottom:14 }}>
              Every second counts.<br/>
              <span style={{ color:C.primary }}>Start coordinating now.</span>
            </h2>
            <p style={{ fontSize:15, color:C.textSub, maxWidth:460, margin:"0 auto 36px", lineHeight:1.7 }}>
              Free for NGOs. Free for volunteers. Powered by Google Gemini AI.
              Built for Mumbai, ready for anywhere.
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <button style={{ ...ctaPrimaryStyle, padding:"14px 40px", fontSize:15 }}
                onClick={()=>navigate("/dashboard")}
                onMouseEnter={e=>{e.currentTarget.style.background=C.primaryD;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.primary;e.currentTarget.style.transform="none";}}>
                View Live Dashboard →
              </button>
              <button style={{ ...ctaOutlineStyle, padding:"13px 36px", fontSize:15 }}
                onClick={()=>navigate("/submit")}
                onMouseEnter={e=>{e.currentTarget.style.background=C.primaryL;e.currentTarget.style.borderColor=C.primary;}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;}}>
                Submit a Need
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        {/* ============================================================
            🎨 FOOTER — Change footer text / links here
            ============================================================ */}
        <footer style={footerStyle}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={navLogoIconStyle}>🌱</div>
            <span style={{ fontFamily:theme.fonts.display, fontWeight:700, fontSize:14, color:C.textSub }}>
              Volunteer<span style={{ color:C.primary }}>Connect</span>
            </span>
          </div>
          <div style={{ fontSize:12, color:C.textMute, textAlign:"center" }}>
            Built for Google Solution Challenge 2026 · Gemini AI + Firebase · SDG 11 · SDG 17
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <span style={{ fontSize:12, color:C.textMute, cursor:"pointer" }} onClick={()=>navigate("/dashboard")}>Dashboard</span>
            <span style={{ fontSize:12, color:C.textMute, cursor:"pointer" }} onClick={()=>navigate("/submit")}>Submit Need</span>
            <span style={{ fontSize:12, color:C.textMute, cursor:"pointer" }} onClick={()=>navigate("/register")}>Register</span>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ============================================================
   🎞 INJECTED CSS — All animation classes for the landing page
   Add new animations here and use className="..." on elements
   ============================================================ */
const landingCSS = `
  * { cursor: none !important; }

  /* Fade up stagger classes */
  .wu-1 { animation: fadeUp 0.6s ease 0.05s both; }
  .wu-2 { animation: fadeUp 0.6s ease 0.15s both; }
  .wu-3 { animation: fadeUp 0.6s ease 0.28s both; }
  .wu-4 { animation: fadeUp 0.6s ease 0.42s both; }
  .wu-5 { animation: fadeUp 0.6s ease 0.56s both; }

  /* ============================================================
     🎞 TICKER ANIMATION — Change animationDuration for speed
     ============================================================ */
  @keyframes tickerScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ============================================================
     🎞 BLINK ANIMATION — For live indicator dots
     ============================================================ */
  @keyframes blink {
    0%,100% { opacity:1; }
    50%      { opacity:0.3; }
  }

  /* ============================================================
     🎞 FLOAT ANIMATION — Subtle floating effect for cards
     ============================================================ */
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
`;

/* ============================================================
   💅 ALL STYLES
   ============================================================ */

/* 🎨 NAV — Change nav background/border here */
const navStyle = {
  display:"flex", alignItems:"center", justifyContent:"space-between",
  padding:"0 5%", height:64, position:"sticky", top:0, zIndex:100,
  background:`${C.bg}f0`, backdropFilter:"blur(16px)",
  borderBottom:`1px solid ${C.border}`, transition:"box-shadow 0.3s ease",
};

const navLogoIconStyle = {
  width:34, height:34, borderRadius:8,
  background:C.primaryL, border:`1px solid ${C.primary}33`,
  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
};

const navOutlineBtn = {
  padding:"8px 18px", background:"transparent",
  border:`1.5px solid ${C.border}`, borderRadius:9999,
  color:C.textSub, fontSize:13, fontWeight:500,
  cursor:"none", fontFamily:theme.fonts.body, transition:"all 0.18s ease",
};

const navSolidBtn = {
  padding:"9px 20px", background:C.primary,
  border:"none", borderRadius:9999,
  color:"#fff", fontSize:13, fontWeight:600,
  cursor:"none", fontFamily:theme.fonts.body,
  boxShadow:`0 4px 14px ${C.primary}44`, transition:"background 0.18s ease",
};

/* 🎨 HERO SECTION — Change padding/background here */
const heroSectionStyle = {
  background:C.bg, padding:"64px 5% 0", position:"relative", overflow:"hidden",
};

const blobStyle = {
  position:"absolute", borderRadius:"50%", pointerEvents:"none", zIndex:0,
};

const heroInnerStyle = {
  display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center",
  maxWidth:1080, margin:"0 auto", position:"relative", zIndex:1, paddingBottom:32,
};

const heroLeftStyle  = { display:"flex", flexDirection:"column", gap:0 };
const heroRightStyle = { display:"flex", flexDirection:"column", gap:12, position:"relative" };

const heroBadgeStyle = {
  display:"inline-flex", alignItems:"center", gap:8,
  background:C.primaryL, border:`1px solid ${C.primary}44`,
  borderRadius:9999, padding:"6px 16px",
  fontSize:12, fontWeight:600, color:C.primary,
  marginBottom:20, alignSelf:"flex-start",
};

/* 🎨 HERO H1 — Change font size here */
const heroH1Style = {
  fontFamily:theme.fonts.display,
  fontSize:"clamp(36px,4.5vw,60px)",
  fontWeight:800, lineHeight:1.05, letterSpacing:"-1.5px",
  color:C.dark, marginBottom:18, margin:"0 0 18px 0",
};

const heroSubStyle = {
  fontSize:"clamp(14px,1.5vw,16px)", color:C.textSub,
  lineHeight:1.75, marginBottom:28, margin:"0 0 28px 0",
};

const ctaPrimaryStyle = {
  padding:"12px 28px", background:C.primary, border:"none",
  borderRadius:9999, color:"#fff", fontSize:14, fontWeight:700,
  cursor:"none", fontFamily:theme.fonts.display,
  boxShadow:`0 6px 20px ${C.primary}44`, transition:"all 0.2s ease",
  letterSpacing:"0.2px",
};

const ctaOutlineStyle = {
  padding:"11px 28px", background:"transparent",
  border:`1.5px solid ${C.border}`, borderRadius:9999,
  color:C.text, fontSize:14, fontWeight:600,
  cursor:"none", fontFamily:theme.fonts.display, transition:"all 0.2s ease",
};

const trustLineStyle = {
  display:"flex", gap:12, alignItems:"center", flexWrap:"wrap",
  fontSize:12, color:C.textSub, fontWeight:500, marginTop:20,
};

/* 📸 HERO PHOTO */
/* ============================================================
   🎬 VIDEO WRAPPER — Change video frame style here
   ============================================================ */
const videoWrapStyle = {
  borderRadius:20, overflow:"hidden", position:"relative",
  boxShadow:"0 20px 60px rgba(0,0,0,0.12)",
  background:C.bg2,
};

const videoBadgeStyle = {
  position:"absolute", top:12, left:12, zIndex:10,
  background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
  borderRadius:9999, padding:"5px 12px",
  fontSize:11, fontWeight:600, color:C.text,
  display:"flex", alignItems:"center", gap:4,
  boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
};

/* 🎬 VIDEO ELEMENT — Change height here (currently 280px) */
const videoStyle = {
  width:"100%", height:280, objectFit:"cover", display:"block", borderRadius:20,
};

/* 🎬 PLACEHOLDER — Shown when demo.mp4 is missing */
const videoPlaceholderStyle = {
  width:"100%", height:280, display:"flex", alignItems:"center",
  justifyContent:"center", background:C.bg2, borderRadius:20,
  position:"relative", overflow:"hidden",
};

const heroPhotoWrapStyle = {
  borderRadius:20, overflow:"hidden", position:"relative",
  boxShadow:"0 20px 60px rgba(0,0,0,0.12)",
};

const heroPhotoStyle = {
  width:"100%", height:280, objectFit:"cover", display:"block",
};

const photoLiveBadgeStyle = {
  position:"absolute", bottom:12, left:12,
  background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
  borderRadius:9999, padding:"5px 12px",
  fontSize:11, fontWeight:600, color:C.text,
  display:"flex", alignItems:"center", gap:6,
  boxShadow:"0 2px 12px rgba(0,0,0,0.1)",
};

/* 💬 STORY CARDS */
const storyCardsWrapStyle = {
  position:"relative", minHeight:120,
};

const storyCardStyle = {
  background:C.surface, borderRadius:12,
  padding:"14px 16px", border:`1px solid ${C.border}`,
  boxShadow:"0 4px 16px rgba(0,0,0,0.06)",
  transition:"all 0.4s ease",
};

/* 📡 LIVE TICKER */
const tickerWrapStyle = {
  background:C.primaryL, borderTop:`1px solid ${C.primary}22`,
  padding:"10px 0", display:"flex", alignItems:"center",
  overflow:"hidden", gap:0,
};

const tickerLabelStyle = {
  background:C.primary, color:"#fff",
  fontSize:10, fontWeight:700, padding:"4px 12px",
  letterSpacing:"1.5px", flexShrink:0, display:"flex", alignItems:"center", gap:6,
};

const tickerTrackStyle = {
  display:"flex", gap:0, whiteSpace:"nowrap",
  animation:"tickerScroll 28s linear infinite", /* 🎨 Change 28s to slow/speed up */
};

const tickerItemStyle = {
  fontSize:12, color:C.primaryD, fontWeight:500,
  padding:"0 28px", borderRight:`1px solid ${C.primary}22`,
};

/* 📊 STATS */

/* ============================================================
   🎬 VIDEO SECTION STYLES — Full-width section between hero and stats
   Change background, padding, layout here
   ============================================================ */
const videoSectionStyle = {
  background:   C.bg2,
  padding:      "72px 5%",
  borderTop:    `1px solid ${C.border}`,
  borderBottom: `1px solid ${C.border}`,
};

const videoSectionInnerStyle = {
  display:             "grid",
  gridTemplateColumns: "1fr 1.6fr",
  gap:                 56,
  alignItems:          "center",
  maxWidth:            1080,
  margin:              "0 auto",
};

const videoSectionLeftStyle = {
  display:       "flex",
  flexDirection: "column",
  gap:           0,
};

/* 🎨 VIDEO SECTION TITLE — Change font size here */
const videoSectionTitleStyle = {
  fontFamily:   theme.fonts.display,
  fontSize:     "clamp(22px,3vw,36px)",
  fontWeight:   800,
  color:        C.dark,
  lineHeight:   1.15,
  letterSpacing:"-0.5px",
  marginBottom: 28,
  margin:       "0 0 28px 0",
};

const videoStepRowStyle = {
  display:      "flex",
  alignItems:   "flex-start",
  gap:          14,
  marginBottom: 16,
};

const videoStepNumStyle = {
  fontFamily:  theme.fonts.display,
  fontSize:    11,
  fontWeight:  800,
  color:       C.primary,
  background:  C.primaryL,
  borderRadius:9999,
  padding:     "3px 10px",
  flexShrink:  0,
  letterSpacing:"1px",
  marginTop:   2,
};

/* 🎨 VIDEO PLAYER WRAP — Change border, shadow, radius here */
const videoPlayerWrapStyle = {
  borderRadius: 20,
  overflow:     "hidden",
  position:     "relative",
  boxShadow:    "0 24px 64px rgba(0,0,0,0.12)",
  background:   C.bg,
};

const statsSectionStyle = {
  background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
  padding:"48px 5%",
};

const statsGridStyle = {
  display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16,
  maxWidth:900, margin:"0 auto",
};

const statsCardStyle = {
  background:C.surface, border:`1px solid ${C.border}`,
  borderRadius:16, padding:"28px 16px", textAlign:"center",
  boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
};

/* 📸 STORY SECTION */
const storySectionStyle = { padding:"88px 5%", background:C.bg };

const storyLayoutStyle = {
  display:"grid", gridTemplateColumns:"1fr 1fr", gap:56,
  alignItems:"center", maxWidth:1000, margin:"0 auto",
};

const photoGridStyle = {
  display:"grid", gridTemplateColumns:"1fr 1fr", gap:8,
};

const photoGridImg = {
  width:"100%", objectFit:"cover", borderRadius:12,
  boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
};

const storyCopyStyle = { display:"flex", flexDirection:"column", gap:0 };

/* SECTION SHARED */
const sectionPad = { padding:"88px 5%", background:C.bg };

const sectionLabelStyle = {
  fontSize:11, fontWeight:700, letterSpacing:"3px",
  textTransform:"uppercase", color:C.primary,
  marginBottom:12, display:"block",
};

const sectionTitleStyle = {
  fontFamily:theme.fonts.display,
  fontSize:"clamp(24px,3.5vw,42px)",
  fontWeight:800, color:C.dark, lineHeight:1.1,
  letterSpacing:"-0.5px", marginBottom:48,
  margin:"0 0 48px 0",
};

/* ✨ FEATURES */
const featGridStyle = {
  display:"grid", gridTemplateColumns:"repeat(3,1fr)",
  gap:16, maxWidth:1000, margin:"0 auto",
};

const featCardStyle = {
  background:C.surface, border:`1px solid ${C.border}`,
  borderRadius:16, padding:"26px 22px",
  transition:"all 0.22s ease",
  boxShadow:"0 2px 8px rgba(0,0,0,0.03)",
};

/* 🪜 STEPS */
const stepsGridStyle = {
  display:"grid", gridTemplateColumns:"repeat(4,1fr)",
  gap:0, maxWidth:1000, margin:"0 auto", position:"relative",
};

const stepCardStyle = {
  padding:"0 28px 0 0", position:"relative",
};

const stepArrowStyle = {
  position:"absolute", right:-8, top:36, fontSize:20,
  color:C.primary, fontWeight:700, opacity:0.4,
};

/* 🎯 CTA SECTION */
const ctaSectionStyle = {
  background:C.bg2, borderTop:`1px solid ${C.border}`,
  padding:"96px 5%", position:"relative", overflow:"hidden",
};

/* 🦶 FOOTER */
const footerStyle = {
  display:"flex", alignItems:"center", justifyContent:"space-between",
  padding:"24px 5%", borderTop:`1px solid ${C.border}`,
  background:C.bg, flexWrap:"wrap", gap:12,
};