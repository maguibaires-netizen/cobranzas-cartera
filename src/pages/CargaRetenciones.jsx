import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Upload, X, FileUp, ArrowLeft, ArrowRight } from "lucide-react";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymeXAi6k5RbDV8SS398UQTBMZ-ziG5PVa2PGtrz5aNinmIPGWMrvSzOt9gcGmBVPkp/exec";
const CLAVE = "cobras-2026-retenciones";

const GOOGLE_CLIENT_ID = "485502926470-d4qmmmbefehg0rjurtcg9t5nnoi0d4as.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "https://cobranzas-cartera.vercel.app/api/oauth-callback";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/drive.file";

function leerCookie(nombre) {
  return document.cookie.split("; ").some((row) => row.startsWith(nombre + "="));
}

export default function CargaRetenciones() {
  const [vista, setVista] = useState("subir"); // "subir" | "revisar"
  const [conectadoGoogle, setConectadoGoogle] = useState(() => leerCookie("gr_connected"));
  const [avisoConexion, setAvisoConexion] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const google = params.get("google");
    if (!google) return;

    if (google === "conectado") {
      setConectadoGoogle(true);
      setAvisoConexion("✅ Cuenta de Google conectada");
    } else if (google === "cancelado") {
      setAvisoConexion("Cancelaste la conexión con Google");
    } else {
      setAvisoConexion("❌ No se pudo conectar con Google, probá de nuevo");
    }

    navigate(location.pathname, { replace: true });
    setTimeout(() => setAvisoConexion(""), 6000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const conectarConGoogle = () => {
    const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
    document.cookie = `oauth_state=${state}; path=/; max-age=600; SameSite=Lax; Secure`;

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    url.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", GOOGLE_SCOPE);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("state", state);

    window.location.href = url.toString();
  };

  return (
    <>
      <Link className="back-link" to="/">← Volver al portal</Link>

      <div className="page-header">
        <div className="page-title">Carga de retenciones</div>
        <div className="vista-tabs">
          <button className={`vista-tab${vista === "subir" ? " activo" : ""}`} onClick={() => setVista("subir")}>
            Subir
          </button>
          <button className={`vista-tab${vista === "revisar" ? " activo" : ""}`} onClick={() => setVista("revisar")}>
            Revisar pendientes
          </button>
        </div>
      </div>

      {avisoConexion && <div className="dropzone-status" style={{ margin: "0 0 14px" }}>{avisoConexion}</div>}

      {vista === "subir" ? (
        <PantallaSubir
          conectadoGoogle={conectadoGoogle}
          conectarConGoogle={conectarConGoogle}
          setConectadoGoogle={setConectadoGoogle}
          irARevisar={() => setVista("revisar")}
        />
      ) : (
        <PantallaRevisar />
      )}
    </>
  );
}

// ============================================================
//  PANTALLA 1 — Subir
// ============================================================
function PantallaSubir({ conectadoGoogle, conectarConGoogle, setConectadoGoogle, irARevisar }) {
  const [archivos, setArchivos] = useState([]); // [{nombre, estado, mensaje}]
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const archivoABase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const subirUnArchivo = async (file) => {
    const idx = archivos.length;
    setArchivos((prev) => [...prev, { nombre: file.name, estado: "subiendo", mensaje: "Subiendo…" }]);

    const actualizar = (cambios) => {
      setArchivos((prev) => prev.map((a) => (a.nombre === file.name ? { ...a, ...cambios } : a)));
    };

    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      actualizar({ estado: "error", mensaje: "❌ Solo se aceptan PDF o imágenes" });
      return;
    }
    if (file.size > 7 * 1024 * 1024) {
      actualizar({ estado: "error", mensaje: "❌ Pesa demasiado (máx. ~7 MB)" });
      return;
    }

    try {
      const data = await archivoABase64(file);
      const res = await fetch("/api/subir-retencion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, mimeType: file.type, data, clave: CLAVE }),
      });
      const json = await res.json();
      if (json.needsAuth) {
        setConectadoGoogle(false);
        actualizar({ estado: "error", mensaje: "❌ Conectá tu cuenta de Google" });
        return;
      }
      if (!res.ok || !json.ok) throw new Error(json.error || "Error al subir a Drive");
      actualizar({ estado: "listo", mensaje: "✅ Subido" });
    } catch (err) {
      actualizar({ estado: "error", mensaje: "❌ " + err.message });
    }
  };

  const subirVarios = (fileList) => {
    const files = Array.from(fileList || []);
    files.forEach((file) => subirUnArchivo(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    subirVarios(e.dataTransfer.files);
  };

  const hayAlgoListo = archivos.some((a) => a.estado === "listo");

  return (
    <div className="pantalla-subir">
      {!conectadoGoogle && (
        <div className="google-connect-banner">
          <div>
            <div className="google-connect-title">Conectá tu cuenta de Google</div>
            <div className="google-connect-sub">Es una sola vez — cada subida después va a quedar guardada con tu cuenta.</div>
          </div>
          <button className="upload-btn" onClick={conectarConGoogle}>Conectar con Google</button>
        </div>
      )}

      <div
        className={`dropzone dropzone-grande${dragOver ? " dragover" : ""}`}
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <FileUp size={36} color="var(--muted)" style={{ margin: "0 auto 12px" }} />
        <div className="dropzone-title">Arrastrá uno o varios PDF acá, o hacé clic para elegirlos</div>
        <div className="dropzone-sub">Acepta PDF o imágenes (JPG, PNG) · máx. ~7 MB cada uno</div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => subirVarios(e.target.files)}
        />
      </div>

      {archivos.length > 0 && (
        <div className="lista-subidas">
          {archivos.map((a, i) => (
            <div key={i} className={`item-subida item-${a.estado}`}>
              <span className="item-nombre">{a.nombre}</span>
              <span className="item-mensaje">{a.mensaje}</span>
            </div>
          ))}
        </div>
      )}

      {hayAlgoListo && (
        <div className="aviso-revisar">
          <div>Los archivos subidos se están procesando en segundo plano (puede tardar unos minutos).</div>
          <button className="upload-btn" onClick={irARevisar}>
            Ir a revisar pendientes <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  PANTALLA 2 — Revisar
// ============================================================
function PantallaRevisar() {
  const [cargando, setCargando] = useState(true);
  const [pendientes, setPendientes] = useState([]);
  const [error, setError] = useState("");

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      const url = `/api/listar-pendientes?_=${Date.now()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "No se pudo cargar");
      setPendientes(json.pendientes || []);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const quitarDeLista = (fila) => {
    setPendientes((prev) => prev.filter((p) => p.fila !== fila));
  };

  const grupos = pendientes.reduce((acc, p) => {
    (acc[p.archivo] = acc[p.archivo] || []).push(p);
    return acc;
  }, {});

  if (cargando) return <div className="dropzone-status">Cargando pendientes…</div>;
  if (error) return <div className="dropzone-status">{error}</div>;
  if (pendientes.length === 0) {
    return <div className="dropzone-status">No hay retenciones pendientes de revisar por ahora. 🎉</div>;
  }

  return (
    <div>
      <div className="sub-pantalla">{pendientes.length} página(s) pendiente(s) de revisar</div>
      {Object.entries(grupos).map(([archivo, items]) => (
        <div className="grupo-archivo" key={archivo}>
          <div className="grupo-header">
            <div className="grupo-nombre">{archivo}</div>
            <div className="grupo-count">{items.length} página(s)</div>
          </div>
          <div className="grid-tarjetas">
            {items.map((p) => (
              <TarjetaRevision key={p.fila} p={p} onResuelta={() => quitarDeLista(p.fila)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TarjetaRevision({ p, onResuelta }) {
  const [empresa, setEmpresa] = useState(p.empresa || "Agro");
  const [cliente, setCliente] = useState(p.cliente || "");
  const [tipoRetencion, setTipoRetencion] = useState(p.tipoRetencion || "");
  const [categoriaRetencion, setCategoriaRetencion] = useState(p.categoriaRetencion || "");
  const [importe, setImporte] = useState(p.importe || "");
  const [certificado, setCertificado] = useState(p.certificado || "");
  const [procesando, setProcesando] = useState(false);

  const dispararAccion = (accion, extra) => {
    return new Promise((resolve) => {
      const url = `${APPS_SCRIPT_URL}?accion=${accion}&clave=${encodeURIComponent(CLAVE)}${extra}&_=${Date.now()}`;
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
        resolve();
      }, 2500);
    });
  };

  const confirmar = async () => {
    setProcesando(true);
    const extra =
      `&fila=${p.fila}` +
      `&empresa=${encodeURIComponent(empresa)}` +
      `&cliente=${encodeURIComponent(cliente)}` +
      `&tipoRetencion=${encodeURIComponent(tipoRetencion)}` +
      `&categoriaRetencion=${encodeURIComponent(categoriaRetencion)}` +
      `&importe=${encodeURIComponent(importe)}` +
      `&certificado=${encodeURIComponent(certificado)}`;
    await dispararAccion("guardarRevision", extra);
    setProcesando(false);
    onResuelta();
  };

  const descartar = async () => {
    setProcesando(true);
    await dispararAccion("descartarFila", `&fila=${p.fila}`);
    setProcesando(false);
    onResuelta();
  };

  return (
    <div className="tarjeta">
      <div className="tarjeta-visor">
        <div className="tarjeta-visor-header">
          <span>Página {p.pagina}</span>
        </div>
        <div className="tarjeta-visor-contenido">
          {p.idPaginaPdf ? (
            <iframe
              src={`https://drive.google.com/file/d/${p.idPaginaPdf}/preview`}
              title={`Página ${p.pagina}`}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <div className="visor-placeholder">
              <div className="visor-placeholder-text">Sin vista previa disponible</div>
            </div>
          )}
        </div>
      </div>
      <div className="tarjeta-derecha">
        <div className="tarjeta-body">
          <div className="fila-2">
            <div className="campo">
              <label>Empresa</label>
              <select value={empresa} onChange={(e) => setEmpresa(e.target.value)}>
                <option>Agro</option>
                <option>Aibaires</option>
              </select>
            </div>
            <div className="campo">
              <label>Tipo retención</label>
              <input type="text" value={tipoRetencion} onChange={(e) => setTipoRetencion(e.target.value)} placeholder="—" />
            </div>
          </div>
          <div className="campo">
            <label>Cliente</label>
            <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="No detectado — completar a mano" />
          </div>
          <div className="fila-3">
            <div className="campo">
              <label>Categoría</label>
              <input type="text" value={categoriaRetencion} onChange={(e) => setCategoriaRetencion(e.target.value)} placeholder="—" />
            </div>
            <div className="campo">
              <label>Importe</label>
              <input type="text" value={importe} onChange={(e) => setImporte(e.target.value)} placeholder="—" />
            </div>
            <div className="campo">
              <label>N° certificado</label>
              <input type="text" value={certificado} onChange={(e) => setCertificado(e.target.value)} placeholder="—" />
            </div>
          </div>
        </div>
        <div className="tarjeta-footer">
          <button className="btn btn-descartar" onClick={descartar} disabled={procesando}>Descartar</button>
          <button className="btn btn-confirmar" onClick={confirmar} disabled={procesando}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
