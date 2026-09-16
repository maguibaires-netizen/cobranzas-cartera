import { Link } from "react-router-dom";

export default function Terminos() {
  return (
    <div style={{ maxWidth: 640 }}>
      <Link className="back-link" to="/">← Volver al portal</Link>
      <div className="page-title" style={{ marginBottom: 20 }}>Condiciones del Servicio</div>

      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink)" }}>
        <p>
          Este portal ("cobranzas-cartera.vercel.app") es una herramienta interna de trabajo,
          desarrollada y mantenida para el equipo de Créditos y Cobranzas. Su uso está reservado
          exclusivamente a integrantes del equipo.
        </p>

        <p><strong>Uso previsto</strong></p>
        <p>
          Esta app centraliza reportes, planillas y la carga de documentación (como certificados
          de retención) que el equipo ya maneja en su trabajo diario. No está pensada para
          almacenar información fuera de ese uso.
        </p>

        <p><strong>Disponibilidad</strong></p>
        <p>
          Al ser una herramienta interna en desarrollo continuo, puede sufrir interrupciones o
          cambios sin aviso previo.
        </p>

        <p><strong>Consultas</strong></p>
        <p>Ante cualquier duda sobre el uso de esta herramienta, contactar al equipo de Créditos y Cobranzas.</p>
      </div>
    </div>
  );
}
