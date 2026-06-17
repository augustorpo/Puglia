export default async function handler(req, res) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (KV_URL && KV_TOKEN) {
    await fetch(`${KV_URL}/del/puglia-custom-plan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
  }
  res.status(200).json({ status: "Plan reset to original! 🔄🇮🇹" });
}
