// validador.js — Un validador de HTML sencillo, al estilo del validador del W3C, para 1.º SMR.
// Exige las «buenas costumbres» del tema: todo cerrado (salvo los elementos vacíos), bien anidado,
// y además revisa accesibilidad básica (alt, label, encabezados, texto de enlaces).
// validar(codigo) → [{ tipo: 'error' | 'aviso', codigo, linea, msg, explica }]

export const VACIOS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const CONOCIDAS = new Set(['html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
  'strong', 'em', 'b', 'i', 'small', 'mark', 'span', 'div', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'a', 'img', 'figure', 'figcaption', 'table', 'caption',
  'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'form', 'label', 'input', 'select', 'option', 'textarea', 'button', 'fieldset', 'legend', 'video', 'audio',
  'source', 'track', 'iframe', 'header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'blockquote', 'code', 'pre', 'sub', 'sup', 'u', 's', 'q', 'cite', 'abbr', 'time', 'address']);
const ENLACE_VACIO = /^\s*(pincha|pulsa|haz clic|clic|click)?\s*(aqu[ií]|aqu[ií] mismo)\s*\.?\s*$/i;

// ---------- Trocear el código en etiquetas y texto ----------
export function trocear(codigo) {
  const t = [];
  let i = 0, linea = 1;
  const avanza = s => { for (const c of s) if (c === '\n') linea++; };
  while (i < codigo.length) {
    if (codigo.startsWith('<!--', i)) {
      const fin = codigo.indexOf('-->', i + 4);
      const trozo = fin < 0 ? codigo.slice(i) : codigo.slice(i, fin + 3);
      t.push({ tipo: 'comentario', linea, abierto: fin < 0 });
      avanza(trozo); i += trozo.length; continue;
    }
    if (codigo[i] === '<' && /[!/a-zA-Z?]/.test(codigo[i + 1] || '')) {
      // buscar el > que cierra la etiqueta, respetando comillas
      let j = i + 1, q = null;
      while (j < codigo.length) {
        const c = codigo[j];
        if (q) { if (c === q) q = null; }
        else if (c === '"' || c === "'") q = c;
        else if (c === '>') break;
        else if (c === '<' && j > i + 1) break;   // etiqueta sin cerrar el >
        j++;
      }
      const sinCierre = codigo[j] !== '>';
      const trozo = codigo.slice(i, sinCierre ? j : j + 1);
      const l0 = linea;
      if (/^<!doctype/i.test(trozo)) t.push({ tipo: 'doctype', linea: l0, valor: trozo });
      else if (trozo[1] === '?') t.push({ tipo: 'pi', linea: l0 });
      else if (trozo[1] === '/') t.push({ tipo: 'cierre', nombre: (trozo.match(/^<\/\s*([a-zA-Z][\w-]*)/) || [])[1] || '', crudo: trozo.match(/^<\/\s*([a-zA-Z][\w-]*)/)?.[1] || '', linea: l0, sinCierre });
      else {
        const m = trozo.match(/^<([a-zA-Z][\w-]*)/);
        const crudo = m ? m[1] : '';
        const resto = trozo.slice(1 + crudo.length).replace(/\/?>?$/, '');
        t.push({ tipo: 'apertura', nombre: crudo.toLowerCase(), crudo, attrs: leerAtributos(resto), autocierre: /\/>$/.test(trozo), linea: l0, sinCierre });
      }
      avanza(trozo); i += trozo.length;
      // el contenido de script y style no se analiza
      const ult = t[t.length - 1];
      if (ult.tipo === 'apertura' && (ult.nombre === 'script' || ult.nombre === 'style')) {
        const fin = codigo.toLowerCase().indexOf('</' + ult.nombre, i);
        const dentro = fin < 0 ? codigo.slice(i) : codigo.slice(i, fin);
        avanza(dentro); i += dentro.length;
      }
      continue;
    }
    let j = codigo.indexOf('<', i + 1);
    if (j < 0) j = codigo.length;
    const texto = codigo.slice(i, j);
    t.push({ tipo: 'texto', texto, linea });
    avanza(texto); i = j;
  }
  return t;
}

function leerAtributos(s) {
  const a = {};
  const re = /([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(s))) {
    const k = m[1].toLowerCase();
    const v = m[2] ?? m[3] ?? m[4];
    a[k] = { valor: v === undefined ? '' : v, comillas: m[2] !== undefined || m[3] !== undefined, sinValor: v === undefined };
  }
  return a;
}
const attr = (tok, k) => tok.attrs && tok.attrs[k] ? tok.attrs[k].valor : undefined;

// ---------- Validar ----------
export function validar(codigo) {
  const toks = trocear(codigo);
  const out = [];
  const err = (codigoErr, linea, msg, explica) => out.push({ tipo: 'error', codigo: codigoErr, linea, msg, explica });
  const aviso = (codigoErr, linea, msg, explica) => out.push({ tipo: 'aviso', codigo: codigoErr, linea, msg, explica });

  const primero = toks.find(t => !(t.tipo === 'texto' && !t.texto.trim()) && t.tipo !== 'comentario');
  if (!primero || primero.tipo !== 'doctype') err('doctype', 1, 'Falta el <!DOCTYPE html> al principio.', 'Tiene que ser la primera línea: avisa al navegador de que es una página HTML5.');
  else if (!/^<!doctype\s+html\s*>$/i.test(primero.valor.trim())) aviso('doctype', primero.linea, 'El DOCTYPE no es el de HTML5.', 'En HTML5 es simplemente <!DOCTYPE html>.');

  const pila = [];
  const ids = {};
  const labelsFor = [];
  let h1 = 0, nivelAnt = 0, enHead = false, enBody = false, haCharset = false, titulo = null, textoTitulo = '';
  let hayHtml = false, hayHead = false, hayBody = false;
  const enlaces = [];
  let enlaceAbierto = null;

  for (const t of toks) {
    if (t.tipo === 'comentario' && t.abierto) err('comentario', t.linea, 'Comentario sin cerrar.', 'Un comentario empieza por <!-- y acaba por -->. Sin el final, todo lo que sigue queda oculto.');
    if (t.tipo === 'texto') {
      if (titulo && pila[pila.length - 1]?.nombre === 'title') textoTitulo += t.texto;
      if (enlaceAbierto) enlaceAbierto.texto += t.texto;
      continue;
    }
    if (t.tipo === 'apertura') {
      const n = t.nombre;
      if (t.sinCierre) err('sin-mayor', t.linea, `A la etiqueta <${t.crudo}> le falta el «>» del final.`, 'Toda etiqueta termina con >.');
      if (t.crudo !== n) aviso('mayusculas', t.linea, `<${t.crudo}> está en mayúsculas.`, 'En HTML5 vale, pero con las buenas costumbres de XHTML se escribe todo en minúsculas.');
      if (!CONOCIDAS.has(n)) err('desconocida', t.linea, `La etiqueta <${t.crudo}> no existe en HTML.`, 'En HTML las etiquetas ya están definidas: no te las puedes inventar (eso es XML).');
      Object.entries(t.attrs).forEach(([k, v]) => { if (!v.sinValor && !v.comillas) aviso('comillas', t.linea, `El valor del atributo ${k} va sin comillas.`, `Escribe ${k}="${v.valor}". HTML5 lo tolera, pero XHTML no.`); });
      const id = attr(t, 'id');
      if (id !== undefined) {
        if (ids[id]) err('id-duplicado', t.linea, `El id «${id}» está repetido (ya estaba en la línea ${ids[id]}).`, 'Cada id tiene que ser único en la página.');
        else ids[id] = t.linea;
      }
      const padre = pila[pila.length - 1]?.nombre;
      if (n === 'html') { hayHtml = true; if (!attr(t, 'lang')) aviso('lang', t.linea, 'Falta el atributo lang en <html>.', 'Pon <html lang="es">: el lector de pantalla pronunciará en español y los buscadores sabrán el idioma.'); }
      if (n === 'head') { hayHead = true; enHead = true; }
      if (n === 'body') {
        hayBody = true; enBody = true; enHead = false;
        const ph = pila.findIndex(x => x.nombre === 'head');
        if (ph >= 0) { err('head-sin-cerrar', pila[ph].linea, 'Falta el </head> antes de <body>.', 'La cabecera se cierra antes de empezar el cuerpo.'); pila.splice(ph, 1); }
      }
      if (n === 'meta' && (attr(t, 'charset') !== undefined)) haCharset = true;
      if (n === 'title') { titulo = t; textoTitulo = ''; }
      if (n === 'li' && padre !== 'ul' && padre !== 'ol') err('li-fuera', t.linea, `Un <li> tiene que ir dentro de <ul> o <ol>${padre ? ` (está dentro de <${padre}>)` : ''}.`, 'Los elementos de una lista siempre van dentro de la lista.');
      if ((n === 'td' || n === 'th') && padre !== 'tr') err('celda-fuera', t.linea, `Un <${n}> tiene que ir dentro de una fila <tr>.`, 'Cada fila de la tabla se escribe con <tr> y dentro van sus celdas.');
      if (n === 'tr' && !['table', 'thead', 'tbody', 'tfoot'].includes(padre)) err('fila-fuera', t.linea, 'Un <tr> tiene que ir dentro de <table>.', '');
      if (n === 'img') {
        if (attr(t, 'alt') === undefined) err('alt', t.linea, 'A la imagen le falta el atributo alt.', 'El alt describe la imagen: lo lee el lector de pantalla y se ve si la imagen no carga. Si es solo decorativa, alt="".');
        if (!attr(t, 'src')) err('src', t.linea, 'A la imagen le falta el atributo src.', 'src dice dónde está el fichero de la imagen.');
      }
      for (const k of ['src', 'href']) {
        const v = attr(t, k);
        if (v && (/^[a-z]:\\/i.test(v) || v.includes('\\'))) err('ruta-pc', t.linea, `La ruta ${k}="${v}" es de tu ordenador.`, 'Esa carpeta no existe en el servidor. Usa una ruta relativa, como img/foto.jpg, con barras /.');
        else if (v && / /.test(v) && !/^(https?:|mailto:)/.test(v)) aviso('ruta-espacios', t.linea, `La ruta «${v}» tiene espacios.`, 'Nombres de fichero en minúsculas, sin espacios ni tildes: mi-horario.html.');
      }
      if (/^h[1-6]$/.test(n)) {
        const nivel = Number(n[1]);
        if (nivel === 1) { h1++; if (h1 === 2) aviso('h1-varios', t.linea, 'Hay más de un <h1> en la página.', 'Usa un solo h1: el título principal.'); }
        if (nivelAnt && nivel > nivelAnt + 1) aviso('salto-nivel', t.linea, `Se salta de <h${nivelAnt}> a <h${nivel}>.`, `Después de un h${nivelAnt} viene un h${nivelAnt + 1}. Elige el nivel por su importancia, no por el tamaño.`);
        if (!nivelAnt && nivel !== 1) aviso('salto-nivel', t.linea, `El primer encabezado es <h${nivel}>: debería ser <h1>.`, 'La página empieza por su título principal, h1.');
        nivelAnt = nivel;
      }
      if (n === 'a') {
        if (attr(t, 'href') === undefined) aviso('href', t.linea, 'El enlace <a> no tiene href.', 'Sin href no lleva a ninguna parte.');
        enlaceAbierto = { linea: t.linea, texto: '' };
      }
      if (n === 'label') labelsFor.push({ valor: attr(t, 'for'), linea: t.linea });
      if ((n === 'input' || n === 'select' || n === 'textarea') && !['submit', 'button', 'reset', 'hidden'].includes(attr(t, 'type'))) {
        if (attr(t, 'name') === undefined) aviso('name', t.linea, `El campo <${n}${attr(t, 'type') ? ` type="${attr(t, 'type')}"` : ''}> no tiene name.`, 'Sin name, ese dato no llega al servidor al enviar el formulario.');
      }
      if (n === 'video' || n === 'audio') { if (attr(t, 'controls') === undefined) aviso('controls', t.linea, `El <${n}> no tiene controls.`, 'Sin controls no aparecen los botones de reproducir y pausar.'); }
      if (VACIOS.has(n)) continue;
      if (t.autocierre) continue;
      pila.push(t);
      continue;
    }
    if (t.tipo === 'cierre') {
      const n = t.crudo.toLowerCase();
      if (t.sinCierre) err('sin-mayor', t.linea, `A la etiqueta </${t.crudo}> le falta el «>» del final.`, 'Toda etiqueta termina con >.');
      if (VACIOS.has(n)) { err('cierre-vacio', t.linea, `Sobra el </${t.crudo}>: <${n}> es un elemento vacío y no se cierra.`, `Se escribe solo <${n}> (o <${n} /> en XHTML).`); continue; }
      if (n === 'a' && enlaceAbierto) {
        const txt = enlaceAbierto.texto.replace(/\s+/g, ' ').trim();
        if (!txt) aviso('enlace-vacio', enlaceAbierto.linea, 'El enlace no tiene texto.', 'El texto del enlace dice adónde lleva.');
        else if (ENLACE_VACIO.test(txt)) aviso('enlace-aqui', enlaceAbierto.linea, `El texto del enlace es «${txt}».`, '«Pincha aquí» no dice adónde lleva. Escribe el destino: «Descargar el horario (PDF)».');
        enlaceAbierto = null;
      }
      if (n === 'title' && titulo) { if (!textoTitulo.trim()) err('title-vacio', titulo.linea, 'El <title> está vacío.', 'Es el texto de la pestaña y de los resultados de Google.'); titulo = null; }
      if (n === 'head') enHead = false;
      const pos = pila.map(x => x.nombre).lastIndexOf(n);
      if (pos < 0) { err('cierre-sobra', t.linea, `Sobra el </${t.crudo}>: no hay ningún <${n}> abierto.`, 'Estás cerrando algo que no se había abierto (en inglés, «Stray end tag»).'); continue; }
      if (pos < pila.length - 1) {
        const sin = pila.slice(pos + 1);
        sin.reverse().forEach(x => err('sin-cerrar', x.linea, `<${x.nombre}> (línea ${x.linea}) no se ha cerrado antes de </${n}>.`,
          `Lo último que se abre es lo primero que se cierra: cierra </${x.nombre}> antes de </${n}>.`));
      }
      pila.length = pos;
      continue;
    }
  }
  pila.slice().reverse().forEach(x => err('sin-cerrar', x.linea, `<${x.nombre}> se abre en la línea ${x.linea} y no se cierra.`, `Falta el </${x.nombre}>.`));
  if (!hayHtml) err('html', 1, 'Falta el elemento <html>.', 'Es el elemento raíz: lo contiene todo.');
  if (!hayHead) err('head', 1, 'Falta el <head>.', 'La cabecera lleva el charset y el title.');
  if (!hayBody) err('body', 1, 'Falta el <body>.', 'El cuerpo es lo que se ve en la página.');
  if (!haCharset) err('charset', 1, 'Falta <meta charset="UTF-8"> en el <head>.', 'Sin él, las tildes y la ñ pueden salir como símbolos raros.');
  if (titulo === null && !/<title[\s>]/i.test(codigo)) err('title', 1, 'Falta el <title> en el <head>.', 'Es el texto de la pestaña del navegador.');
  labelsFor.forEach(l => {
    if (l.valor !== undefined && !ids[l.valor]) err('label-for', l.linea, `El label for="${l.valor}" no corresponde a ningún id.`, 'El for del label tiene que ser igual que el id de su campo: así, al pulsar el texto se activa el campo.');
  });
  out.sort((a, b) => a.linea - b.linea || (a.tipo === b.tipo ? 0 : a.tipo === 'error' ? -1 : 1));
  return out;
}

// Contar elementos (para comprobar que no se ha borrado contenido al «arreglar»)
export function contar(codigo, nombre) {
  return trocear(codigo).filter(t => t.tipo === 'apertura' && t.nombre === nombre).length;
}
