import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, X } from "lucide-react";

const SHEET_ID = "1JlqWyWlRz8BwQhd7E_89GYN6DXGsDvBsbGtw6Mf9M-c";
const BUSCADOR_URL = "https://script.google.com/macros/s/AKfycby4VzmWdIc4lp_dXvNiHox0XApaL6Ifqt6BQmo9HMwH_IkD3v_OCWhCIOcIhyv9Mw-a/exec";
const CLAVE = "cobras-2026-retenciones";
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdscjGvGizDxRkMqDM6wR8OSGBd1V-zmbNPdfMsueUf_Bs57g/viewform?embedded=true";

export default function CargaRetenciones() {
  const [texto, setTexto] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [updateSrc, setUpdateSrc] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const sheetSrc = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing&rm=minimal&widget=true`;
  const openUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

  const disparar = (accion, extra) => {
    setBuscando(true);
    setMensaje(accion === "filtrar" ? "Filtrando…" : "Quitando filtro…");

    const url = `${BUSCADOR_URL}?accion=${accion}&clave=${encodeURIComponent(CLAVE)}${extra || ""}&_=${Date.now()}`;
    setUpdateSrc(url);

    setTimeout(() => {
      setUpdateSrc(null);
      setReloadKey((k) => k + 1);
      setMensaje(accion === "filtrar" ? "✅ Filtro aplicado" : "✅ Filtro quitado");
      setBuscando(false);
      setTimeout(() => setMensaje(""), 4000);
    }, 3000);
  };

  const handleFiltrar = () => {
    if (!texto.trim()) return;
    disparar("filtrar", `&texto=${encodeURIComponent(texto.trim())}`);
  };

  const handleQuitar = () => {
    setTexto("");
    disparar("quitarFiltro");
  };

  return (
    <>
      <Link className="back-link" to="/">← Volver al portal</Link>

      <div className="page-header">
        <div className="page-title">Carga de retenciones</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="upload-btn" onClick={() => setMostrarForm((v) => !v)}>
            <Upload size={13} />
            {mostrarForm ? "Ocultar" : "Subir PDF"}
          </button>
          <div className="status-tag"><span className="status-dot"></span> Google Sheets · edición en vivo</div>
        </div>
      </div>

      {mostrarForm && (
        <div className="upload-panel">
          <div className="upload-panel-header">
            <div className="upload-panel-title">Subir archivo de retención</div>
            <button className="upload-panel-close" onClick={() => setMostrarForm(false)}>
              <X size={14} />
            </button>
          </div>
          <iframe src={FORM_URL} title="Subir PDF de retención">Cargando…</iframe>
        </div>
      )}

      <div className="embed-with-sidebar">
        <div className="frame-card">
          <div className="frame-card-header">
            <div className="frame-card-header-left">
              <div className="frame-icon">Rt</div>
              <div className="frame-card-header-title">Planilla compartida del equipo</div>
            </div>
            <a className="frame-open-link" href={openUrl} target="_blank" rel="noreferrer">Abrir en Google Sheets ↗</a>
          </div>
          <div className="embed-frame-wrapper">
            <iframe key={reloadKey} className="embed-frame-full" src={sheetSrc} title="Carga de retenciones"></iframe>
          </div>
        </div>

        <div className="search-sidebar">
          <div className="search-sidebar-title">Buscar cliente</div>
          <input
            className="search-input"
            type="text"
            placeholder="Nombre del cliente…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFiltrar()}
          />
          <button className="search-btn primary" onClick={handleFiltrar} disabled={buscando}>
            Filtrar
          </button>
          <button className="search-btn secondary" onClick={handleQuitar} disabled={buscando}>
            Quitar filtro
          </button>
          {mensaje && <div className="search-status">{mensaje}</div>}
        </div>
      </div>

      {updateSrc && (
        <iframe src={updateSrc} title="buscador-retenciones" style={{ display: "none" }}></iframe>
      )}
    </>
  );
}
