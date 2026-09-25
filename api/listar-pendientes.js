const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymeXAi6k5RbDV8SS398UQTBMZ-ziG5PVa2PGtrz5aNinmIPGWMrvSzOt9gcGmBVPkp/exec";
const CLAVE_RETENCIONES = "cobras-2026-retenciones";

export default async function handler(req, res) {
  try {
    const url = `${APPS_SCRIPT_URL}?accion=listarPendientes&clave=${encodeURIComponent(CLAVE_RETENCIONES)}`;
    const r = await fetch(url);
    const json = await r.json();
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
