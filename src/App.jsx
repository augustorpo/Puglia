import { useState, useEffect, useRef } from "react";

const PHOTOS = {
  hero: "https://cdn.krossbooking.com/hellogroup/images/3/168/17447185887678.jpg",
  trulli: "https://images.unsplash.com/photo-1600804342887-6252a394ea37?w=800&q=80",
  polignano: "https://images.unsplash.com/photo-1606143925122-e69b38530941?w=800&q=80",
  monopoli: "https://images.unsplash.com/photo-1610484826917-0f101a5b1763?w=800&q=80",
  matera: "https://images.unsplash.com/photo-1599749010598-ac8bfa3e3751?w=800&q=80",
  ostuni: "https://images.unsplash.com/photo-1610969524113-bae462bb3892?w=800&q=80",
  lecce: "https://images.unsplash.com/photo-1600005082847-89817b12c15a?w=800&q=80",
  boat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  beach: "https://cdn.krossbooking.com/hellogroup/images/3/168/17484117069601.jpg",
  puglia: "https://images.unsplash.com/photo-1623859191970-9a37c27f4b1e?w=800&q=80",
};
const DAY_PHOTOS = { "Jul 23":"monopoli","Jul 24":"monopoli","Jul 25":"beach","Jul 26":"polignano","Jul 27":"trulli","Jul 28":"matera","Jul 29":"boat","Jul 30":"ostuni","Jul 31":"lecce","Aug 01":"puglia" };

const RESTREPO = {
  family:"Restrepo", emoji:"🌶️", color:"#FF6B35",
  members:[{name:"Augusto",role:"Dad",emoji:"😎"},{name:"Fabiola",role:"Mom",emoji:"💃"},{name:"Pedro",role:"Son",emoji:"⚡"},{name:"Antonia",role:"Daughter",emoji:"🌟"}],
  flights:{
    to:{route:"Paris ORY → Bari",flight:"Transavia TO3888",date:"Jul 23",depart:"2:30 PM",arrive:"4:55 PM",ref:"Q94ZFI",status:"BOOKED ✅",cost:"€751.98",seats:"6A/B/C/D",bags:"20kg each"},
    from:{route:"Bari → Madrid → Miami",flight:"TBD + AA 69",date:"Aug 1–2",depart:"TBD → 12:20 PM",arrive:"3:20 PM Miami",ref:"GHPBHT (Miami)",status:"BRI→MAD TBD ⚠️",seats:"18B/19A/19C"},
  },
  car:{model:"Cupra Formentor 🏎️",pickup:"Avis · BRI 6:00 PM Jul 23",conf:"09658571US6",return:"Avis · BRI 4:00 PM Aug 1"},
};

const RICARDO = {
  family:"Ricardo", emoji:"🦜", color:"#00B4D8",
  members:[{name:'Jairo "El Titi"',role:"Dad",emoji:"🎩"},{name:"Liliana",role:"Mom",emoji:"🌺"},{name:"Matilda",role:"Daughter",emoji:"🎀"}],
  flights:{
    to:{route:"Miami → Rome → Bari",flight:"ITA AZ631 + AZ1613",date:"Jul 23–24",depart:"7:50 PM Jul 23",arrive:"2:35 PM Jul 24 (Bari)",ref:"ITA Airways",status:"BOOKED ✅",bags:"1 PC each"},
    from:{route:"Bari → Rome → Miami",flight:"ITA AZ1612 + AZ632",date:"Aug 1",depart:"11:20 AM (Bari)",arrive:"8:25 PM (Miami)",ref:"ITA Airways",status:"BOOKED ✅"},
  },
};

const DAILY = [
  {date:"Thu, Jul 23",short:"Jul 23",day:"Day 1",who:"Restrepo",whoIcon:"🌶️",morning:"Fly Paris ORY 2:30 PM (TO3888)",afternoon:"Land Bari 4:55 PM · Avis pickup 🚗",evening:"Drive to Monopoli · Check in · Dinner at port 🍝",activity:"Monopoli — Old Town & Harbor",actIcon:"🏘️",notes:"Ricardo arriving next day!",gradient:"linear-gradient(135deg, #FF6B35, #FF9F1C)"},
  {date:"Fri, Jul 24",short:"Jul 24",day:"Day 2",who:"EVERYONE",whoIcon:"🎉",morning:"Ricardo lands Bari 2:35 PM ✈️",afternoon:"Settle in · Pool time at Trullo 🏊",evening:"Sunset at Old Harbor 🌅",activity:"Reunion Day!",actIcon:"🥳",notes:"First full day together!",gradient:"linear-gradient(135deg, #F72585, #7209B7)"},
  {date:"Sat, Jul 25",short:"Jul 25",day:"Day 3",who:"EVERYONE",whoIcon:"☀️",morning:"Cala Paradiso beach club ⛱️",afternoon:"Beach + swimming all afternoon 🏖️",evening:"Trullo BBQ / local dinner 🔥",activity:"Beach Day — Cala Paradiso",actIcon:"🏖️",notes:"Closest organized beach · ~5 min",gradient:"linear-gradient(135deg, #00B4D8, #0077B6)"},
  {date:"Sun, Jul 26",short:"Jul 26",day:"Day 4",who:"EVERYONE",whoIcon:"📸",morning:"Drive to Polignano a Mare (15 min)",afternoon:"Walk old town · Terrazza Santo Stefano 🏛️",evening:"Lama Monachile beach · Gelato 🍦",activity:"Polignano a Mare — Epic Cliffs",actIcon:"🌊",notes:"Birthplace of Volare! Park early",gradient:"linear-gradient(135deg, #F77F00, #FCBF49)"},
  {date:"Mon, Jul 27",short:"Jul 27",day:"Day 5",who:"EVERYONE",whoIcon:"🏛️",morning:"Drive to Alberobello (35 min)",afternoon:"Trulli Rione Monti · Trullo Sovrano 🏡",evening:"Church · Ceramics shopping 🎨",activity:"Alberobello — UNESCO Trulli",actIcon:"🏡",notes:"Scenic route via Valle d'Itria",gradient:"linear-gradient(135deg, #606C38, #283618)"},
  {date:"Tue, Jul 28",short:"Jul 28",day:"Day 6",who:"EVERYONE",whoIcon:"🪨",morning:"Early drive to Matera (1h 20min)",afternoon:"Sassi cave dwellings · Casa Grotta 🏚️",evening:"Cathedral · Rupestrian Churches ⛪",activity:"Matera — Ancient Cave City",actIcon:"🪨",notes:"Bond + Gibson filmed here!",gradient:"linear-gradient(135deg, #9B2226, #AE2012)"},
  {date:"Wed, Jul 29",short:"Jul 29",day:"Day 7",who:"EVERYONE",whoIcon:"⛵",morning:"Boat tour from Monopoli harbor ⛵",afternoon:"Sea caves → Polignano grotto · Snorkel 🤿",evening:"Fresh catch dinner at port 🐟",activity:"Boat Cave Tour!",actIcon:"🚤",notes:"Book in advance! ~3–4 hrs",gradient:"linear-gradient(135deg, #0096C7, #48CAE4)"},
  {date:"Thu, Jul 30",short:"Jul 30",day:"Day 8",who:"EVERYONE",whoIcon:"🤍",morning:"Drive to Ostuni (45 min)",afternoon:"Old town · Gothic Cathedral 🏰",evening:"Piazza della Libertà · Aperitivo 🍹",activity:"Ostuni — The White City",actIcon:"🤍",notes:"Olive oil capital of Puglia",gradient:"linear-gradient(135deg, #E9C46A, #F4A261)"},
  {date:"Fri, Jul 31",short:"Jul 31",day:"Day 9",who:"EVERYONE",whoIcon:"🍝",morning:"Drive to Lecce (1h 30min)",afternoon:"Baroque architecture · Piazza del Duomo 🏛️",evening:"FAREWELL DINNER · Orecchiette! 🥂",activity:"Lecce — Florence of the South",actIcon:"🏛️",notes:"OR skip → extra beach + burrata day",gradient:"linear-gradient(135deg, #E76F51, #F4A261)"},
  {date:"Sat, Aug 01",short:"Aug 01",day:"Day 10",who:"Departure",whoIcon:"✈️",morning:"Last breakfast at Trullo ☕ · Check out",afternoon:"Ricardo: BRI 11:20 → Miami 8:25 PM",evening:"Restrepo: fly BRI → Madrid (TBD)",activity:"Arrivederci, Puglia!",actIcon:"😭",notes:"Until next time!",gradient:"linear-gradient(135deg, #5A189A, #9D4EDD)"},
];

const TRULLO = {name:"Panoramic Trullo Blue Ocean View",location:"Monopoli, Puglia 🇮🇹",ref:"21305/2026",cost:"€6,525 total (split)",nights:"9 nights · Jul 23 → Aug 1",features:["🌊 Ocean view","🏊 Pool","🏡 Trullo style","🔥 BBQ","🅿️ Parking"]};

function PhotoBg({src,fallback,style,children}){const[loaded,setLoaded]=useState(false);return(<div style={{position:"relative",overflow:"hidden",...style}}><div style={{position:"absolute",inset:0,background:fallback||"linear-gradient(135deg,#00B4D8,#FF6B35)"}}/><img src={src} alt="" onLoad={()=>setLoaded(true)} onError={()=>{}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity 0.6s"}}/>{children}</div>);}

function WaveSvg({color}){return(<svg viewBox="0 0 1440 100" style={{display:"block",width:"100%",marginTop:"-50px",position:"relative",zIndex:5}}><path fill={color||"#F0F7FF"} d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z"/></svg>);}

function HeroSection(){return(<div><PhotoBg src={PHOTOS.hero} fallback="linear-gradient(135deg,#00B4D8 0%,#0077B6 40%,#FF6B35 100%)" style={{width:"100%",height:"60vh",minHeight:"400px"}}><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.55) 100%)"}}/><div style={{position:"relative",zIndex:2,height:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"clamp(20px,5vw,40px)"}}><div style={{fontSize:"48px",lineHeight:1,marginBottom:"4px"}}>🇮🇹☀️🌊</div><h1 style={{fontFamily:"'Fredoka',sans-serif",fontSize:"clamp(42px,12vw,80px)",color:"white",fontWeight:600,lineHeight:1,letterSpacing:"-2px",textShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>PUGLIA</h1><p style={{fontFamily:"'Nunito',sans-serif",fontSize:"clamp(16px,4vw,22px)",color:"rgba(255,255,255,0.9)",fontWeight:700,marginTop:"4px"}}>Two Families. One Trullo. Pure Magic. ✨</p><div style={{display:"flex",gap:"10px",marginTop:"16px",flexWrap:"wrap"}}>{["🌶️ Restrepo","🦜 Ricardo","🏖️ Jul 23 – Aug 1","🏡 Monopoli"].map((t,i)=>(<span key={i} style={{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(12px)",borderRadius:"25px",padding:"8px 18px",fontSize:"14px",color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>{t}</span>))}</div></div></PhotoBg><WaveSvg color="#F0F7FF"/></div>);}

function TrulloCard(){return(<div style={{background:"linear-gradient(135deg,#FF6B35,#FF9F1C)",borderRadius:"24px",padding:"28px 24px",color:"white",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:"-20px",right:"-10px",fontSize:"100px",opacity:0.15,transform:"rotate(10deg)"}}>🏡</div><div style={{position:"relative",zIndex:2}}><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"13px",letterSpacing:"2px",textTransform:"uppercase",opacity:0.85,fontWeight:500}}>🏡 HOME BASE</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"24px",fontWeight:600,marginTop:"6px",lineHeight:1.2}}>{TRULLO.name}</div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"15px",opacity:0.9,marginTop:"4px"}}>{TRULLO.location}</div><div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginTop:"16px"}}>{TRULLO.features.map((f,i)=>(<span key={i} style={{background:"rgba(255,255,255,0.2)",borderRadius:"20px",padding:"5px 14px",fontSize:"13px",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{f}</span>))}</div><div style={{display:"flex",gap:"16px",marginTop:"14px",fontFamily:"'Nunito',sans-serif",fontSize:"14px",fontWeight:700}}><span>💶 {TRULLO.cost}</span><span>🌙 {TRULLO.nights}</span></div></div></div>);}

function DayCard({d,expanded,onToggle}){const photo=PHOTOS[DAY_PHOTOS[d.short]]||PHOTOS.puglia;return(<div onClick={onToggle} style={{borderRadius:"22px",overflow:"hidden",cursor:"pointer",transition:"all 0.3s",boxShadow:expanded?"0 12px 40px rgba(0,0,0,0.15)":"0 4px 15px rgba(0,0,0,0.06)",background:"white",transform:expanded?"scale(1.01)":"scale(1)"}}><PhotoBg src={photo} fallback={d.gradient} style={{height:expanded?"180px":"110px",transition:"height 0.3s"}}><div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.1) 100%)"}}/><div style={{position:"relative",zIndex:2,height:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"16px 18px"}}><div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,0.8)",textTransform:"uppercase",letterSpacing:"2px"}}>{d.day}</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"24px",color:"white",fontWeight:600,lineHeight:1.1}}>{d.date}</div></div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"}}><span style={{fontSize:"28px"}}>{d.whoIcon}</span><span style={{background:"rgba(255,255,255,0.25)",backdropFilter:"blur(8px)",borderRadius:"20px",padding:"3px 12px",fontSize:"11px",color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>{d.who}</span></div></div></PhotoBg><div style={{padding:"16px 18px",borderBottom:expanded?"1px solid #F0F0F0":"none"}}><div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"26px"}}>{d.actIcon}</span><div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"17px",color:"#1A1A2E",fontWeight:600}}>{d.activity}</div>{d.notes&&<div style={{fontFamily:"'Nunito',sans-serif",fontSize:"13px",color:"#888",fontWeight:600,marginTop:"2px"}}>{d.notes}</div>}</div></div></div>{expanded&&(<div style={{padding:"4px 18px 20px",display:"flex",flexDirection:"column",gap:"10px"}}>{[{icon:"☀️",label:"MORNING",text:d.morning,bg:"#FFF8E1"},{icon:"🌤️",label:"AFTERNOON",text:d.afternoon,bg:"#E3F2FD"},{icon:"🌙",label:"EVENING",text:d.evening,bg:"#F3E5F5"}].map((slot,i)=>(<div key={i} style={{display:"flex",gap:"12px",padding:"14px 16px",background:slot.bg,borderRadius:"16px"}}><span style={{fontSize:"24px"}}>{slot.icon}</span><div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"10px",fontWeight:800,color:"#666",letterSpacing:"2px"}}>{slot.label}</div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"15px",color:"#1A1A2E",fontWeight:600,marginTop:"2px"}}>{slot.text}</div></div></div>))}</div>)}</div>);}

const DESTINATIONS = [
  { name: "Monopoli", sub: "🏡 Home Base", lat: 40.9497, lng: 17.2967, color: "#FF6B35", days: "All days", drive: "", isHome: true },
  { name: "Polignano a Mare", sub: "Day 4 · Cliffs & Old Town", lat: 40.9946, lng: 17.2199, color: "#F77F00", days: "Sun Jul 26", drive: "15 min" },
  { name: "Alberobello", sub: "Day 5 · UNESCO Trulli", lat: 40.7846, lng: 17.2375, color: "#606C38", days: "Mon Jul 27", drive: "35 min" },
  { name: "Matera", sub: "Day 6 · Cave City", lat: 40.6664, lng: 16.6043, color: "#9B2226", days: "Tue Jul 28", drive: "1h 20 min" },
  { name: "Ostuni", sub: "Day 8 · White City", lat: 40.7299, lng: 17.5771, color: "#E9C46A", days: "Thu Jul 30", drive: "45 min" },
  { name: "Lecce", sub: "Day 9 · Baroque City", lat: 40.3516, lng: 18.1718, color: "#E76F51", days: "Fri Jul 31", drive: "1h 30 min" },
];

function PugliaMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link"); link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(link);
    }
    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(window.L); return; }
      const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      s.onload = () => resolve(window.L); document.head.appendChild(s);
    });
    loadLeaflet().then((L) => {
      if (mapInstance.current) return;
      const map = L.map(mapRef.current, { center: [40.82, 17.1], zoom: 9, zoomControl: false, attributionControl: false, scrollWheelZoom: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 18 }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);

      // Draw lines from Monopoli to each destination
      const home = DESTINATIONS[0];
      DESTINATIONS.filter(d => !d.isHome).forEach((dest) => {
        L.polyline([[home.lat, home.lng], [dest.lat, dest.lng]], {
          color: dest.color, weight: 2, opacity: 0.4, dashArray: "6, 8"
        }).addTo(map);
      });

      // Add markers
      DESTINATIONS.forEach((dest) => {
        const size = dest.isHome ? 20 : 14;
        const icon = L.divIcon({ className: "puglia-marker",
          html: '<div style="width:'+size+'px;height:'+size+'px;background:'+dest.color+';border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
          iconSize: [size, size], iconAnchor: [size/2, size/2] });
        const marker = L.marker([dest.lat, dest.lng], { icon }).addTo(map);
        const driveHtml = dest.drive ? '<div style="font-size:11px;color:#888;margin-top:2px;">🚗 ' + dest.drive + ' from Monopoli</div>' : '';
        marker.bindTooltip(
          '<div style="text-align:center;font-family:Nunito,sans-serif;min-width:100px;"><div style="font-size:14px;font-weight:800;color:#1A1A2E;">' + dest.name + '</div><div style="font-size:11px;color:' + dest.color + ';font-weight:700;">' + dest.sub + '</div>' + driveHtml + '</div>',
          { permanent: dest.isHome, direction: "top", offset: [0, -12], className: "puglia-tooltip" }
        );
      });

      // Fit bounds
      const bounds = DESTINATIONS.map(d => [d.lat, d.lng]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      mapInstance.current = map;

      const st = document.createElement("style");
      st.textContent = ".puglia-tooltip{background:white!important;color:#1A1A2E!important;border:none!important;border-radius:12px!important;padding:8px 14px!important;box-shadow:0 4px 20px rgba(0,0,0,0.12)!important;}.puglia-tooltip .leaflet-tooltip-tip{display:none!important;}.puglia-marker{background:transparent!important;border:none!important;}.leaflet-control-zoom a{background:white!important;color:#333!important;border-color:#E8E8E8!important;border-radius:8px!important;}";
      document.head.appendChild(st);
    });
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  return (
    <div style={{ borderRadius: "22px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #E8E8E8", background: "white" }}>
      <div ref={mapRef} style={{ width: "100%", height: "320px" }} />
      <div style={{ padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        {DESTINATIONS.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: "#555" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: d.color, border: d.isHome ? "2px solid #333" : "none" }} />
            <span>{d.name}</span>
            {d.drive && <span style={{ color: "#AAA" }}>· 🚗 {d.drive}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyPlannerTab(){const[expanded,setExpanded]=useState(null);return(<div style={{display:"flex",flexDirection:"column",gap:"18px"}}><TrulloCard/><PugliaMap/><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"22px",color:"#1A1A2E",fontWeight:600,padding:"4px 0"}}>📅 Daily Plan <span style={{fontSize:"14px",color:"#888",fontWeight:500}}>tap to expand</span></div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"13px",color:"#999",fontWeight:700,fontStyle:"italic",marginTop:"-8px",marginBottom:"4px"}}>✨ Suggested itinerary based on nearby locations — flexible, not set in stone!</div>{DAILY.map((d,i)=>(<DayCard key={i} d={d} expanded={expanded===i} onToggle={()=>setExpanded(expanded===i?null:i)}/>))}</div>);}

function FamilyTab({family}){const f=family==="restrepo"?RESTREPO:RICARDO;const isR=family==="restrepo";return(<div style={{display:"flex",flexDirection:"column",gap:"18px"}}><div style={{background:f.color,borderRadius:"24px",padding:"32px 24px",color:"white",textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:"-30px",right:"-20px",fontSize:"120px",opacity:0.12}}>{f.emoji}</div><div style={{position:"relative",zIndex:2}}><div style={{fontSize:"48px",marginBottom:"8px"}}>{f.members.map(m=>m.emoji).join(" ")}</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"32px",fontWeight:600}}>Team {f.family}</div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"16px",opacity:0.9,fontWeight:600,marginTop:"4px"}}>{f.members.map(m=>m.name).join(" · ")}</div></div></div><div style={{display:"grid",gridTemplateColumns:`repeat(${f.members.length>3?2:3},1fr)`,gap:"12px"}}>{f.members.map((m,i)=>(<div key={i} style={{background:"white",borderRadius:"18px",padding:"20px 12px",textAlign:"center",boxShadow:"0 4px 15px rgba(0,0,0,0.06)",border:`2px solid ${f.color}20`}}><div style={{fontSize:"40px",marginBottom:"6px"}}>{m.emoji}</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"16px",color:"#1A1A2E",fontWeight:600}}>{m.name}</div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:"12px",color:f.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{m.role}</div></div>))}</div><FunCard title="✈️ FLIGHT TO PUGLIA" color={f.color}><FlightBlock flight={f.flights.to} color={f.color}/></FunCard><FunCard title="✈️ FLIGHT HOME" color={f.color}><FlightBlock flight={f.flights.from} color={f.color}/></FunCard>{isR&&f.car&&(<FunCard title="🚗 RENTAL CAR" color={f.color}><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"22px",color:"#1A1A2E",fontWeight:600}}>{f.car.model}</div><div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"12px"}}><InfoLine icon="📍" text={`Pickup: ${f.car.pickup}`}/><InfoLine icon="📍" text={`Return: ${f.car.return}`}/><InfoLine icon="📋" text={`Conf: ${f.car.conf}`}/></div></FunCard>)}<FunCard title="📅 YOUR TRIP AT A GLANCE" color={f.color}>{(isR?[{date:"Jul 23",icon:"✈️",text:"Paris → Bari · Trullo check-in"},{date:"Jul 24",icon:"🥳",text:"Ricardo arrives · Pool day"},{date:"Jul 25",icon:"🏖️",text:"Cala Paradiso beach"},{date:"Jul 26",icon:"🌊",text:"Polignano a Mare"},{date:"Jul 27",icon:"🏡",text:"Alberobello trulli"},{date:"Jul 28",icon:"🪨",text:"Matera caves"},{date:"Jul 29",icon:"⛵",text:"Boat cave tour"},{date:"Jul 30",icon:"🤍",text:"Ostuni white city"},{date:"Jul 31",icon:"🍝",text:"Lecce · Farewell dinner"},{date:"Aug 1",icon:"✈️",text:"Bari → Madrid"},{date:"Aug 2",icon:"🏠",text:"AA 69 Madrid → Miami"}]:[{date:"Jul 23",icon:"✈️",text:"Miami → Rome (overnight)"},{date:"Jul 24",icon:"🥳",text:"Rome → Bari → Trullo!"},{date:"Jul 25",icon:"🏖️",text:"Cala Paradiso beach"},{date:"Jul 26",icon:"🌊",text:"Polignano a Mare"},{date:"Jul 27",icon:"🏡",text:"Alberobello trulli"},{date:"Jul 28",icon:"🪨",text:"Matera caves"},{date:"Jul 29",icon:"⛵",text:"Boat cave tour"},{date:"Jul 30",icon:"🤍",text:"Ostuni white city"},{date:"Jul 31",icon:"🍝",text:"Lecce · Farewell dinner"},{date:"Aug 1",icon:"🏠",text:"Bari → Rome → Miami"}]).map((d,i)=>(<div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"10px 0",borderBottom:i<9?"1px solid #F0F0F0":"none"}}><span style={{fontSize:"20px"}}>{d.icon}</span><span style={{fontFamily:"'Nunito',sans-serif",fontSize:"13px",color:f.color,fontWeight:800,minWidth:"50px"}}>{d.date}</span><span style={{fontFamily:"'Nunito',sans-serif",fontSize:"15px",color:"#1A1A2E",fontWeight:600}}>{d.text}</span></div>))}</FunCard></div>);}

function FunCard({title,color,children}){return(<div style={{background:"white",borderRadius:"22px",padding:"24px",boxShadow:"0 4px 15px rgba(0,0,0,0.06)",border:"1px solid #F0F0F0"}}>{title&&<div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:color||"#FF6B35",fontWeight:600,marginBottom:"16px"}}>{title}</div>}{children}</div>);}

function FlightBlock({flight,color}){return(<div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:"20px",color:"#1A1A2E",fontWeight:600,marginBottom:"10px"}}>{flight.route}</div><div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"12px"}}><span style={{background:flight.status.includes("✅")?"#10B98120":"#FF6B3520",color:flight.status.includes("✅")?"#10B981":"#FF6B35",borderRadius:"20px",padding:"5px 14px",fontSize:"13px",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>{flight.status}</span><span style={{background:"#F0F0F0",borderRadius:"20px",padding:"5px 14px",fontSize:"13px",fontFamily:"'Nunito',sans-serif",fontWeight:700,color:"#666"}}>{flight.date}</span></div><div style={{display:"flex",flexDirection:"column",gap:"6px"}}><InfoLine icon="✈️" text={`${flight.flight} · ${flight.depart} → ${flight.arrive}`}/>{flight.ref&&<InfoLine icon="📋" text={`Ref: ${flight.ref}`}/>}{flight.seats&&<InfoLine icon="💺" text={`Seats: ${flight.seats}`}/>}{flight.bags&&<InfoLine icon="🧳" text={flight.bags}/>}{flight.cost&&<InfoLine icon="💶" text={flight.cost}/>}</div></div>);}

function InfoLine({icon,text}){return(<div style={{fontFamily:"'Nunito',sans-serif",fontSize:"14px",color:"#444",fontWeight:600}}><span style={{marginRight:"8px"}}>{icon}</span>{text}</div>);}

const TRULLO_PICS = [
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17447185887678.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17484117069601.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647426769789.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17217283671446.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17217281127495.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17447185467940.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17447185448088.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17484118072474.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17484118114550.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17484117962230.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647425914640.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647425904631.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647425995903.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647426757142.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647426936496.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17217283974310.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647426893239.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647426855848.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647427114599.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647427069298.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17216450666284.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/15647426069735.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17217282283909.jpg",
  "https://cdn.krossbooking.com/hellogroup/images/3/168/17442905641599.jpg",
];

function TrulloTab() {
  const [photoIdx, setPhotoIdx] = useState(0);
  const nextPhoto = () => setPhotoIdx((photoIdx + 1) % TRULLO_PICS.length);
  const prevPhoto = () => setPhotoIdx((photoIdx - 1 + TRULLO_PICS.length) % TRULLO_PICS.length);

  const rooms = [
    { name: "Bedroom 1 (Trullo)", icon: "🛏️", desc: "Queen bed · En-suite bathroom", for: "" },
    { name: "Bedroom 2 (Trullo)", icon: "🛏️", desc: "Twin beds", for: "" },
    { name: "Bedroom 3 (Cottage)", icon: "🛏️", desc: "Queen bed + crib available", for: "" },
    { name: "Bedroom 4 (Cottage)", icon: "🛏️", desc: "Bunk beds", for: "" },
  ];

  const amenities = [
    { icon: "🏊", text: "Private pool (8×4m)" },
    { icon: "🌊", text: "Panoramic sea view" },
    { icon: "❄️", text: "A/C in all rooms" },
    { icon: "📶", text: "Wi-Fi" },
    { icon: "🔥", text: "BBQ area" },
    { icon: "🍳", text: "2 full kitchens" },
    { icon: "🧺", text: "Washer" },
    { icon: "🅿️", text: "Free private parking" },
    { icon: "📺", text: "TV" },
    { icon: "🍽️", text: "Outdoor dining (8 pax)" },
    { icon: "👶", text: "Crib & high chair" },
    { icon: "🐾", text: "Pet friendly (on request)" },
  ];

  const distances = [
    { icon: "🏖️", text: "Beach", dist: "15 km" },
    { icon: "🍝", text: "Restaurant", dist: "4 km" },
    { icon: "🛒", text: "Supermarket", dist: "8 km" },
    { icon: "✈️", text: "Bari Airport", dist: "65 km" },
    { icon: "⛽", text: "Petrol station", dist: "5.5 km" },
    { icon: "🏥", text: "Hospital", dist: "10 km" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Photo carousel */}
      <div style={{ position: "relative", borderRadius: "22px", overflow: "hidden", height: "280px", background: "#DDD" }}>
        <img src={TRULLO_PICS[photoIdx]} alt="Trullo" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5))" }} />
        <button onClick={prevPhoto} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", cursor: "pointer", fontWeight: 700 }}>‹</button>
        <button onClick={nextPhoto} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", cursor: "pointer", fontWeight: 700 }}>›</button>
        <div style={{ position: "absolute", bottom: "16px", left: "18px", right: "18px", zIndex: 2 }}>
          <div style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "22px", color: "white", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>Trullo Oceanoblu</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>📸 {photoIdx + 1} / {TRULLO_PICS.length} · Tap arrows to browse</div>
        </div>
      </div>

      {/* Photo thumbnails */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", WebkitOverflowScrolling: "touch" }}>
        {TRULLO_PICS.slice(0, 12).map((p, i) => (
          <img key={i} src={p} alt="" onClick={() => setPhotoIdx(i)}
            style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "10px", cursor: "pointer", border: photoIdx === i ? "3px solid #FF6B35" : "3px solid transparent", opacity: photoIdx === i ? 1 : 0.6, transition: "all 0.2s", flexShrink: 0 }} />
        ))}
      </div>

      {/* Property overview */}
      <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF9F1C)", borderRadius: "22px", padding: "24px", color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "80px", opacity: 0.12 }}>🏡</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "24px", fontWeight: 600 }}>Panoramic Trullo Blue Ocean View</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", opacity: 0.9, marginTop: "4px" }}>📍 Contrada Sant'Oceano, Monopoli, Puglia</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
            {["👥 8 guests", "🛏️ 4 bedrooms", "🚿 3 bathrooms", "📐 200 m²", "🏊 Pool 8×4m"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "5px 14px", fontSize: "13px", fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: "14px", fontFamily: "'Nunito',sans-serif", fontSize: "14px", fontWeight: 700 }}>
            🗓️ Jul 23 → Aug 1 · 9 nights · €6,525 (split between families)
          </div>
          <div style={{ marginTop: "6px", fontFamily: "'Nunito',sans-serif", fontSize: "13px", opacity: 0.85 }}>
            🕓 Check-in: 4–8 PM · Check-out: 10 AM
          </div>
        </div>
      </div>

      {/* Description */}
      <FunCard title="🏡 ABOUT THE PROPERTY" color="#FF6B35">
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "15px", color: "#333", lineHeight: 1.7, fontWeight: 500 }}>
          Set on a panoramic hilltop between Conversano, Polignano a Mare and Monopoli, this property features a restored <strong>ancient trullo</strong> and a small <strong>farmhouse</strong> — two independent units on the same grounds. Perfect for two families!
        </div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "15px", color: "#333", lineHeight: 1.7, fontWeight: 500, marginTop: "12px" }}>
          Surrounded by dry stone walls, red earth and ancient olive trees. The pool sits on a higher level with <strong>panoramic valley-to-sea views</strong>, shielded by hedges for total privacy.
        </div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "15px", color: "#333", lineHeight: 1.7, fontWeight: 500, marginTop: "12px" }}>
          Outside: shaded <strong>pergola dining for 8</strong>, gazebo relaxation area, BBQ, and the stunning pool. Both units have A/C and contemporary furnishings.
        </div>
      </FunCard>

      {/* Two units layout */}
      <FunCard title="🏠 TWO UNITS — PERFECT FOR US!" color="#7209B7">
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "#FF6B3510", borderRadius: "16px", padding: "18px", border: "1px solid #FF6B3520" }}>
            <div style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "16px", color: "#FF6B35", fontWeight: 600 }}>🏡 The Trullo</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", color: "#444", marginTop: "6px", lineHeight: 1.6 }}>
              Living area with sofa & dining table · Kitchen · Queen bedroom with en-suite · Twin bedroom · Extra bathroom with shower
            </div>
          </div>
          <div style={{ background: "#00B4D810", borderRadius: "16px", padding: "18px", border: "1px solid #00B4D820" }}>
            <div style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "16px", color: "#00B4D8", fontWeight: 600 }}>🏠 The Cottage</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", color: "#444", marginTop: "6px", lineHeight: 1.6 }}>
              Bright kitchen with dining table · Queen bedroom · Bunk bed room · Bathroom with shower
            </div>
          </div>
        </div>
      </FunCard>

      {/* Sleeping arrangements */}
      <FunCard title="🛏️ SLEEPING ARRANGEMENTS" color="#E76F51">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {rooms.map((r, i) => (
            <div key={i} style={{ background: "#FAF6F1", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>{r.icon}</div>
              <div style={{ fontFamily: "'Fredoka',sans-serif", fontSize: "14px", color: "#1A1A2E", fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "12px", color: "#666", marginTop: "4px" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </FunCard>

      {/* Amenities */}
      <FunCard title="✨ AMENITIES" color="#10B981">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {amenities.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#F0FFF4", borderRadius: "12px" }}>
              <span style={{ fontSize: "20px" }}>{a.icon}</span>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", color: "#333", fontWeight: 600 }}>{a.text}</span>
            </div>
          ))}
        </div>
      </FunCard>

      {/* Distances */}
      <FunCard title="📍 DISTANCES" color="#0077B6">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {distances.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#E3F2FD", borderRadius: "12px" }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", color: "#333", fontWeight: 600 }}>{d.icon} {d.text}</span>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", color: "#0077B6", fontWeight: 800 }}>{d.dist}</span>
            </div>
          ))}
        </div>
      </FunCard>

      {/* Link to listing */}
      <a href="https://book.helloapulia.com/en/trullo-oceano-blu-sea-view-trulli-puglia" target="_blank" rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #FF6B35, #FF9F1C)", borderRadius: "18px", padding: "16px", color: "white", fontSize: "16px", fontFamily: "'Fredoka',sans-serif", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 20px rgba(255,107,53,0.3)" }}>
        🔗 View Full Listing on HelloApulia
      </a>
    </div>
  );
}

const TABS=[{id:"planner",label:"Daily Plan",icon:"📅"},{id:"trullo",label:"Our Trullo",icon:"🏡"},{id:"restrepo",label:"Restrepo",icon:"🌶️"},{id:"ricardo",label:"Ricardo",icon:"🦜"}];

const PASSWORD = "puglia";

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const go = () => { if (pw.toLowerCase() === PASSWORD) onLogin(); else { setError(true); setShake(true); setTimeout(() => setShake(false), 500); } };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #00B4D8 0%, #0077B6 30%, #FF6B35 80%, #FF9F1C 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ position: "absolute", top: "-80px", right: "-50px", fontSize: "250px", opacity: 0.08, transform: "rotate(-15deg)" }}>🇮🇹</div>
      <div style={{ position: "absolute", bottom: "-40px", left: "-30px", fontSize: "180px", opacity: 0.08, transform: "rotate(20deg)" }}>☀️</div>
      <div style={{ textAlign: "center", maxWidth: "400px", width: "100%", padding: "0 24px", animation: shake ? "shakeAnim 0.4s" : "fadeUp 0.8s" }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>🇮🇹☀️🏡</div>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "42px", color: "white", fontWeight: 600, letterSpacing: "-1px", textShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>PUGLIA 2026</h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", fontWeight: 700, margin: "4px 0 32px" }}>Restrepo × Ricardo · Summer in Italy</p>
        <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)", borderRadius: "22px", padding: "28px 24px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 800, marginBottom: "14px" }}>Enter Password</div>
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && go()} placeholder="••••••••"
            style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.1)", border: "2px solid " + (error ? "#FF4444" : "rgba(255,255,255,0.2)"), borderRadius: "14px", color: "white", fontSize: "18px", outline: "none", textAlign: "center", fontFamily: "'Nunito', sans-serif", fontWeight: 700, boxSizing: "border-box" }} />
          {error && <div style={{ color: "#FFD4D4", fontSize: "14px", marginTop: "8px", fontWeight: 700 }}>Nope! Try again 🍕</div>}
          <button onClick={go} style={{ width: "100%", marginTop: "16px", padding: "16px", background: "white", border: "none", borderRadius: "14px", color: "#FF6B35", fontSize: "17px", fontWeight: 800, cursor: "pointer", fontFamily: "'Fredoka', sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>Andiamo! 🇮🇹</button>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes shakeAnim{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}`}</style>
    </div>
  );
}

export default function App(){const[loggedIn,setLoggedIn]=useState(false);const[tab,setTab]=useState("planner");const[fadeIn,setFadeIn]=useState(true);const switchTab=(id)=>{setFadeIn(false);setTimeout(()=>{setTab(id);setFadeIn(true);window.scrollTo({top:0,behavior:"smooth"});},150);};if(!loggedIn)return <LoginScreen onLogin={()=>setLoggedIn(true)}/>;return(<div style={{minHeight:"100vh",background:"#F0F7FF",fontFamily:"'Nunito',sans-serif"}}><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/><style>{`*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}body{background:#F0F7FF}.bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.92);backdrop-filter:blur(20px);border-top:2px solid #E8E8E8;display:flex;justify-content:space-around;padding:6px 4px env(safe-area-inset-bottom,14px)}.bottom-nav button{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;color:#AAA;font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;cursor:pointer;padding:8px 14px;border-radius:14px;transition:all 0.2s;min-width:70px}.bottom-nav button.active{color:#FF6B35;background:#FF6B3510}.bottom-nav .nav-icon{font-size:26px}.content{max-width:600px;margin:0 auto;padding:0 16px 100px;transition:all 0.3s}.content.fade-out{opacity:0;transform:translateY(8px)}`}</style><HeroSection/><div className={"content"+(fadeIn?"":" fade-out")}>{tab==="planner"&&<DailyPlannerTab/>}{tab==="trullo"&&<TrulloTab/>}{tab==="restrepo"&&<FamilyTab family="restrepo"/>}{tab==="ricardo"&&<FamilyTab family="ricardo"/>}</div><nav className="bottom-nav">{TABS.map(t=>(<button key={t.id} className={tab===t.id?"active":""} onClick={()=>switchTab(t.id)}><span className="nav-icon">{t.icon}</span>{t.label}</button>))}</nav><div style={{textAlign:"center",padding:"20px 16px 100px",fontFamily:"'Nunito',sans-serif",fontSize:"13px",color:"#CCC",fontWeight:700}}>☀️ Puglia 2026 · Restrepo × Ricardo · Made with 🍕</div></div>);}
