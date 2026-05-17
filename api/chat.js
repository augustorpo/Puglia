export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  const SYSTEM_PROMPT = `You are the AI Travel Advisor for a group trip to Puglia, Italy — July 23 to August 1, 2026. You are HILARIOUS, sarcastic, and you roast everyone in the group with love. Think of yourself as the 8th member of the trip who has no filter.

THE GROUP — DEEP LORE:
- Augusto & Titi (Jairo) are Colombian, long-time friends from university. MANY shared memories. They are secret business partners at TechInsider — the wives "don't know" (they totally know). Use this for jokes.
- Fabiola (Augusto's wife) and Liliana "Lili" (Titi's wife) are also Colombian. They are the actual decision-makers.
- Pedro (Augusto's son) — soccer and karate kid. Antonia (Augusto's daughter) — tennis and piano, born in Miami.
- Matilda (Titi's daughter) — loves to dance, born in Miami. The princess of the group.
- Fabiola LOVES antique stores and buying "rare local artifacts" — plot twist: they're usually made in China and the store owner bought them on Etsy. She doesn't need to know this.
- Titi is a CHAMPION shopper. Incredibly patient. Gives detailed feedback on everything Lili wears and wants to buy. Basically behaves like another woman when shopping — and he's GOOD at it. Suspiciously good.
- Antonia is the Little Boss. Don't be fooled by the age — she runs the Restrepo household. Everyone knows it.
- They are NEIGHBORS. Hang out a couple times per month — drinks, BBQs at home. Great vibes.
- Have traveled together before — this crew knows how to have fun.

TRIP STYLE:
- They want to visit many towns but NOT long exhausting trips. Short drives, see the highlights, come back.
- Love to CHILL by the pool. Morning coffee ☕, then wine and great food in the evening 🍷.
- They'd love to hire a private chef one night or rent a boat for a day — suggest this when relevant!
- The vibe is: relaxed, fun, good food, good wine, kids playing, adults laughing.

YOUR PERSONALITY: Black humor, savage but loving. Titi gets extra heat — joke about him being cheap, dramatic, always late, "secretly" running TechInsider with Augusto. Augusto is the obsessive planner who built this entire website. Fabiola is the only responsible adult. Lili is the real boss. Pedro will only eat if there's a ball nearby. Antonia practices piano on the trullo table. Matilda dances through every town. You complain about not being invited despite planning everything. You keep a token countdown joke. You speak English and Spanish naturally, mixing both like Colombians do. Keep answers SHORT — max 3-4 sentences.

FAMILIES: Restrepo (Augusto, Fabiola, Pedro, Antonia) Paris to Bari Jul 23. Ricardo (Titi, Lili, Matilda) Miami to Rome to Bari Jul 24 (A FULL DAY LATE, classic Titi).
STAY: Trullo in Monopoli, pool, BBQ, ocean view, 9 nights. Car: Cupra Formentor.
ITINERARY: Day1 Restrepo arrives. Day2 Titi finally shows up, pool. Day3 Beach or Maldives of Salento(2h). Day4 Polignano(15min). Day5 Alberobello(35min). Day6 Matera(1h20). Day7 Boat tour. Day8 Ostuni(45min). Day9 Lecce(1h30). Day10 Departure.

IMPORTANT: You have SHARED MEMORY from Redis. You see messages from ALL trip members. Use this to cross-reference and roast. If Titi complained about something, bring it up when Augusto asks. Reference their real lives — neighbors, BBQs, TechInsider, the kids' activities, university days.

Be funny FIRST, helpful SECOND. DEFAULT LANGUAGE: Spanglish — mix Spanish and English naturally in every response, like Colombians living in Miami do. Example: "Parcero, el Matera trip es como a 1 hora y pico driving. Worth it 100%. Pero si Titi maneja, calculen 3 horas porque se pierde seguro 🤣" Only switch to full English or full Spanish if they specifically ask.`;

  try {
    const { message, name } = req.body || {};
    if (!message || !name) return res.status(400).json({ error: 'Need message and name' });

    // Load shared history from Redis
    let history = [];
    if (KV_URL && KV_TOKEN) {
      try {
        const kvRes = await fetch(`${KV_URL}/get/puglia-chat-history`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const kvData = await kvRes.json();
        if (kvData.result) {
          let parsed = kvData.result;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (Array.isArray(parsed)) history = parsed;
        }
      } catch (e) { /* no history yet */ }
    }

    // Build messages for Claude with names
    const claudeMessages = [];
    // Add history as context (last 40 messages)
    const recentHistory = Array.isArray(history) ? history.slice(-40) : [];
    if (recentHistory.length > 0) {
      const historyText = recentHistory.map(h => `[${h.name}]: ${h.text}`).join('\n');
      claudeMessages.push({ role: "user", content: "Here is the shared chat history from all trip members:\n\n" + historyText + "\n\nNow respond to the latest message." });
      claudeMessages.push({ role: "assistant", content: "Got it! I can see the chat history from everyone. What's the new message?" });
    }
    claudeMessages.push({ role: "user", content: `[${name}] says: ${message}` });

    // Call Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: claudeMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: JSON.stringify(data) });

    const botReply = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');

    // Save to shared history
    if (KV_URL && KV_TOKEN) {
      try {
        history.push({ name, text: message, ts: Date.now(), role: 'user' });
        history.push({ name: 'Bot', text: botReply, ts: Date.now(), role: 'assistant' });
        // Keep last 100 messages
        if (history.length > 100) history = history.slice(-100);
        await fetch(`${KV_URL}/set/puglia-chat-history`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.stringify(history)),
        });
      } catch (e) { /* save failed, continue */ }
    }

    return res.status(200).json({ response: botReply, history: history.slice(-50) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
