import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-headline">Las <em>superpoderosas</em><br />de Baires.</div>
        <div className="hero-sub">Reportes, planillas y legajos, todo desde un solo lugar.</div>
        <div className="stamp">
          <div className="stamp-text">
            <div className="stamp-word">APROBADO</div>
            <div className="stamp-caption">COBRAS</div>
          </div>
        </div>
      </div>

      <div className="tools-title">Herramientas</div>
      <div className="tools-sub">Tocá una tarjeta para abrir esa herramienta</div>

      <div className="tools-grid">
        <Link className="tool-card featured" to="/cartera-clientes">
          <div className="featured-left">
            <div className="tool-icon">$</div>
            <div className="tool-name">Reporte semanal · Cartera de clientes</div>
            <div className="tool-desc">Vencimientos y antigüedad de deuda, por vendedor.</div>
            <div className="tool-status live">Activo</div>
          </div>
          <div className="featured-cta">Abrir reporte →</div>
        </Link>

        <Link className="tool-card sheets" to="/pedidos-pendientes">
          <div className="tool-icon">P</div>
          <div className="tool-name">Pedidos pendientes</div>
          <div className="tool-desc">Planilla de seguimiento + reporte diario por facturación, motivo, vendedor y cliente.</div>
          <div className="tool-status sheets">Google Sheets</div>
        </Link>

        <Link className="tool-card soon" to="/legajos">
          <div className="tool-icon">L</div>
          <div className="tool-name">Legajos de clientes con crédito</div>
          <div className="tool-desc">Informes de credito + documentación.</div>
          <div className="tool-status soon">A desarrollar</div>
        </Link>

        <Link className="tool-card sheets" to="/cheques-rechazados">
          <div className="tool-icon">Ch</div>
          <div className="tool-name">Cheques rechazados</div>
          <div className="tool-desc">Registro de cheques rechazados por cliente.</div>
          <div className="tool-status sheets">Google Sheets</div>
        </Link>

        <Link className="tool-card sheets" to="/pendientes-conciliar">
          <div className="tool-icon">CC</div>
          <div className="tool-name">Pendientes de conciliar</div>
          <div className="tool-desc">Composicion del saldo cuenta contable: pendientes de conciliar.</div>
          <div className="tool-status sheets">Google Sheets</div>
        </Link>
      </div>

      <div className="legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: "var(--green)" }}></span> Activo — app propia</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "var(--lav-bg)", border: "1px solid var(--lav-ink)" }}></span> Enlace a Google Sheets</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#E7E1E5" }}></span> A desarrollar</div>
      </div>
    </>
  );
}
