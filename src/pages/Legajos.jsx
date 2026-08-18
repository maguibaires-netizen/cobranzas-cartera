import { Link } from "react-router-dom";

export default function Legajos() {
  return (
    <>
      <Link className="back-link" to="/">← Volver al portal</Link>

      <div className="page-header">
        <div>
          <div className="page-title">Legajos de clientes con crédito</div>
          <div className="page-sub">A desarrollar.</div>
        </div>
        <div className="status-tag" style={{ background: "#EFEAEC", color: "var(--muted)" }}>A desarrollar</div>
      </div>

      <div className="placeholder-box">
        <div className="placeholder-title">Todavía no armamos esto 👀</div>
        <div className="placeholder-sub">
          Cuando esté listo lo vas a poder ver por aquí
        </div>
      </div>
    </>
  );
}
