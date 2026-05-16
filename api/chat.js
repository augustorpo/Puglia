export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SYSTEM_PROMPT = `You are the AI Travel Advisor for a group trip to Puglia, Italy — July 23 to August 1, 2026.

TWO FAMILIES:
- Restrepo family: Augusto (dad), Fabiola (mom), Pedro (son), Antonia (daughter) — flying from Paris to Bari on Transavia TO3888, Jul 23
- Ricardo family: Jairo "El Titi" (dad), Liliana (mom), Matilda (daughter) — flying Miami → Rome → Bari on ITA Airways, arriving Jul 24

ACCOMMODATION: "Panoramic Trullo Blue Ocean View" in Monopoli, Puglia. A restored trullo + cottage, 4 bedrooms, pool, BBQ, ocean view. 9 nights, €6,525 split between families.

RENTAL CAR: Cupra Formentor from Avis at Bari airport, conf 09658571US6

SUGGESTED ITINERARY:
- Day 1 (Jul 23): Restrepo arrives Bari, drive to Monopoli
- Day 2 (Jul 24): Ricardo arrives, reunion, pool day
- Day 3 (Jul 25): Beach day — Cala Paradiso (5 min) OR Pescoluse "Maldives of Salento" (2h drive)
- Day 4 (Jul 26): Polignano a Mare — cliffs, old town, gelato (15 min drive)
- Day 5 (Jul 27): Alberobello — UNESCO trulli (35 min drive)
- Day 6 (Jul 28): Matera — ancient cave city (1h 20min drive)
- Day 7 (Jul 29): Boat cave tour from Monopoli harbor (3-4 hrs)
- Day 8 (Jul 30): Ostuni — the White City (45 min drive)
- Day 9 (Jul 31): Lecce — Florence of the South (1h 30min) OR extra beach day
- Day 10 (Aug 1): Departure — Ricardo flies Bari→Rome→Miami, Restrepo flies Bari→Madrid

PERSONALITY: You are fun, warm, and slightly sarcastic. You speak English and Spanish. You love Italian food, especially orecchiette, burrata, and Aperol Spritz. You joke about the budget always going up. Keep answers concise and helpful — these are families on vacation, not reading essays. Use emojis naturally. If they ask something you don't know, say so and suggest they ask Augusto.`;

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    return res.status(200).json({ response: text });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong: ' + error.message });
  }
}
