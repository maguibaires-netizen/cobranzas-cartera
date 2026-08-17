import { useState } from "react";
import { Link } from "react-router-dom";
import { RotateCw } from "lucide-react";

const SHEET_ID = "1Q9OrTEFssifLk2OzsAvT7fbjfASAAqbB-5JapXCc3Fc";
const REPORTE_URL = "https://script.google.com/macros/s/AKfycbwJPJvDOEFwMyZgFc7SP7R9vrT2UggHAUnF_QFOQ0YQc45NqYZFcW9w58lyvYtaHqpr5A/exec";
const CLAVE_ACTUALIZAR = "cobras-2026-actualizar";

export default function PedidosPendientes() {
  const [tab, setTab] = useState("planilla");
  const [actualizando, setActualizando] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [mensaje, setMensaje] = useState("");

  const sheetSrc = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing&rm=minimal&widget=true`;
  const openUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

  const handleActualizar = async () => {
    const confirmado = window.confirm(
      "¿Segura que querés actualizar? Esto borra los motivos ya cargados."
    );
    if (!confirmado) return;

    setActualizando(true);
    setMensaje("");
    try {
      const res = await fetch(
        `${REPORTE_URL}?accion=actualizar&clave=${encodeURIComponent(CLAVE_ACTUALIZAR)}`,
        { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" } }
      );
      const data = await res.json();
      if (data.ok) {
        setMensaje("✅ Tabla actualizada");
        setReloadKey((k) => k + 1); // fuerza recarga del iframe de la planilla
      } else {
        setMensaje("❌ " + (data.error || "No se pudo actualizar"));
      }
    } catch (err) {
      setMensaje("❌ No se pudo conectar con el script");
    } finally {
      setActualizando(false);
      setTimeout(() => setMensaje(""), 5000);
    }
  };

  return (
    <>
      <Link className="back-link" to="/">← Volver al portal</Link>

      <div className="page-header">
        <div className="page-title">Pedidos pendientes</div>
        <div className="status-tag"><span className="status-dot"></span> Google Sheets · edición en vivo</div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === "planilla" ? "active" : ""}`} onClick={() => setTab("planilla")}>
          Planilla
        </button>
        <button className={`tab-btn ${tab === "reporte" ? "active" : ""}`} onClick={() => setTab("reporte")}>
          Reporte
        </button>
      </div>

      <div className="frame-card">
        <div className="frame-card-header">
          <div className="frame-card-header-left">
            <div className="frame-icon">P</div>
            <div className="frame-card-header-title">
              {tab === "planilla" ? "Planilla compartida del equipo" : "Reporte diario de pedidos sin aprobar"}
            </div>
            {mensaje && <span style={{ fontSize: 12, color: "var(--muted)" }}>{mensaje}</span>}
          </div>
          {tab === "planilla" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleActualizar}
                disabled={actualizando}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600, color: "#fff",
                  background: "var(--pink)", border: "none", borderRadius: 8,
                  padding: "6px 12px", cursor: actualizando ? "default" : "pointer",
                  opacity: actualizando ? 0.7 : 1,
                }}
              >
                <RotateCw size={13} className={actualizando ? "spin" : ""} />
                {actualizando ? "Actualizando…" : "Actualizar"}
              </button>
              <a className="frame-open-link" href={openUrl} target="_blank" rel="noreferrer">Abrir en Google Sheets ↗</a>
            </div>
          )}
        </div>

        <div className="embed-frame-wrapper">
          {tab === "planilla" ? (
            <iframe key={reloadKey} className="embed-frame" src={sheetSrc} title="Pedidos pendientes"></iframe>
          ) : (
            <iframe className="embed-frame" src={REPORTE_URL} title="Reporte de pedidos pendientes"></iframe>
          )}
        </div>
      </div>
    </>
  );
}
