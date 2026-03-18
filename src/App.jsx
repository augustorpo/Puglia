import { useState, useEffect } from "react";

// ─── PHOTOS (Unsplash) ──────────────────────────────────────────────────────
const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1590846083693-f23fdede3a7e?w=1200&q=80",
  trulli: "https://images.unsplash.com/photo-1600804342887-6252a394ea37?w=800&q=80",
  polignano: "https://images.unsplash.com/photo-1606143925122-e69b38530941?w=800&q=80",
  monopoli: "https://images.unsplash.com/photo-1610484826917-0f101a5b1763?w=800&q=80",
  matera: "https://images.unsplash.com/photo-1599749010598-ac8bfa3e3751?w=800&q=80",
  ostuni: "https://images.unsplash.com/photo-1610969524113-bae462bb3892?w=800&q=80",
  lecce: "https://images.unsplash.com/photo-1600005082847-89817b12c15a?w=800&q=80",
  boat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  puglia: "https://images.unsplash.com/photo-1623859191970-9a37c27f4b1e?w=800&q=80",
};

const DAY_PHOTOS = {
  "Jul 23": "monopoli",
  "Jul 24": "monopoli",
  "Jul 25": "beach",
  "Jul 26": "polignano",
  "Jul 27": "trulli",
  "Jul 28": "matera",
  "Jul 29": "boat",
  "Jul 30": "ostuni",
  "Jul 31": "lecce",
  "Aug 01": "puglia",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const RESTREPO = {
  family: "Restrepo",
  emoji: "🇨🇴",
  color: "#B85C38",
  members: [
    { name: "Augusto", role: "Dad", emoji: "👨" },
    { name: "Fabiola", role: "Mom", emoji: "👩" },
    { name: "Pedro", role: "Son", emoji: "🧒" },
    { name: "Antonia", role: "Daughter", emoji: "👧" },
  ],
  flights: {
    to: { route: "Paris ORY → Bari", flight: "Transavia TO3888", date: "Jul 23", depart: "2:30 PM", arrive: "4:55 PM", ref: "Q94ZFI", status: "BOOKED ✅", cost: "€751.98", seats: "6A/B/C/D", bags: "20kg each" },
    from: { route: "Bari → Madrid → Miami", flight: "TBD + AA 69", date: "Aug 1–2", depart: "TBD → 12:20 PM", arrive: "3:20 PM Miami", ref: "GHPBHT (Miami)", status: "BRI→MAD TBD", seats: "18B/19A/19C" },
  },
  car: { model: "Cupra Formentor", pickup: "Avis · BRI 6:00 PM Jul 23", conf: "09658571US6", return: "Avis · BRI 4:00 PM Aug 1" },
};

const RICARDO = {
  family: "Ricardo",
  emoji: "🇨🇴",
  color: "#5B7553",
  members: [
    { name: 'Jairo "El Titi"', role: "Dad", emoji: "👨" },
    { name: "Liliana", role: "Mom", emoji: "👩" },
    { name: "Matilda", role: "Daughter", emoji: "👧" },
  ],
  flights: {
    to: { route: "Miami → Rome → Bari", flight: "ITA AZ631 + AZ1613", date: "Jul 23–24", depart: "7:50 PM Jul 23", arrive: "2:35 PM Jul 24 (Bari)", ref: "ITA Airways", status: "BOOKED ✅", bags: "1 PC each" },
    from: { route: "Bari → Rome → Miami", flight: "ITA AZ1612 + AZ632", date: "Aug 1", depart: "11:20 AM (Bari)", arrive: "8:25 PM (Miami)", ref: "ITA Airways", status: "BOOKED ✅" },
  },
};

const DAILY = [
  { date: "Thu, Jul 23", short: "Jul 23", day: "Day 1", who: "Restrepo", morning: "Fly Paris ORY 2:30 PM (TO3888)", afternoon: "Land Bari 4:55 PM · Avis pickup", evening: "Drive to Monopoli · Check in · Dinner at port", activity: "🏘️ Monopoli — Old Town & Harbor", notes: "Ricardo arriving next day", color: "#B85C38" },
  { date: "Fri, Jul 24", short: "Jul 24", day: "Day 2", who: "EVERYONE 🎉", morning: "Ricardo lands Bari 2:35 PM", afternoon: "Settle in · Pool time at Trullo", evening: "Sunset at Old Harbor", activity: "🏘️ Monopoli — Cala Porta Vecchia + Old Town", notes: "First full day together!", color: "#D4A76A" },
  { date: "Sat, Jul 25", short: "Jul 25", day: "Day 3", who: "EVERYONE", morning: "Cala Paradiso beach club", afternoon: "Beach + swimming all afternoon", evening: "Trullo BBQ / local dinner", activity: "🏖️ Monopoli Beach Day — Cala Paradiso", notes: "Closest organized beach · ~5 min", color: "#2B6E99" },
  { date: "Sun, Jul 26", short: "Jul 26", day: "Day 4", who: "EVERYONE", morning: "Drive to Polignano a Mare (15 min)", afternoon: "Walk old town · Terrazza Santo Stefano", evening: "Lama Monachile beach · Gelato", activity: "📍 Polignano a Mare — Cliffs & Old Town", notes: "Birthplace of Volare! · Park early", color: "#C17649" },
  { date: "Mon, Jul 27", short: "Jul 27", day: "Day 5", who: "EVERYONE", morning: "Drive to Alberobello (35 min)", afternoon: "Trulli Rione Monti · Trullo Sovrano", evening: "Trullo Church · Ceramics shopping", activity: "🏛️ Alberobello — UNESCO Trulli", notes: "Scenic route via Valle d'Itria", color: "#8B7355" },
  { date: "Tue, Jul 28", short: "Jul 28", day: "Day 6", who: "EVERYONE", morning: "Early drive to Matera (1h 20min)", afternoon: "Sassi cave dwellings · Casa Grotta", evening: "Cathedral · Rupestrian Churches", activity: "🪨 Matera — Ancient Cave City", notes: "Oldest inhabited city · Bond + Gibson filmed here", color: "#A0855B" },
  { date: "Wed, Jul 29", short: "Jul 29", day: "Day 7", who: "EVERYONE", morning: "Boat tour from Monopoli harbor", afternoon: "Sea caves → Polignano grotto · Snorkel", evening: "Fresh catch dinner at port", activity: "⛵ Boat Cave Tour — Monopoli → Polignano", notes: "Book in advance! ~3–4 hrs", color: "#2B6E99" },
  { date: "Thu, Jul 30", short: "Jul 30", day: "Day 8", who: "EVERYONE", morning: "Drive to Ostuni (45 min)", afternoon: "Old town · Gothic Cathedral", evening: "Piazza della Libertà · Aperitivo", activity: "🤍 Ostuni — The White City", notes: "Olive oil capital of Puglia", color: "#E8DCC8" },
  { date: "Fri, Jul 31", short: "Jul 31", day: "Day 9", who: "EVERYONE", morning: "Drive to Lecce (1h 30min)", afternoon: "Baroque architecture · Piazza del Duomo", evening: "Farewell dinner · Orecchiette!", activity: "🏛️ Lecce — Florence of the South", notes: "OR skip Lecce → extra beach + burrata day", color: "#C9956B" },
  { date: "Sat, Aug 01", short: "Aug 01", day: "Day 10", who: "Departure", morning: "Last breakfast at Trullo · Check out", afternoon: "Ricardo: BRI 11:20 AM → Miami 8:25 PM", evening: "Restrepo: fly BRI → Madrid (TBD)", activity: "✈️ Arrivederci, Puglia!", notes: "Restrepo sleeps Madrid · AA69 next day", color: "#B85C38" },
];

const TRULLO = {
  name: "Panoramic Trullo Blue Ocean View",
  location: "Monopoli, Puglia",
  ref: "21305/2026",
  cost: "€6,525 total (split between families)",
  nights: "9 nights · Jul 23 → Aug 1",
  features: ["Ocean view", "Pool", "Trullo architecture", "BBQ", "Parking"],
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function PhotoBg({ src, fallback, style, children }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: fallback || "linear-gradient(135deg, #B85C38, #5B3A29)" }} />
      <img src={src} alt="" onLoad={() => setLoaded(true)} onError={() => {}}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.6s" }} />
      {children}
    </div>
  );
}

// ─── TABS ────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <PhotoBg src={PHOTOS.hero} fallback="linear-gradient(135deg, #5B3A29 0%, #B85C38 50%, #D4A76A 100%)"
      style={{ width: "100%", height: "55vh", minHeight: "380px" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(20px, 5vw, 40px)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#D4A76A", fontWeight: 600 }}>July 23 – August 1, 2026</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 10vw, 72px)", color: "white", fontWeight: 300, lineHeight: 1, margin: "4px 0 8px", letterSpacing: "-1px" }}>Puglia</h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: "clamp(14px, 3vw, 18px)", color: "rgba(255,255,255,0.8)", fontWeight: 400, fontStyle: "italic", maxWidth: "500px" }}>
          Two families, one trullo, and the best of southern Italy
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(184,92,56,0.7)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "white", fontFamily: "'Lora', serif" }}>🇨🇴 Restrepo × Ricardo</span>
          <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "white", fontFamily: "'Lora', serif" }}>🇮🇹 Monopoli</span>
          <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "white", fontFamily: "'Lora', serif" }}>🏡 10 Days</span>
        </div>
      </div>
    </PhotoBg>
  );
}

function TrulloCard() {
  return (
    <div style={{ background: "rgba(184,92,56,0.08)", border: "1px solid rgba(184,92,56,0.2)", borderRadius: "16px", padding: "24px", margin: "0 0 20px" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#B85C38", fontWeight: 700, marginBottom: "10px" }}>🏡 OUR HOME BASE</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#3A2518", fontWeight: 600 }}>{TRULLO.name}</div>
      <div style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#8B7355", marginTop: "4px" }}>{TRULLO.location} · Ref {TRULLO.ref}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
        {TRULLO.features.map((f, i) => (
          <span key={i} style={{ background: "rgba(184,92,56,0.1)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", color: "#B85C38", fontFamily: "'Lora', serif" }}>{f}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "20px", marginTop: "14px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#5B3A29" }}>💶 {TRULLO.cost}</span>
        <span style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#5B3A29" }}>🌙 {TRULLO.nights}</span>
      </div>
    </div>
  );
}

function DayCard({ d, expanded, onToggle }) {
  const photo = PHOTOS[DAY_PHOTOS[d.short]] || PHOTOS.puglia;
  const isRestrepoOnly = d.who === "Restrepo";
  const isDeparture = d.who === "Departure";
  return (
    <div onClick={onToggle} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.3s", boxShadow: expanded ? "0 8px 30px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)", background: "white" }}>
      {/* Header with photo */}
      <PhotoBg src={photo} fallback={`linear-gradient(135deg, ${d.color}, #5B3A29)`}
        style={{ height: expanded ? "160px" : "100px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "flex-end", padding: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", color: "#D4A76A", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{d.day}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "white", fontWeight: 600, marginTop: "2px" }}>{d.date}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <span style={{ background: isRestrepoOnly ? "#B85C3880" : isDeparture ? "rgba(255,255,255,0.2)" : "#5B755380", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", color: "white", fontFamily: "'Lora', serif", fontWeight: 600 }}>{d.who}</span>
          </div>
        </div>
      </PhotoBg>
      {/* Activity label */}
      <div style={{ padding: "14px 16px", borderBottom: expanded ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: "16px", color: "#3A2518", fontWeight: 600 }}>{d.activity}</div>
        {d.notes && <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: "#8B7355", marginTop: "4px", fontStyle: "italic" }}>{d.notes}</div>}
      </div>
      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: "0 16px 18px", display: "flex", flexDirection: "column", gap: "10px", animation: "fadeIn 0.3s ease-out" }}>
          {[
            { icon: "☀️", label: "Morning", text: d.morning },
            { icon: "🌤️", label: "Afternoon", text: d.afternoon },
            { icon: "🌙", label: "Evening", text: d.evening },
          ].map((slot, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "12px", background: "#FAF6F1", borderRadius: "12px" }}>
              <span style={{ fontSize: "20px" }}>{slot.icon}</span>
              <div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: "11px", color: "#B85C38", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{slot.label}</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#3A2518", marginTop: "2px" }}>{slot.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DailyPlannerTab() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TrulloCard />
      {DAILY.map((d, i) => (
        <DayCard key={i} d={d} expanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} />
      ))}
    </div>
  );
}

function FamilyTab({ family }) {
  const f = family === "restrepo" ? RESTREPO : RICARDO;
  const isR = family === "restrepo";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Family header */}
      <div style={{ background: `linear-gradient(135deg, ${f.color}15, ${f.color}08)`, border: `1px solid ${f.color}25`, borderRadius: "16px", padding: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "6px" }}>{f.members.map(m => m.emoji).join(" ")}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: "#3A2518", fontWeight: 600 }}>The {f.family} Family</div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#8B7355", marginTop: "4px" }}>
          {f.members.map(m => m.name).join(" · ")}
        </div>
      </div>

      {/* Members */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${f.members.length > 3 ? 2 : 3}, 1fr)`, gap: "10px" }}>
        {f.members.map((m, i) => (
          <div key={i} style={{ background: "white", borderRadius: "14px", padding: "18px 12px", textAlign: "center", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: "32px", marginBottom: "6px" }}>{m.emoji}</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "15px", color: "#3A2518", fontWeight: 600 }}>{m.name}</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", color: "#8B7355" }}>{m.role}</div>
          </div>
        ))}
      </div>

      {/* Flight TO */}
      <Card title="✈️ FLIGHT TO PUGLIA" color={f.color}>
        <FlightInfo flight={f.flights.to} color={f.color} />
      </Card>

      {/* Flight BACK */}
      <Card title="✈️ RETURN FLIGHT" color={f.color}>
        <FlightInfo flight={f.flights.from} color={f.color} />
      </Card>

      {/* Car (Restrepo only) */}
      {isR && f.car && (
        <Card title="🚗 RENTAL CAR" color={f.color}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#3A2518", fontWeight: 600 }}>{f.car.model}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
            <Detail icon="📍" text={`Pickup: ${f.car.pickup}`} />
            <Detail icon="📍" text={`Return: ${f.car.return}`} />
            <Detail icon="📋" text={`Conf: ${f.car.conf}`} />
          </div>
        </Card>
      )}

      {/* Family itinerary */}
      <Card title="📅 DAILY OVERVIEW" color={f.color}>
        {(isR ? [
          { date: "Jul 23", text: "Paris → Bari · Trullo check-in" },
          { date: "Jul 24", text: "Ricardo arrives · Pool day" },
          { date: "Jul 25", text: "Cala Paradiso beach" },
          { date: "Jul 26", text: "Day trip: Polignano a Mare" },
          { date: "Jul 27", text: "Day trip: Alberobello" },
          { date: "Jul 28", text: "Day trip: Matera" },
          { date: "Jul 29", text: "Boat tour: sea caves" },
          { date: "Jul 30", text: "Day trip: Ostuni" },
          { date: "Jul 31", text: "Day trip: Lecce · Farewell dinner" },
          { date: "Aug 1", text: "Check out · Bari → Madrid" },
          { date: "Aug 2", text: "AA 69 Madrid → Miami 🏠" },
        ] : [
          { date: "Jul 23", text: "Miami → Rome (overnight flight)" },
          { date: "Jul 24", text: "Rome → Bari → Trullo 🎉" },
          { date: "Jul 25", text: "Cala Paradiso beach" },
          { date: "Jul 26", text: "Day trip: Polignano a Mare" },
          { date: "Jul 27", text: "Day trip: Alberobello" },
          { date: "Jul 28", text: "Day trip: Matera" },
          { date: "Jul 29", text: "Boat tour: sea caves" },
          { date: "Jul 30", text: "Day trip: Ostuni" },
          { date: "Jul 31", text: "Day trip: Lecce · Farewell dinner" },
          { date: "Aug 1", text: "Bari → Rome → Miami 🏠" },
        ]).map((d, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 0", borderBottom: i < 9 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: f.color, fontWeight: 700, minWidth: "52px" }}>{d.date}</span>
            <span style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#3A2518" }}>{d.text}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Card({ title, color, children }) {
  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "22px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      {title && <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: color || "#B85C38", fontWeight: 700, marginBottom: "14px" }}>{title}</div>}
      {children}
    </div>
  );
}

function FlightInfo({ flight, color }) {
  return (
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#3A2518", fontWeight: 600, marginBottom: "8px" }}>{flight.route}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
        <Tag text={flight.status} color={flight.status.includes("✅") ? "#5B7553" : "#B85C38"} />
        <Tag text={flight.date} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <Detail icon="✈️" text={`${flight.flight} · ${flight.depart} → ${flight.arrive}`} />
        {flight.ref && <Detail icon="📋" text={`Ref: ${flight.ref}`} />}
        {flight.seats && <Detail icon="💺" text={`Seats: ${flight.seats}`} />}
        {flight.bags && <Detail icon="🧳" text={flight.bags} />}
        {flight.cost && <Detail icon="💶" text={flight.cost} />}
      </div>
    </div>
  );
}

function Tag({ text, color }) {
  return (
    <span style={{ background: (color || "#8B7355") + "15", color: color || "#8B7355", borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontFamily: "'Lora', serif", fontWeight: 600 }}>{text}</span>
  );
}

function Detail({ icon, text }) {
  return (
    <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: "#5B3A29" }}>
      <span style={{ marginRight: "8px" }}>{icon}</span>{text}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "planner", label: "Daily Plan", icon: "📅" },
  { id: "restrepo", label: "Restrepo", icon: "🏠" },
  { id: "ricardo", label: "Ricardo", icon: "🏠" },
];

export default function App() {
  const [tab, setTab] = useState("planner");
  const [fadeIn, setFadeIn] = useState(true);
  const switchTab = (id) => { setFadeIn(false); setTimeout(() => { setTab(id); setFadeIn(true); window.scrollTo({ top: 0, behavior: "smooth" }); }, 150); };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF6F1", fontFamily: "'Lora', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: #FAF6F1; }

        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: rgba(250,246,241,0.95); backdrop-filter: blur(16px);
          border-top: 1px solid rgba(184,92,56,0.15);
          display: flex; justify-content: space-around;
          padding: 6px 4px env(safe-area-inset-bottom, 12px);
        }
        .bottom-nav button {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          background: none; border: none; color: #8B7355;
          font-family: 'Lora', serif; font-size: 11px; font-weight: 600;
          cursor: pointer; padding: 8px 18px; border-radius: 12px; transition: all 0.2s;
        }
        .bottom-nav button.active { color: #B85C38; background: rgba(184,92,56,0.1); }
        .bottom-nav .nav-icon { font-size: 22px; }

        .content {
          max-width: 600px; margin: 0 auto; padding: 20px 16px 100px;
          opacity: 1; transition: all 0.3s;
        }
        .content.fade-out { opacity: 0; transform: translateY(6px); }
      `}</style>

      {/* Hero */}
      <HeroSection />

      {/* Content */}
      <div className={"content" + (fadeIn ? "" : " fade-out")}>
        {tab === "planner" && <DailyPlannerTab />}
        {tab === "restrepo" && <FamilyTab family="restrepo" />}
        {tab === "ricardo" && <FamilyTab family="ricardo" />}
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => switchTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
