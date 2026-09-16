// Sube el archivo a Drive usando la cuenta de Google de la persona que lo subió
// (vía OAuth con refresh_token guardado en cookie), NO con una cuenta de servicio
// — las cuentas de servicio no tienen cuota propia en una carpeta de Gmail personal.

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const CLAVE_RETENCIONES = "cobras-2026-retenciones";
const FOLDER_ID = "1T1u5pgDtAT0mzx5fxfAaZ9eQj_ryck2e";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymeXAi6k5RbDV8SS398UQTBMZ-ziG5PVa2PGtrz5aNinmIPGWMrvSzOt9gcGmBVPkp/exec";
const CLIENT_ID = "485502926470-d4qmmmbefehg0rjurtcg9t5nnoi0d4as.apps.googleusercontent.com";

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(val);
  });
  return out;
}

function limpiarCookiesDeConexion(res) {
  res.setHeader("Set-Cookie", [
    "gr_refresh_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    "gr_connected=; Path=/; Secure; SameSite=Lax; Max-Age=0",
  ]);
}

async function refrescarAccessToken(refreshToken) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
      grant_type: "refresh_token",
    }),
  });
  const json = await r.json();
  if (!r.ok || !json.access_token) {
    throw new Error("no_se_pudo_refrescar");
  }
  return json.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const { filename, mimeType, data, clave } = req.body || {};

    if (clave !== CLAVE_RETENCIONES) {
      return res.status(401).json({ ok: false, error: "Clave inválida" });
    }
    if (!filename || !mimeType || !data) {
      return res.status(400).json({ ok: false, error: "Faltan datos del archivo" });
    }

    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies.gr_refresh_token;
    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        needsAuth: true,
        error: "Conectá tu cuenta de Google para poder subir archivos",
      });
    }

    let accessToken;
    try {
      accessToken = await refrescarAccessToken(refreshToken);
    } catch (err) {
      limpiarCookiesDeConexion(res);
      return res.status(401).json({
        ok: false,
        needsAuth: true,
        error: "Tu conexión con Google venció, reconectá tu cuenta",
      });
    }

    const boundary = "cobranzas-" + Date.now();
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelim = "\r\n--" + boundary + "--";
    const metadata = { name: filename, parents: [FOLDER_ID] };

    const body =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: " + mimeType + "\r\n" +
      "Content-Transfer-Encoding: base64\r\n\r\n" +
      data +
      closeDelim;

    const uploadRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "multipart/related; boundary=" + boundary,
        },
        body,
      }
    );
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok || !uploadJson.id) {
      throw new Error((uploadJson.error && uploadJson.error.message) || "Error al subir a Drive");
    }
    const fileId = uploadJson.id;

    const avisoUrl =
      `${APPS_SCRIPT_URL}?accion=procesarArchivo&fileId=${encodeURIComponent(fileId)}` +
      `&clave=${encodeURIComponent(CLAVE_RETENCIONES)}`;

    let avisoOk = true;
    try {
      await fetch(avisoUrl);
    } catch (avisoErr) {
      avisoOk = false;
      console.error("No se pudo avisar a Apps Script: " + avisoErr.message);
    }

    return res.status(200).json({ ok: true, fileId, avisoOk });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
