import SheetEmbed from "../components/SheetEmbed.jsx";

// Reemplazá PEGAR_ID_ACA por el ID real del Sheet (mismo procedimiento de siempre).
const SHEET_ID = "PEGAR_ID_ACA";

export default function PendientesConciliar() {
  return (
    <SheetEmbed
      titulo="Pendientes de conciliar"
      descripcion="Cuentas con pagos o notas de crédito sin aplicar todavía contra la factura correspondiente."
      icono="Co"
      sheetId={SHEET_ID}
    />
  );
}
