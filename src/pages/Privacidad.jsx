import { Link } from "react-router-dom";

export default function Privacidad() {
  return (
    <div style={{ maxWidth: 640 }}>
      <Link className="back-link" to="/">← Volver al portal</Link>
      <div className="page-title" style={{ marginBottom: 20 }}>Política de Privacidad</div>

      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink)" }}>
        <p>
          Este portal ("cobranzas-cartera.vercel.app") es una herramienta de uso <strong>interno</strong>,
          desarrollada para el equipo de Créditos y Cobranzas. No es un producto público ni está
          destinado al público general.
        </p>

        <p><strong>Qué datos accedemos y para qué</strong></p>
        <p>
          El módulo "Carga de retenciones" pide permiso para conectar tu cuenta de Google, usando
          únicamente el permiso <code>drive.file</code> de Google Drive. Este permiso es limitado:
          solo permite crear y acceder a los archivos que esta misma app sube a través tuyo — nunca
          da acceso al resto de tu Google Drive personal, tus correos, ni ningún otro dato de tu cuenta.
        </p>
        <p>
          Los archivos que subís (PDFs o imágenes de retenciones) se guardan en una carpeta de Drive
          compartida del equipo, y se procesan automáticamente para extraer el texto y clasificar
          la información contable correspondiente.
        </p>

        <p><strong>Con quién compartimos datos</strong></p>
        <p>No compartimos ningún dato con terceros. Todo queda dentro de las herramientas internas del equipo (Google Sheets, Google Drive, y sistemas internos de la empresa).</p>

        <p><strong>Cómo revocar el acceso</strong></p>
        <p>
          Podés desconectar el acceso de esta app a tu cuenta de Google en cualquier momento desde{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
            myaccount.google.com/permissions
          </a>.
        </p>

        <p><strong>Consultas</strong></p>
        <p>Ante cualquier duda, contactar al equipo de Créditos y Cobranzas.</p>
      </div>
    </div>
  );
}
