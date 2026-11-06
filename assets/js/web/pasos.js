// pasos.js — Guion de la clase animada «Un sitio que crece» (Tema 2 de Aplicaciones web).
// Cada paso: { sesion, nombre, texto, hacer(ctx), mal?(ctx), tituloMal, textoMal }.
// hacer() tiene que funcionar también en modo instantáneo (ctx.rapido): ahí no hay ratón ni bocadillos.

export const SESIONES = [
  'Sesión 1 · La estructura de una página',
  'Sesión 2 · Etiquetas básicas',
  'Sesión 3 · Formularios, multimedia y HTML5',
  'Sesión 4 · Herramientas, validación y accesibilidad',
];

const esq = (title, { lang = 'es', charset = true } = {}) =>
`<!DOCTYPE html>
<html lang="${lang}">
<head>
${charset ? '  <meta charset="UTF-8">\n' : ''}  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
</body>
</html>`;

const COMENTARIO = '  <!-- Mi primera página web -->\n';
const INICIO_CUERPO = `${COMENTARIO}  <h1>Lucía Martín</h1>
  <p>Estudio 1.º de SMR en el instituto.</p>
`;

const CABECERA = `  <header>
    <p><img src="img/logo.png" alt="" width="40"> Mi sitio web</p>
  </header>
  <nav>
    <a href="index.html">Inicio</a> |
    <a href="ficha.html">Mi ficha</a> |
    <a href="horario.html">Mi horario</a> |
    <a href="inscripcion.html">Inscripción</a>
  </nav>
`;
const PIE = `  <footer>
    <p>2026 · lucia@ejemplo.es</p>
  </footer>
`;
const sangrar = s => s.split('\n').map(l => l ? '  ' + l : l).join('\n');

const FICHA_BASE = `  <h1>Lucía Martín</h1>
  <h2>Aficiones</h2>
  <h2>Mi rutina de mañana</h2>
  <p>Lo que más me gusta del ciclo es <strong>el taller de montaje</strong>.</p>
`;
const AFICIONES = `  <ul>
    <li>Jugar al baloncesto</li>
    <li>Dibujar</li>
    <li>Montar ordenadores</li>
  </ul>
`;
const RUTINA = (t = 'ol') => `  <${t}>
    <li>Sonar el despertador</li>
    <li>Ducharme</li>
    <li>Vestirme</li>
    <li>Desayunar</li>
    <li>Coger el autobús</li>
  </${t}>
`;
const IMAGEN = '  <img src="img/yo.png" alt="Lucía montando un ordenador en el taller" width="300">\n';
const ENLACES = `  <h2>Enlaces</h2>
  <p>
    <a href="https://www.instituto-ejemplo.es" target="_blank">Web de mi instituto</a><br>
    <a href="index.html">Volver al inicio</a><br>
    <a href="mailto:lucia@ejemplo.es">Escríbeme un correo</a>
  </p>
`;
const ENLACES_MAL = `  <h2>Enlaces</h2>
  <p>
    Para ir a la web de mi instituto, <a href="https://www.instituto-ejemplo.es" target="_blank">pincha aquí</a>.<br>
    Para volver al inicio, <a href="index.html">pincha aquí</a>.<br>
    Para escribirme, <a href="mailto:lucia@ejemplo.es">pincha aquí</a>.
  </p>
`;
const VIDEO = (controls = true) => `  <h2>Un vídeo del taller</h2>
  <video src="video/montaje.mp4" width="480"${controls ? ' controls' : ''}>
    Tu navegador no puede reproducir este vídeo.
  </video>
  <iframe width="320" height="180" src="https://www.youtube.com/embed/ID-DEL-VIDEO" title="Vídeo de YouTube sobre montaje de ordenadores"></iframe>
`;

const TABLA = (filas = true) => {
  const tr = (sangria, celdas) => filas
    ? `${sangria}<tr>\n${celdas.map(c => `${sangria}  ${c}`).join('\n')}\n${sangria}</tr>`
    : celdas.map(c => `${sangria}${c}`).join('\n');
  return `  <h1>Mi horario</h1>
  <table border="1">
    <caption>Horario del lunes y del martes</caption>
${tr('    ', ['<th>Hora</th>', '<th>Lunes</th>', '<th>Martes</th>'])}
${tr('    ', ['<td>8:15</td>', '<td rowspan="2">Aplicaciones web</td>', '<td>Redes locales</td>'])}
${tr('    ', ['<td>9:10</td>', '<td>Sistemas operativos</td>'])}
${tr('    ', ['<td>10:05</td>', '<td>Montaje y mantenimiento</td>', '<td>Aplicaciones web</td>'])}
  </table>
`;
};

const FORM = (idNombre = 'nombre') => `  <h1>Inscripción al torneo del instituto</h1>
  <form action="/enviar" method="post">
    <p>
      <label for="nombre">Nombre:</label>
      <input type="text" id="${idNombre}" name="nombre" required>
    </p>
    <p>
      <label for="correo">Correo:</label>
      <input type="email" id="correo" name="correo" required>
    </p>
    <p>
      <label for="nacimiento">Fecha de nacimiento:</label>
      <input type="date" id="nacimiento" name="nacimiento">
    </p>
    <p>
      <label for="curso">Curso:</label>
      <select id="curso" name="curso">
        <option>1.º SMR</option>
        <option>2.º SMR</option>
        <option>1.º ASIR</option>
        <option>2.º ASIR</option>
      </select>
    </p>
  </form>
`;
const FORM_MAS = (mismoName = true) => `    <p>Turno:
      <input type="radio" id="manana" name="${mismoName ? 'turno' : 'turno-manana'}" value="manana"> <label for="manana">Mañana</label>
      <input type="radio" id="tarde" name="${mismoName ? 'turno' : 'turno-tarde'}" value="tarde"> <label for="tarde">Tarde</label>
    </p>
    <p>
      <input type="checkbox" id="normas" name="normas" required>
      <label for="normas">Acepto las normas</label>
    </p>
    <p>
      <label for="comentarios">Comentarios:</label><br>
      <textarea id="comentarios" name="comentarios"></textarea>
    </p>
    <button type="submit">Enviar</button>
`;

// Cuerpo de una página (lo que hay entre <body> y </body>)
function cuerpo(codigo) {
  const a = codigo.indexOf('<body>\n') + 7, b = codigo.lastIndexOf('</body>');
  return codigo.slice(a, b);
}

// ---------- El validador «de mentira» (usa validador.js) ----------
const escH = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function paginaValidador(codigo, resultados) {
  const lineas = codigo.split('\n').map((l, i) => `<span style="color:#999;display:inline-block;width:26px;text-align:right;margin-right:8px">${i + 1}</span>${escH(l)}`).join('\n');
  let res = '';
  if (resultados) {
    const errores = resultados.filter(r => r.tipo === 'error');
    res = !resultados.length
      ? `<p id="ok" style="background:#dff3e4;border:2px solid #3fbf6a;padding:10px 12px;border-radius:6px"><b>Document checking completed. No errors or warnings to show.</b><br>Comprobación terminada: ni errores ni avisos.</p>`
      : `<p style="margin:10px 0 6px"><b>${errores.length} error${errores.length === 1 ? '' : 'es'}</b> y ${resultados.length - errores.length} aviso${resultados.length - errores.length === 1 ? '' : 's'}</p><ol style="margin:0;padding-left:20px">${resultados.map(r =>
        `<li class="${r.tipo}" style="margin:0 0 8px;padding:6px 8px;border-radius:5px;background:${r.tipo === 'error' ? '#fde3e1' : '#fff4d1'}"><b style="color:${r.tipo === 'error' ? '#c22b31' : '#8a6100'}">${r.tipo === 'error' ? 'Error' : 'Aviso (Warning)'}:</b> ${escH(r.msg)}<br><small>Línea ${r.linea} · ${escH(r.explica || '')}</small></li>`).join('')}</ol>`;
  }
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Validador del W3C</title></head>
  <body style="margin:0;font:14px Arial;color:#222">
  <div style="background:#005a9c;color:#fff;padding:9px 14px"><b>Nu Html Checker</b> <span style="opacity:.8">· simulación del validador del W3C</span></div>
  <div style="padding:10px 14px">
    <p style="margin:0 0 6px"><b>Validate by Direct Input</b> (pegando el código)</p>
    <pre style="margin:0;border:1px solid #bbb;background:#fafafa;max-height:150px;overflow:auto;font:12px monospace;padding:6px">${lineas}</pre>
    <p style="margin:8px 0"><button id="check" style="font:bold 14px Arial;padding:5px 14px">Check</button></p>
    ${res}
  </div></body></html>`;
}
const URL_VALIDADOR = 'https://validator.w3.org/nu/#textarea';

// ---------- Lo que lee el Narrador ----------
function lectura(doc, { solo } = {}) {
  const out = [[`Página: ${doc.title || 'sin título'}`, null]];
  for (const e of doc.body.querySelectorAll('h1,h2,h3,h4,h5,h6,img,ul,ol,a')) {
    const n = e.tagName.toLowerCase();
    if (solo && !solo.includes(n)) continue;
    if (/^h\d$/.test(n)) out.push([`Encabezado de nivel ${n[1]}: ${e.textContent.trim()}`, { el: e }]);
    else if (n === 'img') {
      if (!e.hasAttribute('alt')) out.push([`Imagen: ${(e.dataset.ruta || e.getAttribute('src') || '').split('/').pop().replace('.', ' punto ')}`, { el: e }]);
      else if (e.alt) out.push([`Imagen: ${e.alt}`, { el: e }]);
    } else if (n === 'ul' || n === 'ol') out.push([`Lista${n === 'ol' ? ' numerada' : ''} con ${e.children.length} elementos`, { el: e }]);
    else if (n === 'a' && !e.closest('nav')) out.push([`Enlace: ${e.textContent.trim()}`, { el: e }]);
  }
  return out;
}

// Rellena el formulario de la vista poco a poco
async function rellenar(ctx) {
  const d = ctx.doc();
  const poner = async (id, v) => {
    const c = d.getElementById(id);
    if (!c) return;
    await ctx.clic({ el: c });
    if (c.type === 'checkbox' || c.type === 'radio') c.checked = true; else c.value = v;
    await ctx.esperar(250);
  };
  await poner('nombre', 'Lucía Martín');
  await poner('correo', 'lucia@ejemplo.es');
  await poner('nacimiento', '2010-03-14');
  await poner('tarde');
  await poner('normas');
  await poner('comentarios', 'Juego en el equipo de baloncesto');
}

export const PASOS = [
  /* ===== Sesión 1 ===== */
  {
    sesion: 0, nombre: 'Carpeta y primer fichero',
    texto: 'Abrimos la carpeta web-t2 en VS Code (Archivo → Abrir carpeta) y creamos index.html. El icono <> naranja indica que VS Code lo reconoce como HTML.',
    async hacer(ctx) {
      await ctx.raton('explorador');
      await ctx.nuevo('index.html');
      ctx.burbuja('Nuevo archivo: index.html', 'explorador');
      await ctx.esperar(700);
    },
    tituloMal: 'El fichero se llama index.html.txt',
    textoMal: 'Si lo guardas con el Bloc de notas o con otro nombre, el navegador no sabe que es HTML y enseña las etiquetas tal cual. Tiene que llamarse exactamente index.html.',
    async mal(ctx) {
      await ctx.nuevo('index.html.txt');
      await ctx.pegar('index.html.txt', null, '<h1>Lucía Martín</h1>\n<p>Estudio 1.º de SMR.</p>');
      await ctx.guardar();
      await ctx.ver('index.html.txt');
      ctx.burbuja('¡Se ven las etiquetas!', { css: 'pre' }, 'peligro');
      await ctx.esperar(1500);
    },
  },
  {
    sesion: 0, nombre: 'El esqueleto: ! + Tab',
    texto: 'Escribimos ! y pulsamos Tab: Emmet escribe el esqueleto entero. DOCTYPE, html, head (charset, viewport, title) y body, donde va todo lo que se ve.',
    async hacer(ctx) {
      await ctx.escribir('index.html', null, '!');
      ctx.burbuja('Tab', { linea: 1 });
      await ctx.esperar(500);
      ctx.poner('index.html', '');
      await ctx.pegar('index.html', null, esq('Document', { lang: 'en' }));
      ctx.burbuja('<head>: el sobre de la carta', { linea: 3 });
      await ctx.esperar(1300);
      ctx.burbuja('<body>: la carta que se lee', { linea: 8 });
      await ctx.esperar(1300);
      await ctx.guardar();
      await ctx.ver('index.html');
      ctx.burbuja('La pestaña dice «Document»', 'pestana');
      await ctx.esperar(1200);
    },
    tituloMal: 'Sin <meta charset="UTF-8">',
    textoMal: 'Si borras la línea del charset, el navegador no sabe cómo leer las letras: las tildes y la ñ salen como símbolos raros (Ã³, Ã±…).',
    async mal(ctx) {
      ctx.poner('index.html', '');
      await ctx.pegar('index.html', null, esq('Mi página', { charset: false }).replace('<body>\n', '<body>\n  <p>Información útil: el año, la canción y el camión.</p>\n'));
      await ctx.guardar();
      await ctx.ver('index.html');
      ctx.burbuja('¡Símbolos raros!', { css: 'p' }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 0, nombre: 'Idioma y título',
    texto: 'Cambiamos lang="en" por lang="es" (los lectores de pantalla pronuncian en español) y el título: es lo que sale en la pestaña del navegador y en Google.',
    async hacer(ctx) {
      await ctx.cambiar('index.html', 'lang="en"', 'lang="es"');
      await ctx.cambiar('index.html', '<title>Document</title>', '<title>Mi primera página</title>');
      await ctx.guardar();
      await ctx.ver('index.html');
      ctx.burbuja('Ahora la pestaña tiene nombre', 'pestana');
      await ctx.esperar(1200);
    },
    tituloMal: 'Un title vacío',
    textoMal: 'Con <title></title> vacío la pestaña solo enseña el nombre del fichero, en Google no se sabe de qué va la página y el validador da error.',
    async mal(ctx) {
      await ctx.cambiar('index.html', '<title>Document</title>', '<title></title>');
      await ctx.guardar();
      await ctx.ver('index.html');
      ctx.burbuja('Solo dice «index.html»', 'pestana', 'peligro');
      await ctx.esperar(1500);
    },
  },
  {
    sesion: 0, nombre: 'Título, párrafo y comentario',
    texto: 'Dentro de <body> va un h1 con el nombre, un párrafo y un comentario: una nota para quien lee el código que el navegador no muestra. Guardamos (Ctrl + S) y recargamos (F5).',
    async hacer(ctx) {
      await ctx.escribir('index.html', '</body>', INICIO_CUERPO, { antes: true });
      await ctx.guardar();
      ctx.burbuja('F5', 'url', '', 1200);
      await ctx.ver('index.html');
      ctx.marcar({ css: 'h1' });
      ctx.burbuja('El comentario no se ve', { css: 'h1' });
      await ctx.esperar(1600);
    },
    tituloMal: 'Un comentario mal cerrado',
    textoMal: 'El comentario se cierra con -->. Si te falta un guion, todo lo que viene detrás queda dentro del comentario y desaparece de la página.',
    async mal(ctx) {
      await ctx.escribir('index.html', '</body>', INICIO_CUERPO.replace('-->', '->'), { antes: true });
      await ctx.guardar();
      await ctx.ver('index.html');
      ctx.burbuja('¿Dónde está todo?', { css: 'body' }, 'peligro');
      await ctx.esperar(1600);
    },
  },

  /* ===== Sesión 2 ===== */
  {
    sesion: 1, nombre: 'ficha.html: encabezados',
    texto: 'Nueva página, ficha.html. Un solo h1 (el título del libro) y h2 para los apartados (los capítulos). El nivel se elige por importancia, no por el tamaño de la letra.',
    async hacer(ctx) {
      await ctx.nuevo('ficha.html');
      await ctx.pegar('ficha.html', null, esq('Mi ficha'));
      await ctx.escribir('ficha.html', '</body>', FICHA_BASE, { antes: true });
      await ctx.guardar();
      await ctx.ver('ficha.html');
      ctx.marcar({ css: 'h2' });
      ctx.burbuja('h1 → h2: en orden', { css: 'h2' });
      await ctx.esperar(1500);
    },
    tituloMal: 'Saltarse niveles: de h1 a h4',
    textoMal: 'Poner h4 porque «se ve más pequeño» es un error: el lector de pantalla cree que faltan apartados. El tamaño de la letra se cambia con CSS (Tema 3).',
    async mal(ctx) {
      await ctx.nuevo('ficha.html');
      await ctx.pegar('ficha.html', null, esq('Mi ficha'));
      await ctx.escribir('ficha.html', '</body>', FICHA_BASE.replace(/h2>/g, 'h4>'), { antes: true });
      await ctx.guardar();
      await ctx.ver('ficha.html');
      ctx.marcar({ css: 'h4' });
      ctx.burbuja('h1 → h4: ¿y h2 y h3?', { css: 'h4' }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 1, nombre: 'Listas: ul y ol',
    texto: 'Aficiones en una lista sin orden (ul): el orden da igual. La rutina de la mañana en una lista ordenada (ol): primero va una cosa y luego otra. Cada elemento, en un li.',
    async hacer(ctx) {
      await ctx.escribir('ficha.html', '<h2>Aficiones</h2>\n', AFICIONES);
      await ctx.escribir('ficha.html', '<h2>Mi rutina de mañana</h2>\n', RUTINA('ol'));
      await ctx.guardar();
      await ctx.ver('ficha.html');
      ctx.marcar({ css: 'ol' });
      ctx.burbuja('ol: 1, 2, 3…', { css: 'ol' });
      await ctx.esperar(1500);
    },
    tituloMal: 'Pasos en una lista sin orden',
    textoMal: 'Con ul los pasos salen con puntos y se pierde el orden: ¿desayuno antes o después de ducharme? Si el orden importa, ol.',
    async mal(ctx) {
      await ctx.escribir('ficha.html', '<h2>Aficiones</h2>\n', AFICIONES);
      await ctx.escribir('ficha.html', '<h2>Mi rutina de mañana</h2>\n', RUTINA('ul'));
      await ctx.guardar();
      await ctx.ver('ficha.html');
      ctx.burbuja('¿Qué va primero?', { css: 'ul', i: 1 }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 1, nombre: 'Una imagen con alt',
    texto: 'Creamos la carpeta img y metemos la foto. <img> es un elemento vacío (sin cierre). src dice dónde está, con ruta relativa; alt describe la imagen; width la hace de 300 píxeles.',
    async hacer(ctx) {
      await ctx.carpeta('img', ['yo.png', 'logo.png']);
      await ctx.escribir('ficha.html', '<h1>Lucía Martín</h1>\n', IMAGEN);
      await ctx.guardar();
      await ctx.ver('ficha.html');
      ctx.burbuja('src="img/yo.png": ruta relativa', { css: 'img' });
      await ctx.esperar(1600);
    },
    tituloMal: 'Una ruta de tu PC (C:\\…)',
    textoMal: 'En tu ordenador se ve, pero al subir la web al servidor no existe C:\\Users\\Lucia… y la imagen desaparece. Usa rutas relativas: img/yo.png.',
    async mal(ctx) {
      await ctx.carpeta('img', ['yo.png', 'logo.png']);
      await ctx.escribir('ficha.html', '<h1>Lucía Martín</h1>\n', IMAGEN.replace('img/yo.png', 'C:\\Users\\Lucia\\Documents\\web-t2\\img\\yo.png'));
      await ctx.guardar();
      ctx.burbuja('Subimos la web al servidor…', 'url', '', 1500);
      await ctx.ver('ficha.html', { servidor: true });
      ctx.burbuja('La imagen no aparece', { css: 'img' }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 1, nombre: 'Enlaces',
    texto: 'Tres enlaces con <a href>: uno absoluto a la web del instituto (target="_blank": pestaña nueva), uno relativo a index.html y uno mailto: para escribir un correo.',
    async hacer(ctx) {
      await ctx.escribir('ficha.html', '</body>', ENLACES, { antes: true });
      await ctx.guardar();
      await ctx.ver('ficha.html');
      if (ctx.rapido) return;
      await ctx.clic({ css: 'a', i: 0 });
      ctx.burbuja('Se abre en una pestaña nueva', { css: 'a', i: 0 });
      await ctx.esperar(1300);
      await ctx.clic({ css: 'a', i: 1 });
      await ctx.ver('index.html');
      ctx.burbuja('index.html', 'pestana');
      await ctx.esperar(1100);
      await ctx.ver('ficha.html');
    },
    tituloMal: '«Pincha aquí»',
    textoMal: 'Los lectores de pantalla pueden leer solo la lista de enlaces. «Pincha aquí» tres veces no dice adónde lleva ninguno. El texto del enlace tiene que decirlo.',
    async mal(ctx) {
      await ctx.escribir('ficha.html', '</body>', ENLACES_MAL, { antes: true });
      await ctx.guardar();
      await ctx.ver('ficha.html');
      if (ctx.rapido) return;
      await ctx.narrar(lectura(ctx.doc(), { solo: ['a'] }));
      ctx.burbuja('¿Aquí dónde?', { css: 'a', i: 1 }, 'peligro');
      await ctx.esperar(1400);
    },
  },
  {
    sesion: 1, nombre: 'horario.html: una tabla',
    texto: 'Las tablas son para datos en filas y columnas. table, caption (el título), tr (cada fila), th (cabecera) y td (dato). rowspan="2" une dos filas: Aplicaciones web dura dos horas.',
    async hacer(ctx) {
      await ctx.nuevo('horario.html');
      await ctx.pegar('horario.html', null, esq('Mi horario'));
      await ctx.escribir('horario.html', '</body>', TABLA(true), { antes: true });
      await ctx.guardar();
      await ctx.ver('horario.html');
      ctx.marcar({ css: 'td[rowspan]' });
      ctx.burbuja('rowspan="2"', { css: 'td[rowspan]' });
      await ctx.esperar(1300);
      ctx.marcar({ css: 'th' });
      ctx.burbuja('th: cabeceras', { css: 'th', i: 1 });
      await ctx.esperar(1300);
    },
    tituloMal: 'Sin <tr>',
    textoMal: 'Sin las filas (tr), el navegador lo mete todo en una sola fila y el horario es imposible de leer. Cada fila de la tabla va en su tr.',
    async mal(ctx) {
      await ctx.nuevo('horario.html');
      await ctx.pegar('horario.html', null, esq('Mi horario'));
      await ctx.escribir('horario.html', '</body>', TABLA(false), { antes: true });
      await ctx.guardar();
      await ctx.ver('horario.html');
      ctx.burbuja('¡Todo en una fila!', { css: 'td', i: 2 }, 'peligro');
      await ctx.esperar(1600);
    },
  },

  /* ===== Sesión 3 ===== */
  {
    sesion: 2, nombre: 'inscripcion.html: formulario',
    texto: 'Un formulario va en <form>. Cada campo tiene su label unido con for = id (al pulsar el texto se activa el campo) y su name (con ese nombre llega el dato al servidor).',
    async hacer(ctx) {
      await ctx.nuevo('inscripcion.html');
      await ctx.pegar('inscripcion.html', null, esq('Inscripción al torneo'));
      await ctx.escribir('inscripcion.html', '</body>', FORM(), { antes: true });
      await ctx.guardar();
      await ctx.ver('inscripcion.html');
      if (ctx.rapido) return;
      await ctx.clic({ css: 'label' });
      ctx.doc().getElementById('nombre')?.focus();
      ctx.marcar({ css: '#nombre' });
      ctx.burbuja('Clic en «Nombre:» → se activa el campo', { css: '#nombre' });
      await ctx.esperar(1600);
    },
    tituloMal: 'for y id no coinciden',
    textoMal: 'Si el label dice for="nombre" y el campo tiene id="nom", no están unidos: al pulsar el texto no pasa nada y el lector de pantalla no sabe qué se pide.',
    async mal(ctx) {
      await ctx.nuevo('inscripcion.html');
      await ctx.pegar('inscripcion.html', null, esq('Inscripción al torneo'));
      await ctx.escribir('inscripcion.html', '</body>', FORM('nom'), { antes: true });
      await ctx.guardar();
      await ctx.ver('inscripcion.html');
      if (ctx.rapido) return;
      await ctx.clic({ css: 'label' });
      ctx.burbuja('Clic en «Nombre:»… y nada', { css: 'label' }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 2, nombre: 'Radio, casilla y textarea',
    texto: 'Turno con botones de opción (radio): como tienen el mismo name="turno", solo se puede marcar uno. Una casilla obligatoria (required), un textarea y el botón Enviar.',
    async hacer(ctx) {
      await ctx.escribir('inscripcion.html', '  </form>', FORM_MAS(true), { antes: true });
      await ctx.guardar();
      await ctx.ver('inscripcion.html');
      if (ctx.rapido) return;
      const d = ctx.doc();
      await ctx.clic({ css: '#manana' }); d.getElementById('manana').checked = true; await ctx.esperar(500);
      await ctx.clic({ css: '#tarde' }); d.getElementById('tarde').checked = true;
      ctx.burbuja('Mismo name: solo uno', { css: '#tarde' });
      await ctx.esperar(1500);
    },
    tituloMal: 'Radios con distinto name',
    textoMal: 'Si cada botón de opción tiene un name distinto, el navegador cree que son preguntas diferentes y deja marcar mañana y tarde a la vez.',
    async mal(ctx) {
      await ctx.escribir('inscripcion.html', '  </form>', FORM_MAS(false), { antes: true });
      await ctx.guardar();
      await ctx.ver('inscripcion.html');
      if (ctx.rapido) return;
      const d = ctx.doc();
      await ctx.clic({ css: '#manana' }); d.getElementById('manana').checked = true; await ctx.esperar(500);
      await ctx.clic({ css: '#tarde' }); d.getElementById('tarde').checked = true;
      ctx.burbuja('¡Las dos marcadas!', { css: '#tarde' }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 2, nombre: 'Probar el formulario',
    texto: 'Si pulsamos Enviar vacío, required no deja enviarlo. Lo rellenamos y lo enviamos: así llegan los datos al servidor, cada uno con su name. (Procesarlos es cosa del servidor, con PHP, por ejemplo.)',
    async hacer(ctx) {
      await ctx.ver('inscripcion.html');
      if (ctx.rapido) return;
      await ctx.clic({ css: 'button' });
      ctx.enviar();
      await ctx.esperar(1500);
      await rellenar(ctx);
      await ctx.clic({ css: 'button' });
      ctx.enviar();
      await ctx.vistaLista();
      ctx.burbuja('Datos que recibe el servidor', { css: 'table' });
      await ctx.esperar(1800);
    },
    tituloMal: 'Un campo sin name',
    textoMal: 'Si al campo del correo le falta el name, se ve y se puede escribir en él… pero el dato no se envía. El servidor nunca sabrá el correo.',
    async mal(ctx) {
      ctx.poner('inscripcion.html', ctx.E.archivos.get('inscripcion.html').replace(' id="correo" name="correo"', ' id="correo"'));
      await ctx.ver('inscripcion.html');
      if (ctx.rapido) return;
      await rellenar(ctx);
      await ctx.clic({ css: 'button' });
      ctx.enviar();
      await ctx.vistaLista();
      ctx.burbuja('¿Y el correo?', { css: 'table' }, 'peligro');
      await ctx.esperar(1800);
    },
  },
  {
    sesion: 2, nombre: 'Vídeo y YouTube',
    texto: 'En ficha.html ponemos un vídeo con <video> y controls (reproducir, pausa, volumen). Para un vídeo de YouTube no se usa video sino <iframe>: el código lo da YouTube en Compartir → Insertar.',
    async hacer(ctx) {
      await ctx.carpeta('video', ['montaje.mp4']);
      await ctx.escribir('ficha.html', '</body>', VIDEO(true), { antes: true });
      await ctx.guardar();
      await ctx.ver('ficha.html');
      if (ctx.rapido) return;
      { const d = ctx.doc(), v = d.querySelector('.tw-video'); if (v) d.defaultView.scrollTo(0, v.offsetTop - 60); }
      await ctx.esperar(300);
      ctx.burbuja('controls: los botones', { css: '.tw-video-ctrl' });
      await ctx.esperar(1400);
      ctx.burbuja('iframe: YouTube', { css: '.tw-yt' });
      await ctx.esperar(1300);
    },
    tituloMal: 'Un vídeo sin controls',
    textoMal: 'Sin el atributo controls el vídeo aparece, pero no hay botones: no se puede reproducir, pausar ni bajar el volumen.',
    async mal(ctx) {
      await ctx.carpeta('video', ['montaje.mp4']);
      await ctx.escribir('ficha.html', '</body>', VIDEO(false), { antes: true });
      await ctx.guardar();
      await ctx.ver('ficha.html');
      if (ctx.rapido) return;
      { const d = ctx.doc(), v = d.querySelector('.tw-video'); if (v) d.defaultView.scrollTo(0, v.offsetTop - 60); }
      await ctx.esperar(300);
      ctx.burbuja('¿Cómo le doy al play?', { css: '.tw-video' }, 'peligro');
      await ctx.esperar(1600);
    },
  },
  {
    sesion: 2, nombre: 'Etiquetas semánticas',
    texto: 'Organizamos index.html con las etiquetas de HTML5: header (cabecera), nav (menú), main (contenido principal) y footer (pie). Dicen qué es cada bloque, a los buscadores y a los lectores de pantalla.',
    async hacer(ctx) {
      const viejo = cuerpo(ctx.E.archivos.get('index.html'));
      await ctx.cambiar('index.html', viejo, CABECERA + '  <main>\n' + sangrar(viejo) + '  </main>\n' + PIE);
      await ctx.guardar();
      await ctx.ver('index.html');
      if (ctx.rapido) return;
      ctx.semantica(true);
      ctx.burbuja('header · nav · main · footer', { css: 'main' });
      await ctx.esperar(2600);
    },
    // Las cajas de colores se quedan mientras se ve este paso
    alVer(ctx) { ctx.semantica(true); },
    tituloMal: 'Todo con <div>',
    textoMal: 'Con div la página puede verse igual, pero son cajas sin nombre: ni Google ni el lector de pantalla saben dónde está el menú o el contenido principal.',
    async mal(ctx) {
      const viejo = cuerpo(ctx.E.archivos.get('index.html'));
      const todo = (CABECERA + '  <main>\n' + sangrar(viejo) + '  </main>\n' + PIE).replace(/<(\/?)(header|nav|main|footer)>/g, '<$1div>');
      await ctx.cambiar('index.html', viejo, todo);
      await ctx.guardar();
      await ctx.ver('index.html');
      ctx.semantica(true);
      ctx.burbuja('div, div, div, div…', { css: 'div', i: 2 }, 'peligro');
      await ctx.esperar(3500);
    },
  },

  /* ===== Sesión 4 ===== */
  {
    sesion: 3, nombre: 'Las herramientas F12',
    texto: 'F12 abre las herramientas del navegador. En Elementos se ve el árbol de la página: al pasar por una línea se ilumina esa parte. Con doble clic se cambia un texto para probar, pero al recargar desaparece.',
    async hacer(ctx) {
      await ctx.ver('index.html');
      if (ctx.rapido) return;
      ctx.devtools(true);
      ctx.burbuja('F12', 'url', '', 1200);
      await ctx.esperar(600);
      await ctx.inspeccionar(7);
      ctx.marcar({ css: 'header' });
      ctx.burbuja('<header>', { css: 'header' });
      await ctx.esperar(1400);
      const h1 = ctx.doc().querySelector('h1');
      await ctx.clic({ el: h1 });
      h1.textContent = '¡Esto es una prueba!';
      ctx.burbuja('Doble clic: cambio de prueba', { el: h1 });
      await ctx.esperar(1500);
      ctx.burbuja('F5', 'url', '', 1000);
      await ctx.ver('index.html');
      ctx.burbuja('Al recargar, vuelve a estar como en el fichero', { css: 'h1' });
      await ctx.esperar(1700);
    },
    // El panel F12 se queda abierto mientras se ve este paso
    alVer(ctx) { ctx.devtools(true); },
  },
  {
    sesion: 3, nombre: 'El validador del W3C',
    texto: 'En validator.w3.org, pestaña Validate by Direct Input: pegamos todo el código (Ctrl + A, Ctrl + C, Ctrl + V) y pulsamos Check. Si sale en verde, la página cumple el estándar.',
    async hacer(ctx) {
      const cod = ctx.E.archivos.get('index.html');
      await ctx.abrir('index.html');
      ctx.burbuja('Ctrl + A, Ctrl + C', { linea: 3 }, '', 1300);
      await ctx.esperar(700);
      await ctx.verHtml(URL_VALIDADOR, paginaValidador(cod, null));
      if (!ctx.rapido) { await ctx.clic({ css: '#check' }); }
      await ctx.verHtml(URL_VALIDADOR, paginaValidador(cod, ctx.validar(cod)));
      ctx.burbuja('¡Sin errores!', { css: '#ok' });
      await ctx.esperar(1600);
    },
    tituloMal: 'Tres fallos, cinco mensajes',
    textoMal: 'Hemos quitado el </head>, cerrado el h1 con </h2> y anidado mal un b. El navegador lo disimula, pero el validador da cinco mensajes: un fallo puede provocar varios. Se arreglan de arriba abajo y se vuelve a validar.',
    async mal(ctx) {
      const cod = ctx.E.archivos.get('index.html')
        .replace('</head>\n', '')
        .replace('<h1>Lucía Martín</h1>', '<h1>Lucía Martín</h2>')
        .replace('Estudio 1.º de SMR en el instituto.</p>', 'Estudio <b>1.º de SMR en el instituto.</p></b>');
      ctx.poner('index.html', cod);
      await ctx.abrir('index.html');
      await ctx.verHtml(URL_VALIDADOR, paginaValidador(cod, null));
      if (!ctx.rapido) { await ctx.clic({ css: '#check' }); }
      await ctx.verHtml(URL_VALIDADOR, paginaValidador(cod, ctx.validar(cod)));
      ctx.burbuja('Error: línea y problema', { css: 'li.error' }, 'peligro');
      await ctx.esperar(2200);
    },
  },
  {
    sesion: 3, nombre: 'Accesibilidad: el Narrador',
    texto: 'Windows trae un lector de pantalla, el Narrador (Windows + Ctrl + Intro). Escuchamos ficha.html: lee los encabezados, el alt de la imagen y el texto de los enlaces. Una web accesible la puede usar todo el mundo.',
    async hacer(ctx) {
      await ctx.abrir('ficha.html');
      await ctx.ver('ficha.html');
      if (ctx.rapido) return;
      await ctx.narrar(lectura(ctx.doc()).slice(0, 11));
    },
    tituloMal: 'Sin alt y con «pincha aquí»',
    textoMal: 'Sin alt, el Narrador solo puede leer el nombre del fichero («yo punto png»). Y tres enlaces «pincha aquí» no dicen nada. Es lo que oye una persona ciega.',
    async mal(ctx) {
      let cod = ctx.E.archivos.get('ficha.html').replace(/ alt="Lucía[^"]*"/, '');
      cod = cod.slice(0, cod.indexOf('  <h2>Enlaces</h2>')) + ENLACES_MAL + cod.slice(cod.indexOf('  <h2>Un vídeo'));
      ctx.poner('ficha.html', cod);
      await ctx.ver('ficha.html');
      if (ctx.rapido) return;
      await ctx.narrar(lectura(ctx.doc(), { solo: ['img', 'a'] }));
    },
  },
  {
    sesion: 3, nombre: 'El sitio completo',
    texto: 'Copiamos el mismo header, nav y footer en las cuatro páginas: así el menú funciona desde cualquiera. Nombres en minúsculas y sin espacios, rutas relativas y index.html como portada.',
    async hacer(ctx) {
      const cab = cuerpo(ctx.E.archivos.get('index.html'));
      const arriba = cab.slice(0, cab.indexOf('  <main>'));
      for (const f of ['ficha.html', 'horario.html', 'inscripcion.html']) {
        const cod = ctx.E.archivos.get(f), c = cuerpo(cod);
        await ctx.abrir(f);
        ctx.burbuja('Ctrl + V', { linea: 9 }, '', 900);
        ctx.poner(f, cod.replace(c, arriba + '  <main>\n' + sangrar(c) + '  </main>\n' + PIE));
        await ctx.guardar();
      }
      await ctx.ver('index.html');
      if (ctx.rapido) return;
      for (const [i, f] of [[1, 'ficha.html'], [2, 'horario.html'], [3, 'inscripcion.html'], [0, 'index.html']]) {
        await ctx.clic({ css: 'nav a', i });
        await ctx.ver(f);
        await ctx.esperar(500);
      }
      ctx.confeti();
      ctx.burbuja('¡Sitio web terminado!', { css: 'h1' });
      await ctx.esperar(2000);
    },
    tituloMal: '«Mi Horario.html»',
    textoMal: 'Si renombras el fichero con mayúsculas y espacios, el enlace del menú (horario.html) ya no lo encuentra: «No se puede acceder a este archivo». Nombres en minúsculas, sin espacios ni tildes.',
    async mal(ctx) {
      await ctx.renombrar('horario.html', 'Mi Horario.html');
      ctx.burbuja('Renombrado: Mi Horario.html', 'explorador', 'peligro', 1600);
      await ctx.esperar(900);
      await ctx.ver('index.html');
      if (ctx.rapido) return;
      await ctx.clic({ css: 'nav a', i: 2 });
      await ctx.ver('horario.html');
      ctx.burbuja('El enlace ya no funciona', { css: 'h1' }, 'peligro');
      await ctx.esperar(1800);
    },
  },
];

// Para la práctica y las pruebas
export const _interno = { esq, cuerpo, paginaValidador };
