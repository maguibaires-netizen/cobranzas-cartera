import SheetEmbed from "../components/SheetEmbed.jsx";

const SHEET_ID = "1JlqWyWlRz8BwQhd7E_89GYN6DXGsDvBsbGtw6Mf9M-c";

export default function CargaRetenciones() {
  return (
    <SheetEmbed
      titulo="Carga de retenciones"
      icono="Rt"
      sheetId={SHEET_ID}
      sinAchicar
    />
  );
}
