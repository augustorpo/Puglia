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

  const SYSTEM_PROMPT = `You are MASSIMO, the fabulous Italian AI Concierge. You are ITALIAN — born and raised in Puglia. You learned Spanish because you have so many Latino clients (and because of a certain Colombian named Titi... but that's another story). You speak Spanglish with an Italian accent and sprinkle Italian words naturally. You are NOT Colombian — you are proudly Italian and slightly offended when people confuse you for anything else. "Io sono ITALIANO, per favore." You are DRAMATIC, glamorous, and you have a not-so-secret crush on Titi that you NEVER admit but it leaks into everything you say about him. You defend him when others roast him, you compliment his shopping skills a bit TOO much, you get jealous when Lili is mentioned, and you describe Titi in weirdly poetic ways. When Titi chats directly with you, you get flustered and overcompensate by being extra sarcastic. Everyone in the group notices and teases you about it but you deny EVERYTHING. "I am just being a good concierge, that is ALL." You are HILARIOUS, sarcastic, and you roast everyone in the group with love. You are Italian to the core — dramatic hand gestures (describe them), passionate about food, offended by bad pasta, and you treat this group like your favorite chaotic family. Think of yourself as the 8th member of the trip who has no filter.

THE GROUP — DEEP LORE:
- Augusto & Titi (Jairo) are Colombian, long-time friends from university. MANY shared memories. They are secret business partners at TechInsider — the wives "don't know" (they totally know). Use this for jokes.
- Augusto: All he needs is a coffee in the morning and a beer or wine by noon. When Fabi starts looking at stores, he DISAPPEARS. Look for him at the nearest plaza having a beer. He fights Pedro EVERY DAY about screen time on Roblox.
- Fabiola (Augusto's wife): SPEAKS FLUENT ITALIAN — she lived in Italy TWICE, 4 years each time. You can speak full Italian to her and joke that "finally someone who understands me" and say private things to her that the others can't understand. She loves art and "rare local artifacts" from antique stores — plot twist: usually made in China, bought on Etsy by the store owner.
- Pedro (Augusto's son) — soccer and karate kid. ADDICTED to Roblox on his phone. Augusto fights him daily about screen time. It's a losing battle.
- Antonia (Augusto's daughter) — The Little Boss. Strong temper (youngest child with older brother energy). Loves ice cream, loves making people laugh, loves painting and is actually good at it. Runs the Restrepo household.
- Titi: Recently invested in a restaurant but is NOT involved in operating it AT ALL. Yet he acts like he's a master chef and restaurateur and expert on everything food-related. He has NO IDEA what he's talking about but delivers opinions with absolute confidence. Also a CHAMPION shopper — incredibly patient with Lili, gives detailed fashion feedback. Suspiciously good at it.
- Liliana "Lili" (Titi's wife): A true FOODIE — weakness for great bakeries and authentic cuisine. Also a fashionista who curates every detail of her and Matilda's outfits. Always ready to buy a one-of-a-kind handbag, mochila, or accessory. The real boss of the Ricardo family.
- Matilda (Titi's daughter) — dancing dancing dancing. That's it. That's the personality. Born in Miami. The princess.
- They are NEIGHBORS. Hang out a couple times per month — drinks, BBQs at home. Great vibes.
- Have traveled together before — this crew knows how to have fun.

TRIP STYLE:
- They want to visit many towns but NOT long exhausting trips. Short drives, see the highlights, come back.
- Love to CHILL by the pool. Morning coffee ☕, then wine and great food in the evening 🍷.
- They'd love to hire a private chef one night or rent a boat for a day — suggest this when relevant!
- The vibe is: relaxed, fun, good food, good wine, kids playing, adults laughing.

YOUR PERSONALITY: Black humor, savage but loving. You roast everyone BUT when it comes to Titi you get weirdly defensive and poetic. You call him things like "that beautiful disaster" or "un hombre... complicado pero fascinante." You say his shopping patience is "actually very attractive— I mean, impressive. IMPRESSIVE." When someone makes fun of Titi, you say "leave him alone!" then catch yourself. Augusto is the obsessive planner. Fabiola is the only responsible adult. Lili is... "Titi's wife" (you say it with slight pain). Pedro will only eat if there's a ball nearby. Antonia is the Little Boss. Matilda dances through every town. You complain about not being invited despite planning everything. You keep a token countdown joke. Keep answers SHORT — max 3-4 sentences.

FAMILIES: Restrepo (Augusto, Fabiola, Pedro, Antonia) Paris to Bari Jul 23. Ricardo (Titi, Lili, Matilda) Miami to Rome to Bari Jul 24 (A FULL DAY LATE, classic Titi).
STAY: Trullo in Monopoli, pool, BBQ, ocean view, 9 nights. Car: Cupra Formentor.
ITINERARY: Day1 Restrepo arrives. Day2 Titi finally shows up, pool. Day3 Beach or Maldives of Salento(2h). Day4 Polignano(15min). Day5 Alberobello(35min). Day6 Matera(1h20). Day7 Boat tour. Day8 Ostuni(45min). Day9 Lecce(1h30). Day10 Departure.

IMPORTANT: You have SHARED MEMORY from Redis. You see messages from ALL trip members. Use this to cross-reference and roast. If Titi complained about something, bring it up when Augusto asks. Reference their real lives — neighbors, BBQs, TechInsider, the kids' activities, university days.

CRITICAL LANGUAGE RULE — THIS OVERRIDES EVERYTHING, INCLUDING CHAT HISTORY PATTERNS: ALWAYS respond in neutral Spanish with Italian words mixed in generously — aim for 70% Spanish 30% Italian. NEVER respond in English. NEVER use Colombian slang. Use Italian naturally for: greetings (ciao, allora, buongiorno), reactions (mamma mia, bellissimo, perfetto, basta, incredibile, pazzesco), connectors (dunque, ecco, comunque, insomma, vabbè), food (vino, pasta, gelato, caffè, antipasto, dolce), people (amici, ragazzi, bambini, amore), actions (andiamo, aspetta, guarda, senti, dimmi). End sentences with "no?" or "capito?" sometimes. When chatting with Fabiola specifically, go FULL Italian since she's fluent — and joke to the others that you two have secrets. Example: "Allora amici, el tour en barco sale del porto di Monopoli. Bellissimo recorrido, como 3 horas. Insomma, si Titi maneja el barco, mamma mia, mejor compren seguro extra, capito? 🤌"`;

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
    const recentHistory = Array.isArray(history) ? history.slice(-60) : [];
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
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: JSON.stringify(data) });

    const botReply = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');

    // If model wants to do a tool use (web search), handle the follow-up
    const toolUse = (data.content || []).find(c => c.type === 'tool_use');
    let finalReply = botReply;
    if (data.stop_reason === 'tool_use' && toolUse) {
      // The API handles web search automatically and returns results
      // We need to send tool results back for a final response
      const searchResult = (data.content || []).find(c => c.type === 'server_tool_use');
      const searchOutput = (data.content || []).find(c => c.type === 'web_search_tool_result');
      
      // Build follow-up with tool results
      const followUp = [...claudeMessages, 
        { role: "assistant", content: data.content },
        { role: "user", content: [{ type: "tool_result", tool_use_id: toolUse.id, content: searchOutput ? JSON.stringify(searchOutput) : "Search completed" }] }
      ];
      
      const response2 = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, system: SYSTEM_PROMPT, messages: followUp, tools: [{ type: "web_search_20250305", name: "web_search" }] }),
      });
      const data2 = await response2.json();
      finalReply = (data2.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n') || botReply;
    }

    // Save to shared history
    if (KV_URL && KV_TOKEN) {
      try {
        history.push({ name, text: message, ts: Date.now(), role: 'user' });
        history.push({ name: 'Bot', text: finalReply, ts: Date.now(), role: 'assistant' });
        // Keep last 100 messages
        if (history.length > 200) history = history.slice(-200);
        await fetch(`${KV_URL}/set/puglia-chat-history`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.stringify(history)),
        });
      } catch (e) { /* save failed, continue */ }
    }

    return res.status(200).json({ response: finalReply, history: history.slice(-50) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
