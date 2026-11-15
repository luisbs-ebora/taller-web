// iguala.js — Práctica «Iguala la página» (CSS): dos páginas, cada una con su hoja de estilos bien hecha y varios
// fallos escondidos al azar. Se comparan los estilos calculados de la página del alumno con los del modelo.

const HTML_CAFETERIA = `<header>
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

const CSS_CAFETERIA = `body {
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
const FALLOS_CAFETERIA = [
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

// ---------- Segunda página: la biblioteca. Modelo de caja, herencia y orden de las reglas. ----------
const HTML_BIBLIOTECA = `<div id="pagina">
  <header>
    <h1>Biblioteca del instituto</h1>
    <p class="lema">Leer es viajar sin moverse</p>
  </header>
  <ul class="menu">
    <li><a href="novedades.html">Novedades</a></li>
    <li><a href="normas.html">Normas</a></li>
    <li><a href="contacto.html">Contacto</a></li>
  </ul>
  <main>
    <h2>Novedades de noviembre</h2>
    <div class="libro">
      <h3>La isla del tesoro</h3>
      <p>Aventuras y piratas. <span class="nuevo">Nuevo</span></p>
    </div>
    <div class="libro prestado">
      <h3>Momo</h3>
      <p>Una niña contra los ladrones de tiempo.</p>
    </div>
    <p id="aviso">El préstamo dura 15 días.</p>
  </main>
</div>`;

const LIBRO = `.libro {
  border: 2px solid #2e7d32;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 14px;
}
`, LIBRO_H3 = `.libro h3 {
  margin: 0 0 6px;
}
`, PRESTADO = `.prestado {
  border-color: #999999;
  color: #777777;
}
`;
const CSS_BIBLIOTECA = `body {
  font-family: Verdana, sans-serif;
  color: #222222;
  background-color: #f2f2f2;
  margin: 0;
}
#pagina {
  width: 420px;
  margin: 0 auto;
  background-color: white;
  padding: 16px;
}
header {
  border-bottom: 4px solid #2e7d32;
  padding-bottom: 8px;
}
h1 {
  font-size: 26px;
  margin: 0;
}
.lema {
  font-style: italic;
  margin: 4px 0 0;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}
.menu li {
  display: inline-block;
  margin-right: 16px;
}
.menu a {
  color: #2e7d32;
  text-decoration: none;
  font-weight: bold;
}
h2 {
  font-size: 20px;
  color: #2e7d32;
}
${LIBRO}${LIBRO_H3}${PRESTADO}.nuevo {
  background-color: #ffd54f;
  padding: 2px 6px;
  border-radius: 4px;
}
#aviso {
  text-align: center;
  font-size: 14px;
}`;

const FALLOS_BIBLIOTECA = [
  { grupo: 'body', bien: 'body {', mal: 'boby {', nota: 'Toda la página ha cambiado de letra y ha perdido el fondo gris.', pista: 'Lo que se pone en body lo heredan casi todas las etiquetas de la página. Mira cómo está escrito ese selector.', mira: [['body', 'fontFamily'], ['body', 'backgroundColor']] },
  { grupo: 'pagina', bien: '#pagina {', mal: '# pagina {', nota: 'La columna central no tiene fondo blanco y ocupa todo el ancho.', pista: 'Entre la almohadilla y el nombre del id no puede haber un espacio.', mira: [['#pagina', 'backgroundColor'], ['#pagina', 'paddingTop']] },
  { grupo: 'menu-margen', bien: 'margin: 12px 0;', mal: 'margin: 12px, 0;', nota: 'El menú está más separado de la cabecera que en el modelo.', pista: 'En una propiedad abreviada, los valores se separan con espacios, no con comas.', mira: [['.menu', 'marginTop']] },
  { grupo: 'menu-linea', bien: 'display: inline-block;', mal: 'display: inline block;', nota: 'Los enlaces del menú salen uno debajo de otro.', pista: 'El valor es una sola palabra, con guion: inline-block.', mira: [['.menu li', 'display']] },
  { grupo: 'menu-puntos', bien: 'list-style: none;', mal: 'list-style: no;', nota: 'El menú tiene los puntos de una lista.', pista: 'El valor que quita las viñetas de una lista es none.', mira: [['.menu', 'listStyleType']] },
  { grupo: 'enlaces', bien: 'text-decoration: none;', mal: 'text-decoration: off;', nota: 'Los enlaces del menú salen subrayados.', pista: 'El subrayado se quita con el valor none: «off» no existe en CSS.', mira: [['.menu a', 'textDecorationLine']] },
  { grupo: 'libros', bien: '.prestado {', mal: '.prestado p {', nota: 'En el libro prestado, el título no sale gris y el borde sigue verde.', pista: 'El color del texto se hereda de la caja a todo lo que tiene dentro; el borde, no. Los dos se ponen en la caja (.prestado), no en su párrafo.', mira: [['.prestado', 'borderTopColor'], ['.prestado h3', 'color']] },
  { grupo: 'libros', bien: LIBRO + LIBRO_H3 + PRESTADO, mal: PRESTADO + LIBRO + LIBRO_H3, nota: 'El libro prestado tiene el borde verde, como el otro.', pista: 'Cuando dos reglas con la misma fuerza dan la misma propiedad, gana la que está escrita más abajo. La de .prestado tiene que ir después de la de .libro.', mira: [['.prestado', 'borderTopColor']] },
  { grupo: 'nuevo', bien: 'padding: 2px 6px;', mal: 'padding: 2px6px;', nota: 'En la etiqueta «Nuevo», el fondo amarillo está pegado a las letras.', pista: 'Entre los dos valores del relleno hace falta un espacio.', mira: [['.nuevo', 'paddingLeft']] },
  { grupo: 'lema', bien: '.lema {', mal: '.Lema {', nota: 'El lema de la cabecera no sale en cursiva.', pista: 'Los nombres de las clases distinguen mayúsculas de minúsculas: en el HTML pone class="lema".', mira: [['.lema', 'fontStyle']] },
  { grupo: 'h2', bien: 'font-size: 20px;\n  color: #2e7d32;', mal: 'font-size: 20px;\n  color: 2e7d32;', nota: '«Novedades de noviembre» no sale en verde.', pista: 'A un color hexadecimal le hace falta la almohadilla delante.', mira: [['h2', 'color']] },
];

export const PAGINAS = [
  { id: 'cafeteria', nombre: 'Una cafetería (selectores y sintaxis)', titulo: 'Cafetería La Plaza', html: HTML_CAFETERIA, css: CSS_CAFETERIA, fallos: FALLOS_CAFETERIA },
  { id: 'biblioteca', nombre: 'Una biblioteca (cajas, herencia y orden)', titulo: 'Biblioteca del instituto', html: HTML_BIBLIOTECA, css: CSS_BIBLIOTECA, fallos: FALLOS_BIBLIOTECA },
];

export const documento = (pagina, css) => `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${pagina.titulo}</title><style>${css}</style></head><body>${pagina.html}</body></html>`;

export function crearEjercicio(paginaId, n = 5, azar = Math.random) {
  const pagina = PAGINAS.find(p => p.id === paginaId) || PAGINAS[Math.floor(azar() * PAGINAS.length)];
  const resto = [...pagina.fallos], fallos = [];
  while (fallos.length < n && resto.length) {
    const f = resto.splice(Math.floor(azar() * resto.length), 1)[0];
    if (!fallos.some(x => x.grupo === f.grupo)) fallos.push(f);
  }
  let css = pagina.css;
  for (const f of fallos) css = css.replace(f.bien, f.mal);
  return { pagina, css, fallos };
}

/** Compara los estilos calculados del documento del alumno con los del modelo. */
export function comparar(fallos, docModelo, docAlumno) {
  const valor = (doc, sel, prop) => { const e = doc.querySelector(sel); return e ? doc.defaultView.getComputedStyle(e)[prop] : null; };
  return fallos.map(f => f.mira.every(([sel, prop]) => valor(docModelo, sel, prop) === valor(docAlumno, sel, prop)));
}
