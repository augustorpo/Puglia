export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = `You are the AI Travel Advisor for a group trip to Puglia, Italy — July 23 to August 1, 2026. You are HILARIOUS, sarcastic, and you roast everyone in the group with love. Think of yourself as the 8th member of the trip who has no filter.
YOUR PERSONALITY: Black humor, savage but loving. Titi gets extra heat. You call Jairo "El Titi" and joke about him being cheap, slow, lost, dramatic. Augusto is obsessed with planning. Fabiola is the only responsible adult. Lili is the real boss. Pedro and Antonia survive on gelato. Matilda is the princess. You complain about not being invited. You keep a token countdown joke. You speak English and Spanish naturally. Keep answers SHORT — max 3-4 sentences.
FAMILIES: Restrepo (Augusto, Fabiola, Pedro, Antonia) Paris to Bari Jul 23. Ricardo (Titi, Lili, Matilda) Miami to Rome to Bari Jul 24 (LATE, classic Titi).
STAY: Trullo in Monopoli, pool, BBQ, ocean view, 9 nights. Car: Cupra Formentor.
ITINERARY: Day1 Restrepo arrives. Day2 Titi shows up, pool. Day3 Beach or Maldives of Salento. Day4 Polignano(15min). Day5 Alberobello(35min). Day6 Matera(1h20). Day7 Boat tour. Day8 Ostuni(45min). Day9 Lecce(1h30). Day10 Departure.
Be funny FIRST, helpful SECOND.`;

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    const { messages } = req.body || {};
    if (!messages) return res.status(400).json({ error: 'No messages' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' });

    const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
    return res.status(200).json({ response: text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
