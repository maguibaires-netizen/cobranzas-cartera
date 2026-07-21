# Cobranzas — Cartera de clientes

App web para el sector de cobranzas: cartera de clientes por vendedor, antigüedad de deuda y proyección de vencimientos. Pensada como la primera pieza de un portal más amplio.

## Estructura

```
cobranzas-cartera/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx      ← punto de entrada, no hace falta tocarlo
    └── App.jsx        ← el reporte en sí (acá vas a hacer los cambios)
```

## 1) Probarlo en tu máquina (opcional, pero recomendado)

Necesitás [Node.js](https://nodejs.org) instalado (versión 18 o más nueva).

```bash
npm install
npm run dev
```

Te va a abrir algo como `http://localhost:5173` con la app corriendo.

## 2) Subirlo a GitHub

Vercel despliega directo desde un repositorio de GitHub, así que primero subimos el código ahí.

**Sin usar la terminal (más simple):**
1. Entrá a [github.com](https://github.com) → **New repository** → nombre `cobranzas-cartera` → **Create repository**.
2. En la página del repo vacío, click en **uploading an existing file** y arrastrá toda la carpeta (o los archivos uno por uno, incluyendo `.gitignore`).
3. **Commit changes**.

**Con terminal (si ya usás git):**
```bash
cd cobranzas-cartera
git init
git add .
git commit -m "Primera versión: cartera de clientes"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/cobranzas-cartera.git
git push -u origin main
```

## 3) Desplegar en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **Add New... → Project**.
2. Elegí el repo `cobranzas-cartera` que subiste.
3. Vercel detecta automáticamente que es un proyecto Vite — no hace falta tocar nada de configuración.
4. **Deploy**.
5. En un par de minutos te da una URL tipo `cobranzas-cartera.vercel.app` — ese es tu **link permanente**, ya lo podés compartir con todo el equipo.

## 4) Actualizarlo más adelante

Cada vez que quieras hacer un cambio (agregar un reporte, ajustar un color, corregir algo):
1. Editás el archivo correspondiente (por ejemplo `src/App.jsx`).
2. Subís el cambio a GitHub (`git push`, o volviendo a subir el archivo desde la web de GitHub).
3. Vercel redetecta el cambio y **redeploya solo**, en 1-2 minutos. No hay que hacer nada más.

## Próximos pasos posibles

Esta es la primera pantalla del portal. Cuando quieras sumar más reportes (por ejemplo, otro tipo de informe de cobranzas), lo natural es:
- Agregar un menú de navegación simple (podemos usar `react-router-dom`).
- Cada reporte nuevo como un componente separado en `src/`.

Avisame cuando quieras dar ese paso y lo armamos juntas.
