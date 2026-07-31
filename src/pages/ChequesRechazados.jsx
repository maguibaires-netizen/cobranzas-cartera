import SheetEmbed from "../components/SheetEmbed.jsx";

// Reemplazá PEGAR_ID_ACA por el ID real del Sheet (mismo procedimiento de siempre).
const SHEET_ID = "PEGAR_ID_ACA";

export default function ChequesRechazados() {
  return (
    <SheetEmbed
      titulo="Cheques rechazados"
      descripcion="Registro de cheques rechazados por cliente, para seguimiento y gestión de cobranza."
      icono="Ch"
      sheetId={SHEET_ID}
    />
  );
}
