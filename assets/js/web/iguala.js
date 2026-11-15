// iguala.js — Práctica «Iguala la página» (CSS): una página con su hoja de estilos bien hecha y varios fallos
// escondidos al azar. Se comparan los estilos calculados de la página del alumno con los del modelo.

export const HTML = `<header>
  <h1>Cafetería La Plaza</h1>
  <nav>
    <a href="carta.html">Carta</a>
    <a href="horario.html">Horario</a>
  </nav>
</header>
<main>
  <h2>Desayunos</h2>
  <p class="destacado">Hoy: tostada con tomate y café por 2,50 €.</p>
  <div class="tarjeta">
    <h3>Tostada</h3>
    <p>Pan de pueblo con aceite de oliva.</p>
  </div>
  <div class="tarjeta">
    <h3>Café</h3>
    <p>Solo, cortado o con leche.</p>
  </div>
</main>
<footer id="pie">
  <p>Plaza Mayor, 3 · Abrimos a las 7:00</p>
</footer>`;

export const CSS_BIEN = `body {
  font-family: Arial, sans-serif;
  color: #333333;
  margin: 0;
}
header {
  background-color: #1f4f9c;
  color: white;
  padding: 16px;
}
h1 {
  font-size: 28px;
  margin: 0;
}
nav a {
  color: white;
  margin-right: 12px;
}
main {
  padding: 16px;
}
h2 {
  color: #1f4f9c;
  border-bottom: 2px solid #1f4f9c;
}
.destacado {
  background-color: #fbeccd;
  padding: 8px;
  font-weight: bold;
}
.tarjeta {
  border: 1px solid #999999;
  padding: 12px;
  margin-bottom: 12px;
  width: 260px;
}
#pie {
  background-color: #eeeeee;
  text-align: center;
  padding: 8px;
}`;

// Cada fallo: grupo (no se mezclan dos del mismo grupo), texto bueno → texto con el fallo, qué se nota,
// pista, y qué estilos calculados lo delatan: [selector, propiedad].
export const FALLOS = [
  { grupo: 'destacado', bien: '.destacado {', mal: 'destacado {', nota: 'El aviso del desayuno de hoy no tiene fondo ni negrita.', pista: 'Para dar estilo a una clase, el selector empieza por un punto.', mira: [['.destacado', 'backgroundColor'], ['.destacado', 'fontWeight']] },
  { grupo: 'pie', bien: '#pie {', mal: '.pie {', nota: 'El pie de página no tiene fondo gris ni está centrado.', pista: 'El pie tiene id="pie", no class="pie". Los id se seleccionan con almohadilla (#).', mira: [['#pie', 'backgroundColor'], ['#pie', 'textAlign']] },
  { grupo: 'tarjeta-relleno', bien: '  padding: 12px;\n  margin-', mal: '  padding: 12;\n  margin-', nota: 'El texto de las tarjetas está pegado al borde.', pista: 'Una medida necesita su unidad: 12 no es lo mismo que 12px.', mira: [['.tarjeta', 'paddingTop']] },
  { grupo: 'cabecera', bien: '  color: white;\n  padding: 16px;', mal: '  colour: white;\n  padding: 16px;', nota: 'El título de la cabecera no se lee: sale oscuro sobre azul.', pista: 'Los nombres de las propiedades van en inglés de Estados Unidos: revisa cómo está escrito «color» en header.', mira: [['header h1', 'color']] },
  { grupo: 'cabecera', bien: '  background-color: #1f4f9c;\n  color: white;', mal: '  background-color: #1f4f9c\n  color: white;', nota: 'La cabecera ha perdido el fondo azul.', pista: 'Cada declaración termina en punto y coma. Si falta uno, el navegador se lía con la línea siguiente.', mira: [['header', 'backgroundColor'], ['header h1', 'color']] },
  { grupo: 'tarjeta-borde', bien: 'border: 1px solid #999999;', mal: 'border: 1px #999999;', nota: 'Las tarjetas no tienen borde.', pista: 'Un borde necesita tres cosas: grosor, estilo (solid, dashed…) y color. Sin estilo, no se dibuja.', mira: [['.tarjeta', 'borderTopStyle']] },
  { grupo: 'tarjeta-margen', bien: 'margin-bottom: 12px;', mal: 'margin-botom: 12px;', nota: 'Las dos tarjetas están pegadas una a otra.', pista: 'Hay una propiedad mal escrita en .tarjeta: el navegador la ignora sin avisar.', mira: [['.tarjeta', 'marginBottom']] },
  { grupo: 'titulo', bien: 'font-size: 28px;', mal: 'font-size: 28 px;', nota: 'El título de la cabecera no tiene el tamaño del modelo.', pista: 'Entre el número y la unidad no puede haber espacio.', mira: [['h1', 'fontSize']] },
  { grupo: 'h2', bien: '  color: #1f4f9c;\n  border-bottom', mal: '  color: #1f4f9;\n  border-bottom', nota: '«Desayunos» no sale en azul.', pista: 'Un color hexadecimal tiene 3 o 6 cifras después de la almohadilla.', mira: [['h2', 'color']] },
  { grupo: 'enlaces', bien: 'nav a {', mal: 'nav.a {', nota: 'Los enlaces del menú no son blancos ni están separados.', pista: '«nav a» (con espacio) son los enlaces que están dentro de nav. Con un punto en medio significa otra cosa.', mira: [['nav a', 'color'], ['nav a', 'marginRight']] },
];

export const documento = css => `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Cafetería La Plaza</title><style>${css}</style></head><body>${HTML}</body></html>`;

export function crearEjercicio(n = 5, azar = Math.random) {
  const resto = [...FALLOS], fallos = [];
  while (fallos.length < n && resto.length) {
    const f = resto.splice(Math.floor(azar() * resto.length), 1)[0];
    if (!fallos.some(x => x.grupo === f.grupo)) fallos.push(f);
  }
  let css = CSS_BIEN;
  for (const f of fallos) css = css.replace(f.bien, f.mal);
  return { css, fallos };
}

/** Compara los estilos calculados del documento del alumno con los del modelo. */
export function comparar(fallos, docModelo, docAlumno) {
  const valor = (doc, sel, prop) => { const e = doc.querySelector(sel); return e ? doc.defaultView.getComputedStyle(e)[prop] : null; };
  return fallos.map(f => f.mira.every(([sel, prop]) => valor(docModelo, sel, prop) === valor(docAlumno, sel, prop)));
}
