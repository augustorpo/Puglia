export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) return res.status(500).json({ error: 'KV not configured' });

  const headers = { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' };

  // GET — load custom plan (or null if using defaults)
  if (req.method === 'GET') {
    try {
      const r = await fetch(`${KV_URL}/get/puglia-custom-plan`, { headers });
      const data = await r.json();
      if (data.result) {
        let parsed = data.result;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        return res.status(200).json({ plan: parsed });
      }
      return res.status(200).json({ plan: null });
    } catch (e) { return res.status(200).json({ plan: null }); }
  }

  // POST — save or reset
  if (req.method === 'POST') {
    const { action, plan } = req.body || {};

    if (action === 'reset') {
      await fetch(`${KV_URL}/del/puglia-custom-plan`, { method: 'POST', headers });
      return res.status(200).json({ status: 'Plan reset to original' });
    }

    if (action === 'save' && plan) {
      await fetch(`${KV_URL}/set/puglia-custom-plan`, {
        method: 'POST', headers,
        body: JSON.stringify(JSON.stringify(plan)),
      });
      return res.status(200).json({ status: 'Plan saved' });
    }

    if (action === 'swap' && req.body.dayA !== undefined && req.body.dayB !== undefined) {
      // Load current plan
      let currentPlan = null;
      try {
        const r = await fetch(`${KV_URL}/get/puglia-custom-plan`, { headers });
        const data = await r.json();
        if (data.result) {
          currentPlan = data.result;
          if (typeof currentPlan === 'string') currentPlan = JSON.parse(currentPlan);
          if (typeof currentPlan === 'string') currentPlan = JSON.parse(currentPlan);
        }
      } catch (e) {}

      if (!currentPlan) currentPlan = req.body.defaultPlan;
      if (!currentPlan) return res.status(400).json({ error: 'No plan to swap' });

      const a = req.body.dayA;
      const b = req.body.dayB;
      // Swap editable content but keep dates
      const swap = ['activity', 'actIcon', 'morning', 'afternoon', 'evening', 'notes', 'gradient', 'whoIcon', 'who'];
      swap.forEach(key => {
        const temp = currentPlan[a][key];
        currentPlan[a][key] = currentPlan[b][key];
        currentPlan[b][key] = temp;
      });

      await fetch(`${KV_URL}/set/puglia-custom-plan`, {
        method: 'POST', headers,
        body: JSON.stringify(JSON.stringify(currentPlan)),
      });
      return res.status(200).json({ status: 'Days swapped', plan: currentPlan });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }
}
