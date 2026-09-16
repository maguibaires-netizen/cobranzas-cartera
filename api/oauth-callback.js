// Recibe la vuelta de Google después de que la persona autoriza el acceso a Drive.
// Cambia el "code" por un access_token + refresh_token, guarda el refresh_token
// en una cookie httpOnly (invisible para el JS del navegador) y redirige de
// vuelta al portal.

const CLIENT_ID = "485502926470-d4qmmmbefehg0rjurtcg9t5nnoi0d4as.apps.googleusercontent.com";
const REDIRECT_URI = "https://cobranzas-cartera.vercel.app/api/oauth-callback";
const RETURN_PATH = "/#/carga-retenciones";
const CONEXION_MAX_AGE = 60 * 60 * 24 * 180; // 180 días

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

export default async function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const { code, state, error } = req.query || {};
  const host = req.headers.host;
  const volverA = (query) => `https://${host}${RETURN_PATH}${query}`;

  if (error) {
    res.writeHead(302, { Location: volverA("?google=cancelado") });
    return res.end();
  }

  if (!code || !state || state !== cookies.oauth_state) {
    res.writeHead(302, { Location: volverA("?google=error_estado") });
    return res.end();
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const tokenJson = await tokenRes.json();

    if (!tokenRes.ok || !tokenJson.refresh_token) {
      console.error("Error intercambiando code por token:", tokenJson);
      res.writeHead(302, { Location: volverA("?google=error_token") });
      return res.end();
    }

    res.setHeader("Set-Cookie", [
      `gr_refresh_token=${encodeURIComponent(tokenJson.refresh_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${CONEXION_MAX_AGE}`,
      `gr_connected=1; Path=/; Secure; SameSite=Lax; Max-Age=${CONEXION_MAX_AGE}`,
      `oauth_state=; Path=/; Max-Age=0`,
    ]);

    res.writeHead(302, { Location: volverA("?google=conectado") });
    return res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(302, { Location: volverA("?google=error_token") });
    return res.end();
  }
}
