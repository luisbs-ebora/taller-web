// escena.js — Clase animada del Tema 2: a la izquierda VS Code, a la derecha el navegador.
// Los pasos (pasos.js) usan el ctx de aquí: crear ficheros, escribir código, ver la página, ratón, bocadillos…
import { h } from '../util.js';
import { animar, esperar, ease, actualizarAnimaciones, cancelarAnimaciones, alMomento, velocidad } from './anim.js';
import { validar, trocear, VACIOS } from './validador.js';
import { PASOS, SESIONES } from './pasos.js';

const LENTO = 2.2;
const RAIZ = 'web-t2';

// ---------- Resaltado de código (colores tipo VS Code) ----------
const escH = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
export function resaltar(linea) {
  let out = '', i = 0;
  const re = /(<!--[\s\S]*?(?:-->|$))|(<\/?)([a-zA-Z!][\w-]*)([^>]*)(\/?>)?/g;
  let m;
  while ((m = re.exec(linea))) {
    out += escH(linea.slice(i, m.index));
    if (m[1]) out += `<span class="c-com">${escH(m[1])}</span>`;
    else {
      const attrs = escH(m[4]).replace(/([\w:-]+)(=)("[^"]*"|'[^']*'|[^\s"']+)?/g, (_, k, eq, v) =>
        `<span class="c-atr">${k}</span>${eq}${v ? `<span class="c-val">${v}</span>` : ''}`);
      out += `<span class="c-pun">${escH(m[2])}</span><span class="c-eti">${escH(m[3])}</span>${attrs}${m[5] ? `<span class="c-pun">${escH(m[5])}</span>` : ''}`;
    }
    i = m.index + m[0].length;
  }
  return out + escH(linea.slice(i));
}

// ---------- Imágenes y vídeos «virtuales» de la carpeta web-t2 ----------
const svg = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const ACTIVOS = {
  'img/yo.png': svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"><rect width="200" height="150" rx="10" fill="#ffd9a8"/><circle cx="100" cy="58" r="28" fill="#f2c9a0" stroke="#1d1b24" stroke-width="3"/><path d="M72 52c4-22 52-24 56 0-10-8-46-8-56 0z" fill="#5b3a29"/><circle cx="90" cy="58" r="3"/><circle cx="110" cy="58" r="3"/><path d="M90 70q10 8 20 0" stroke="#1d1b24" stroke-width="3" fill="none"/><path d="M58 150c4-34 80-34 84 0" fill="#4a86e8" stroke="#1d1b24" stroke-width="3"/><rect x="128" y="96" width="46" height="40" rx="4" fill="#37405a" stroke="#1d1b24" stroke-width="3"/><circle cx="151" cy="110" r="6" fill="#3fbf6a"/></svg>`),
  'img/logo.png': svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#e3a23b"/><text x="60" y="78" font-family="Arial" font-weight="bold" font-size="48" text-anchor="middle" fill="#fff">&lt;/&gt;</text></svg>`),
};
// Cualquier otra imagen de la carpeta img/ se dibuja como una foto genérica con su nombre
const FOTO = nombre => svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#cfe3f5"/><circle cx="250" cy="52" r="24" fill="#ffd23f"/><path d="M0 200 L90 90 L160 170 L210 120 L320 200z" fill="#5a9e6f"/><rect x="0" y="168" width="320" height="32" fill="rgba(0,0,0,.45)"/><text x="12" y="190" font-family="Arial" font-size="16" fill="#fff">${nombre}</text></svg>`);
const activo = ruta => ACTIVOS[ruta] || (/^img\/[\w-]+\.(png|jpe?g|gif|svg|webp)$/.test(ruta) ? FOTO(ruta.slice(4)) : null);
export const ARCHIVOS_FIJOS = { 'img': ['yo.png', 'logo.png'], 'video': ['montaje.mp4'] };

// Convierte el código en la página que «pinta» el navegador
function mojibake(s) {
  // texto UTF-8 leído como Latin-1: «á» → «Ã¡»
  return s.replace(/[^\x00-\x7f]/g, c => unescape(encodeURIComponent(c)));
}
export function paginaDe(codigo, nombre) {
  let html = codigo;
  if (!/<meta\s+charset\s*=/i.test(html)) html = mojibake(html);
  html = html.replace(/(<img\b[^>]*?\bsrc=)(["'])([^"']*)\2/gi, (m, a, q, ruta) => activo(ruta) ? `${a}${q}${activo(ruta)}${q} data-ruta="${ruta}"` : m);
  html = html.replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/gi, (m, at) => {
    const ancho = (at.match(/width=["']?(\d+)/) || [])[1] || 320;
    const ctrl = /\bcontrols\b/.test(at);
    return `<div class="tw-video" style="width:${ancho}px">${ctrl ? '<div class="tw-video-ctrl"><span>▶</span><span>⏸</span><i></i><span>🔊</span></div>' : '<div class="tw-video-sin">Vídeo sin botones: no se puede reproducir ni pausar</div>'}</div>`;
  });
  html = html.replace(/<iframe\b[^>]*src=["']([^"']*)["'][^>]*>\s*<\/iframe>/gi, (m, src) =>
    `<div class="tw-yt"><b>▶</b><span>${/youtube/.test(src) ? 'Vídeo de YouTube' : 'Página insertada'}</span></div>`);
  const css = `<style id="tw-base">
    html.tw-sem header, html.tw-sem nav, html.tw-sem main, html.tw-sem footer, html.tw-sem div { position: relative; outline: 3px dashed var(--c); outline-offset: 2px; margin: 10px 4px; padding: 14px 6px 4px; }
    html.tw-sem header { --c: #ff6a3d } html.tw-sem nav { --c: #4a86e8 } html.tw-sem main { --c: #3fbf6a } html.tw-sem footer { --c: #8b6fe0 } html.tw-sem div { --c: #9aa3b2 }
    html.tw-sem header::before, html.tw-sem nav::before, html.tw-sem main::before, html.tw-sem footer::before, html.tw-sem div::before {
      position: absolute; top: -11px; left: 6px; font: bold 12px Arial; color: #fff; background: var(--c); padding: 1px 7px; border-radius: 6px; }
    html.tw-sem header::before { content: 'header' } html.tw-sem nav::before { content: 'nav' } html.tw-sem main::before { content: 'main' } html.tw-sem footer::before { content: 'footer' } html.tw-sem div::before { content: 'div' }
    .tw-marca { outline: 4px solid #ffd23f !important; outline-offset: 3px; background: rgba(255,210,63,.25) !important; transition: outline .2s; }
    .tw-video { aspect-ratio: 16/9; background: #1d1b24 linear-gradient(135deg,#37405a,#1d1b24); border-radius: 6px; position: relative; color: #fff; font: 14px Arial; margin: 8px 0; max-width: 100%; }
    .tw-video-ctrl { position: absolute; left: 0; right: 0; bottom: 0; display: flex; gap: 10px; align-items: center; padding: 6px 10px; background: rgba(0,0,0,.55); }
    .tw-video-ctrl i { flex: 1; height: 4px; background: linear-gradient(90deg,#ff6a3d 30%,#777 30%); border-radius: 2px; }
    .tw-video-sin { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 10px; color: #ffd23f; }
    .tw-yt { width: 320px; aspect-ratio: 16/9; background: #111; color: #fff; display: grid; place-items: center; border-radius: 8px; font: 14px Arial; margin: 8px 0; }
    .tw-yt b { width: 56px; height: 40px; border-radius: 10px; background: #e5484d; display: grid; place-items: center; font-size: 20px; }
  </style>`;
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, m => m + css);
  else html = css + html;
  return html;
}

// ---------- La vista ----------
export async function vistaEscena() {
  /* --- Editor (VS Code de dibujos) --- */
  const explorador = h('ul.tw-arbol');
  const pestanasEd = h('div.tw-pestanas');
  const codigoEl = h('div.tw-codigo', { role: 'region', 'aria-label': 'Código' });
  const vscode = h('section.tw-vscode', { 'aria-label': 'Visual Studio Code' },
    h('div.tw-titulo-ventana', h('span.tw-semaforo', h('i'), h('i'), h('i')), h('b', `${RAIZ} — Visual Studio Code`)),
    h('div.tw-vs-cuerpo',
      h('nav.tw-explorador', h('div.tw-exp-cab', 'EXPLORADOR'), h('div.tw-exp-raiz', '▾ ' + RAIZ.toUpperCase()), explorador),
      h('div.tw-vs-editor', pestanasEd, codigoEl)));

  /* --- Navegador --- */
  const navTitulo = h('span.tw-nav-tit', 'Nueva pestaña');
  const navUrl = h('div.tw-url', '');
  const iframe = h('iframe.tw-vista', { title: 'Vista del navegador', tabindex: '-1' });
  const devtools = h('div.tw-devtools', { hidden: true });
  const narrador = h('div.tw-narrador', { hidden: true });
  const navegador = h('section.tw-navegador', { 'aria-label': 'Navegador' },
    h('div.tw-nav-pestanas', h('div.tw-nav-pestana', h('span.tw-favicon', '◆'), navTitulo)),
    h('div.tw-nav-barra', h('span', '←'), h('span', '→'), h('span.tw-recargar', '⟳'), navUrl),
    h('div.tw-nav-vista', iframe, narrador), devtools);

  /* --- Lista de pasos, ratón, bocadillos y barra --- */
  const lista = h('ol.tw-lista');
  const pasosEl = h('aside.tw-pasos', { 'aria-label': 'Pasos' }, h('h2', 'Pasos'), lista);
  const raton = h('div.tw-raton', { 'aria-hidden': 'true' }, h('svg', {}));
  raton.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 2l17 10-8 1.6L8.6 21z" fill="#fff" stroke="#1d1b24" stroke-width="2" stroke-linejoin="round"/></svg>';
  const capa = h('div.am-burbujas');
  const cPaso = h('span.am-clase-paso'), cTitulo = h('h2'), cTexto = h('p');
  const bAnt = h('button.am-btn', { type: 'button', title: 'Flecha izquierda' }, '◀ Anterior');
  const bRep = h('button.am-btn', { type: 'button', title: 'Tecla R' }, '↻ Repetir');
  const bSig = h('button.am-btn.am-principal', { type: 'button', title: 'Flecha derecha o espacio' }, 'Siguiente ▶');
  const bMal = h('button.am-btn.am-peligro', { type: 'button', title: 'Tecla M' }, '¿Y si lo hago mal?');
  const bVel = h('button.am-btn', { type: 'button', title: 'Tecla L', 'aria-pressed': 'false' }, 'Velocidad: normal');
  const bClase = h('button.am-btn', { type: 'button', title: 'Pantalla completa' }, '⛶ Modo clase');
  const barra = h('div.tw-barra',
    h('div.am-clase-info', cPaso, cTitulo, cTexto),
    h('div.am-clase-controles', bAnt, bRep, bSig, bMal, bVel, bClase));
  const escena = h('div.am-escena.tw-escena', pasosEl, vscode, navegador, raton, capa, barra);
  const el = h('div.animado',
    h('div.am-cab', h('div', h('span.etiqueta', 'Tema 2 · Creación de páginas web con HTML'), h('h1', 'Mi primer sitio web, paso a paso'),
      h('p.lead', 'Escribimos en VS Code y lo vemos en el navegador: el esqueleto, la ficha con listas, imagen y enlaces, el horario, el formulario, las etiquetas de HTML5, el validador y la accesibilidad.'))),
    escena,
    h('p.am-atajos', 'Con teclado o presentador: ', h('kbd', '→'), ' o ', h('kbd', 'espacio'), ' siguiente · ', h('kbd', '←'), ' anterior · ', h('kbd', 'R'), ' repetir · ', h('kbd', 'M'), ' error · ', h('kbd', 'L'), ' lento · ', h('kbd', 'F'), ' modo clase · ', h('kbd', 'Esc'), ' salir'));

  /* ---------- Estado ---------- */
  let E;                     // estado del sitio
  let hecho = 0, ocupado = false, generacion = 0, mensajeMal = null, clase = false, raf = 0;
  const temporizadores = new Set();
  function estadoNuevo() {
    return { archivos: new Map(), carpetas: new Map(), abierto: null, pestanas: [], sinGuardar: new Set(), resalte: null, cursor: null,
      nav: { tipo: 'vacio', archivo: null, url: '', html: '' }, devtools: false, semantica: false };
  }

  /* ---------- Pintar ---------- */
  function pintarExplorador() {
    const filas = [];
    for (const [c, ficheros] of E.carpetas) {
      filas.push(h('li.carpeta', '▾ ' + c));
      ficheros.forEach(f => filas.push(h('li.fichero.sub' + (f.endsWith('.png') ? '.img' : '.otro'), f)));
    }
    for (const n of E.archivos.keys()) filas.push(h('li.fichero' + (n === E.abierto ? '.activo' : '') + (/\.html$/.test(n) ? '.html' : ''), n));
    explorador.replaceChildren(...filas);
  }
  function pintarPestanas() {
    pestanasEd.replaceChildren(...E.pestanas.map(n => h('span.tw-pest' + (n === E.abierto ? '.activa' : ''),
      h('i.ico' + (/\.html$/.test(n) ? '.html' : '')), n, E.sinGuardar.has(n) ? h('b.punto', '●') : h('b.x', '×'))));
  }
  function pintarCodigo() {
    const txt = E.abierto ? E.archivos.get(E.abierto) || '' : '';
    if (!E.abierto) { codigoEl.replaceChildren(h('div.tw-vacio', 'Abre una carpeta para empezar')); return; }
    const lineas = txt.split('\n');
    const [r0, r1] = E.resalte || [-1, -1];
    let pos = 0;
    const filas = lineas.map((l, i) => {
      const ini = pos, fin = pos + l.length; pos = fin + 1;
      const marcada = E.resalte && fin >= r0 && ini < r1 && !(ini === r1);
      const d = h('div.tw-linea' + (marcada ? '.nueva' : ''), h('span.n', String(i + 1)));
      const c = h('span.t'); c.innerHTML = resaltar(l) || ' ';
      d.append(c);
      if (E.cursor !== null && E.cursor >= ini && E.cursor <= fin) d.classList.add('cursor');
      return d;
    });
    codigoEl.replaceChildren(...filas);
    const act = codigoEl.querySelector('.cursor') || codigoEl.querySelector('.nueva');
    if (act && !velocidad.instantaneo) {
      const top = act.offsetTop - codigoEl.clientHeight / 2;
      codigoEl.scrollTop = Math.max(0, top);
    }
  }
  function pintarTodo() { pintarExplorador(); pintarPestanas(); pintarCodigo(); pintarNavegador(); pintarDevtools(); }

  // El navegador
  let htmlCargado = null, cargando = null;
  function pintarNavegador() {
    const n = E.nav;
    let html = '';
    if (n.tipo === 'archivo') {
      const cod = E.archivos.get(n.archivo);
      if (cod === undefined) html = pagina404(n.archivo);
      else if (!/\.html?$/.test(n.archivo)) html = `<pre style="font:14px monospace;white-space:pre-wrap;margin:10px">${escH(cod)}</pre>`;
      else html = paginaDe(cod, n.archivo);
      navUrl.textContent = !n.archivo ? '' : n.servidor ? `https://lucia.ejemplo.es/${n.archivo}` : `file:///C:/Users/Lucia/Documents/${RAIZ}/${n.archivo}`;
    } else if (n.tipo === 'html') { html = n.html; navUrl.textContent = n.url; }
    else { html = '<body style="margin:0;background:#fff"></body>'; navUrl.textContent = ''; }
    if (html !== htmlCargado) {
      htmlCargado = html;
      cargando = new Promise(res => { iframe.onload = () => { prepararVista(); res(); }; });
      iframe.srcdoc = html;
    }
  }
  function prepararVista() {
    const d = iframe.contentDocument;
    if (!d) return;
    if (E.semantica) d.documentElement.classList.add('tw-sem');
    const t = d.title && d.title.trim();
    navTitulo.textContent = E.nav.tipo === 'archivo' ? (t || E.nav.archivo || 'Sin título') : (t || E.nav.url);
    // enlaces y formularios: los gestiona la escena (así funcionan sin servidor)
    d.addEventListener('click', ev => {
      const a = ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      ev.preventDefault();
      const href = a.getAttribute('href');
      if (/^(https?:)?\/\//.test(href)) burbuja(`Se abriría ${href}${a.target === '_blank' ? ' en una pestaña nueva' : ''}`, { el: a, doc: true });
      else if (/^mailto:/.test(href)) burbuja('Se abriría el programa de correo', { el: a, doc: true });
      else if (href.startsWith('#')) {}
      else { E.nav = { tipo: 'archivo', archivo: decodeURI(href) }; pintarNavegador(); }
    });
    d.addEventListener('submit', ev => { ev.preventDefault(); enviarFormulario(ev.target); }, true);
  }
  function pagina404(ruta) {
    return `<body style="font:16px Arial;margin:30px;color:#333"><h1 style="font-size:22px">No se puede acceder a este archivo</h1><p>Es posible que se haya movido, editado o eliminado.</p><p style="color:#888">ERR_FILE_NOT_FOUND · ${escH(String(ruta || ''))}</p></body>`;
  }
  function enviarFormulario(form) {
    for (const c of form.elements) {
      if (c.required && ((c.type === 'checkbox' && !c.checked) || (c.type !== 'checkbox' && !c.value))) {
        burbuja(c.type === 'checkbox' ? 'Marca esta casilla si quieres continuar' : 'Completa este campo', { el: c, doc: true }, 'peligro');
        return false;
      }
    }
    const datos = [...new FormData(form).entries()];
    E.nav = { tipo: 'html', url: 'servidor-del-instituto.es/enviar', html: `<body style="font:16px Arial;margin:24px"><h2 style="font-size:20px">Datos que han llegado al servidor</h2>
      <table style="border-collapse:collapse">${datos.map(([k, v]) => `<tr><td style="border:1px solid #bbb;padding:4px 10px"><b>${escH(k)}</b></td><td style="border:1px solid #bbb;padding:4px 10px">${escH(String(v))}</td></tr>`).join('')}</table>
      <p style="color:#666;margin-top:14px">Los campos sin <b>name</b> no aparecen: no se envían.</p></body>` };
    pintarNavegador();
    return true;
  }
  const vistaLista = () => cargando || Promise.resolve();

  // DevTools (F12): el árbol de elementos del fichero que se ve
  function pintarDevtools() {
    devtools.hidden = !E.devtools;
    navegador.classList.toggle('con-devtools', E.devtools);
    if (!E.devtools) return;
    const cod = E.nav.tipo === 'archivo' ? E.archivos.get(E.nav.archivo) || '' : '';
    let prof = 0;
    const filas = [];
    for (const t of trocear(cod)) {
      if (t.tipo === 'apertura') {
        const at = Object.entries(t.attrs).map(([k, v]) => ` <span class="c-atr">${k}</span>${v.sinValor ? '' : `=<span class="c-val">"${escH(v.valor)}"</span>`}`).join('');
        const f = h('div.tw-dt-fila', { style: `padding-left:${8 + prof * 14}px`, 'data-linea': t.linea });
        f.innerHTML = `<span class="c-pun">&lt;</span><span class="c-eti">${t.nombre}</span>${at}<span class="c-pun">&gt;</span>`;
        filas.push(f);
        if (!VACIOS.has(t.nombre) && !t.autocierre) prof++;
      } else if (t.tipo === 'cierre') prof = Math.max(0, prof - 1);
      else if (t.tipo === 'texto' && t.texto.trim()) {
        const f = h('div.tw-dt-fila.txt', { style: `padding-left:${8 + prof * 14}px` }, '"' + t.texto.trim().slice(0, 40) + '"');
        filas.push(f);
      }
    }
    devtools.replaceChildren(h('div.tw-dt-tabs', h('b', 'Elementos'), h('span', 'Consola'), h('span', 'Red')), h('div.tw-dt-arbol', filas));
  }

  /* ---------- Efectos ---------- */
  function despues(ms, fn) { const t = setTimeout(() => { temporizadores.delete(t); fn(); }, ms); temporizadores.add(t); }
  // Coordenadas (dentro de la escena) de algo: {linea}, {css, i}, {el, doc}, 'pestana', 'url', 'explorador'
  function punto(o) {
    const base = escena.getBoundingClientRect();
    let r;
    if (o === 'pestana') r = navTitulo.getBoundingClientRect();
    else if (o === 'url') r = navUrl.getBoundingClientRect();
    else if (o === 'explorador') r = explorador.getBoundingClientRect();
    else if (o.linea) { const l = codigoEl.children[o.linea - 1]; r = l ? l.getBoundingClientRect() : codigoEl.getBoundingClientRect(); if (l) r = { left: r.left + 40, top: r.top, width: Math.min(260, r.width - 60), height: r.height }; }
    else if (o.css || o.el) {
      const d = iframe.contentDocument;
      const e = o.el || (d && d.querySelectorAll(o.css)[o.i || 0]);
      if (!e) return { x: base.width * 0.7, y: base.height * 0.3 };
      const f = iframe.getBoundingClientRect(), q = e.getBoundingClientRect();
      r = { left: f.left + q.left, top: f.top + q.top, width: q.width, height: q.height };
      if (r.top < f.top) r.top = f.top + 10;
      if (r.top > f.bottom - 10) r.top = f.bottom - 30;
    } else if (o.dom) r = o.dom.getBoundingClientRect();
    if (!r) return { x: base.width / 2, y: base.height / 2 };
    return { x: r.left - base.left + Math.min(r.width, 300) / 2, y: r.top - base.top };
  }
  function burbuja(texto, donde, tipo = '', ms = 2600) {
    if (velocidad.instantaneo) return;
    const p = punto(donde);
    const b = h('div.am-burbuja' + (tipo ? '.' + tipo : ''), h('span', texto));
    b.style.transform = `translate(${Math.max(120, Math.min(escena.clientWidth - 120, p.x))}px, ${Math.max(40, p.y - 4)}px)`;
    capa.append(b);
    despues(ms * velocidad.factor, () => b.remove());
  }
  function marcar(donde, ms = 1800) {
    if (velocidad.instantaneo) return;
    const d = iframe.contentDocument;
    const els = donde.css ? [...(d ? d.querySelectorAll(donde.css) : [])] : donde.el ? [donde.el] : [];
    els.forEach(e => e.classList.add('tw-marca'));
    despues(ms * velocidad.factor, () => els.forEach(e => e.classList.remove('tw-marca')));
  }
  async function moverRaton(donde, ms = 700) {
    if (velocidad.instantaneo) return;
    const p = punto(donde);
    const x0 = parseFloat(raton.dataset.x || escena.clientWidth * 0.6), y0 = parseFloat(raton.dataset.y || escena.clientHeight * 0.6);
    const x1 = p.x, y1 = p.y + 10;
    raton.classList.add('visible');
    await animar(ms, t => {
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * 30;
      raton.style.transform = `translate(${x}px, ${y}px)`;
      raton.dataset.x = x; raton.dataset.y = y;
    });
  }
  async function clic(donde) {
    if (velocidad.instantaneo) return;
    await moverRaton(donde);
    raton.classList.remove('clic'); void raton.offsetWidth; raton.classList.add('clic');
    await esperar(180);
  }
  function confeti() {
    if (velocidad.instantaneo) return;
    for (let i = 0; i < 60; i++) {
      const c = h('i.tw-confeti');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = ['#ff6a3d', '#ffd23f', '#4a86e8', '#3fbf6a', '#8b6fe0'][i % 5];
      c.style.animationDelay = Math.random() * 0.6 + 's';
      capa.append(c);
      despues(3200, () => c.remove());
    }
  }

  /* ---------- Edición de ficheros ---------- */
  const ctx = {
    get E() { return E; },
    get iframe() { return iframe; },
    burbuja, marcar, confeti,
    raton: moverRaton, clic,
    esperar,
    validar,
    get rapido() { return velocidad.instantaneo; },
    vistaLista,
    lineaDe(nombre, texto, desde = 0) {
      const c = E.archivos.get(nombre) || '';
      const i = c.indexOf(texto, desde);
      return i < 0 ? 1 : c.slice(0, i).split('\n').length;
    },
    async carpeta(nombre, ficheros = []) {
      E.carpetas.set(nombre, ficheros.slice());
      pintarExplorador();
      if (!velocidad.instantaneo) { explorador.lastElementChild?.classList.add('aparece'); await esperar(400); }
    },
    async nuevo(nombre, contenido = '') {
      E.archivos.set(nombre, contenido);
      if (!E.pestanas.includes(nombre)) E.pestanas.push(nombre);
      E.abierto = nombre; E.resalte = null; E.cursor = 0;
      pintarExplorador(); pintarPestanas(); pintarCodigo();
      if (!velocidad.instantaneo) { [...explorador.children].find(li => li.textContent === nombre)?.classList.add('aparece'); await esperar(500); }
    },
    async abrir(nombre) {
      if (!E.pestanas.includes(nombre)) E.pestanas.push(nombre);
      E.abierto = nombre; E.resalte = null; E.cursor = null;
      pintarExplorador(); pintarPestanas(); pintarCodigo();
      if (!velocidad.instantaneo) await esperar(300);
    },
    async renombrar(viejo, nuevo) {
      const c = E.archivos.get(viejo);
      const m = new Map(); for (const [k, v] of E.archivos) m.set(k === viejo ? nuevo : k, v); E.archivos = m;
      E.pestanas = E.pestanas.map(p => p === viejo ? nuevo : p);
      if (E.abierto === viejo) E.abierto = nuevo;
      void c; pintarExplorador(); pintarPestanas();
    },
    // Escribe texto (con animación de tecleo) después del ancla, o al final si no hay ancla
    async escribir(nombre, ancla, texto, { antes = false, ms } = {}) {
      if (E.abierto !== nombre) await ctx.abrir(nombre);
      const c = E.archivos.get(nombre) || '';
      let pos = c.length;
      if (ancla !== null && ancla !== undefined) {
        const i = c.indexOf(ancla);
        if (i < 0) throw new Error(`No encuentro «${ancla}» en ${nombre}`);
        pos = antes ? i : i + ancla.length;
      }
      const a = c.slice(0, pos), b = c.slice(pos);
      E.sinGuardar.add(nombre); pintarPestanas();
      const dur = ms || Math.min(1800, 260 + texto.length * 14);
      await animar(dur, t => {
        const k = Math.round(texto.length * t);
        E.archivos.set(nombre, a + texto.slice(0, k) + b);
        E.resalte = [pos, pos + k]; E.cursor = pos + k;
        pintarCodigo();
      }, ease.lineal);
      E.resalte = [pos, pos + texto.length];
      pintarCodigo();
      return { linea: a.split('\n').length };
    },
    // Cambia un trozo: lo selecciona, lo borra y escribe el nuevo
    async cambiar(nombre, viejo, nuevo) {
      if (E.abierto !== nombre) await ctx.abrir(nombre);
      const c = E.archivos.get(nombre);
      const i = c.indexOf(viejo);
      if (i < 0) throw new Error(`No encuentro «${viejo}» en ${nombre}`);
      E.resalte = [i, i + viejo.length]; E.cursor = i; pintarCodigo();
      if (!velocidad.instantaneo) { codigoEl.querySelectorAll('.nueva').forEach(x => x.classList.add('seleccion')); await esperar(450); }
      E.archivos.set(nombre, c.slice(0, i) + c.slice(i + viejo.length));
      E.resalte = null; pintarCodigo();
      const base = E.archivos.get(nombre);
      const a = base.slice(0, i), b = base.slice(i);
      E.sinGuardar.add(nombre); pintarPestanas();
      await animar(Math.min(1400, 200 + nuevo.length * 16), t => {
        const k = Math.round(nuevo.length * t);
        E.archivos.set(nombre, a + nuevo.slice(0, k) + b);
        E.resalte = [i, i + k]; E.cursor = i + k; pintarCodigo();
      }, ease.lineal);
      return { linea: a.split('\n').length };
    },
    // Pega de golpe (Emmet ! + Tab, copiar y pegar)
    async pegar(nombre, ancla, texto, { antes = false } = {}) {
      if (E.abierto !== nombre) await ctx.abrir(nombre);
      const c = E.archivos.get(nombre) || '';
      let pos = c.length;
      if (ancla !== null && ancla !== undefined) { const i = c.indexOf(ancla); if (i < 0) throw new Error(`No encuentro «${ancla}»`); pos = antes ? i : i + ancla.length; }
      E.archivos.set(nombre, c.slice(0, pos) + texto + c.slice(pos));
      E.resalte = [pos, pos + texto.length]; E.cursor = pos + texto.length; E.sinGuardar.add(nombre);
      pintarPestanas(); pintarCodigo();
      if (!velocidad.instantaneo) await esperar(500);
    },
    // Sustituye el contenido sin animación (para preparar un error y luego deshacerlo)
    poner(nombre, contenido) { E.archivos.set(nombre, contenido); if (E.abierto === nombre) pintarCodigo(); },
    async guardar() {
      if (!velocidad.instantaneo) { burbuja('Ctrl + S', { dom: pestanasEd }, '', 1400); await esperar(350); }
      E.sinGuardar.clear(); E.resalte = null; E.cursor = null; pintarPestanas(); pintarCodigo();
    },
    // El navegador abre (o recarga, F5) un fichero
    async ver(nombre, { servidor = false } = {}) {
      E.nav = { tipo: 'archivo', archivo: nombre, servidor };
      htmlCargado = null;
      if (!velocidad.instantaneo) navegador.classList.add('recargando');
      pintarNavegador(); pintarDevtools();
      if (!velocidad.instantaneo) { await vistaLista(); await esperar(250); navegador.classList.remove('recargando'); }
    },
    async verHtml(url, html) {
      E.nav = { tipo: 'html', url, html };
      pintarNavegador(); pintarDevtools();
      if (!velocidad.instantaneo) await vistaLista();
    },
    semantica(on) { E.semantica = on; const d = iframe.contentDocument; if (d) d.documentElement.classList.toggle('tw-sem', on); },
    devtools(on) { E.devtools = on; pintarDevtools(); },
    async inspeccionar(i) {
      if (velocidad.instantaneo) return;
      const f = devtools.querySelectorAll('.tw-dt-fila')[i];
      if (!f) return;
      await moverRaton({ dom: f });
      f.classList.add('hover');
      despues(1600, () => f.classList.remove('hover'));
    },
    async narrar(frases) {
      if (velocidad.instantaneo) return;
      narrador.hidden = false;
      for (const [texto, donde] of frases) {
        narrador.replaceChildren(h('b', '🔊 Narrador'), h('span', texto));
        if (donde) marcar(donde, 1200);
        await esperar(1300);
      }
      await esperar(500);
      narrador.hidden = true;
    },
    // Simula enviar el formulario de la vista
    enviar() { const f = iframe.contentDocument?.querySelector('form'); return f ? enviarFormulario(f) : false; },
    doc: () => iframe.contentDocument,
  };

  /* ---------- Pasos ---------- */
  async function construir(n) {
    const mia = ++generacion;
    cancelarAnimaciones();
    capa.replaceChildren(); raton.classList.remove('visible'); narrador.hidden = true;
    E = estadoNuevo();
    ocupado = true;
    await alMomento(async () => { for (let i = 0; i < n; i++) await PASOS[i].hacer(ctx); });
    if (mia !== generacion) return false;
    E.resalte = null; E.cursor = null;
    hecho = n; ocupado = false;
    pintarTodo();
    refrescar();
    return true;
  }
  async function hacerPaso(i) {
    if (ocupado) return;
    const mia = generacion;
    ocupado = true; mensajeMal = null; refrescar();
    try { await PASOS[i].hacer(ctx); } catch (e) { console.error(e); }
    if (mia !== generacion) return;
    raton.classList.remove('visible');
    hecho = i + 1; ocupado = false;
    refrescar();
  }
  async function verMal() {
    const p = PASOS[hecho];
    if (ocupado || !p || !p.mal) return;
    const mia = generacion;
    ocupado = true; mensajeMal = p; refrescar();
    try { await p.mal(ctx); await esperar(1200); } catch (e) { console.error(e); }
    if (mia !== generacion) return;
    await construir(hecho);
    mensajeMal = p; refrescar();
  }
  const siguiente = () => { if (ocupado) return; if (hecho >= PASOS.length) construir(0); else hacerPaso(hecho); };
  const anterior = () => { if (!ocupado && hecho > 0) construir(hecho - 1); };
  async function repetir() { if (ocupado || !hecho) return; const n = hecho; if (await construir(n - 1)) hacerPaso(n - 1); }
  async function irA(i) { if (ocupado && i !== hecho) { generacion++; ocupado = false; } if (await construir(i)) hacerPaso(i); }

  function refrescar() {
    const p = PASOS[hecho];
    barra.classList.toggle('error', !!mensajeMal);
    if (mensajeMal) {
      cPaso.textContent = `Paso ${hecho + 1} de ${PASOS.length} · Así NO`;
      cTitulo.textContent = mensajeMal.tituloMal; cTexto.textContent = mensajeMal.textoMal;
    } else if (p) {
      cPaso.textContent = `Paso ${hecho + 1} de ${PASOS.length} · ${SESIONES[p.sesion]}`;
      cTitulo.textContent = p.nombre; cTexto.textContent = p.texto;
    } else {
      cPaso.textContent = 'Terminado';
      cTitulo.textContent = '¡Sitio web terminado!';
      cTexto.textContent = 'Cuatro páginas enlazadas con el mismo menú, imágenes con alt, una tabla, un formulario con sus label, vídeo, etiquetas semánticas y sin errores en el validador. Es la lista de comprobación del apartado 4.1.';
    }
    bAnt.disabled = ocupado || hecho === 0;
    bRep.disabled = ocupado || hecho === 0;
    bSig.disabled = ocupado;
    bSig.textContent = p ? 'Siguiente ▶' : 'Volver a empezar';
    bMal.hidden = !p || !p.mal;
    bMal.disabled = ocupado;
    let sesion = -1;
    const items = [];
    PASOS.forEach((q, i) => {
      if (q.sesion !== sesion) { sesion = q.sesion; items.push(h('li.tw-sesion', SESIONES[sesion])); }
      items.push(h('li' + (i < hecho ? '.hecho' : i === hecho ? '.actual' : ''),
        h('button', { type: 'button', onclick: () => irA(i) }, h('span.am-num', i < hecho ? '✓' : String(i + 1)), h('span', q.nombre))));
    });
    lista.replaceChildren(...items);
    const act = lista.querySelector('.actual');
    if (act) {
      const top = act.offsetTop - pasosEl.offsetTop;
      if (top < pasosEl.scrollTop + 30 || top > pasosEl.scrollTop + pasosEl.clientHeight - 60) pasosEl.scrollTop = top - pasosEl.clientHeight / 2;
    }
  }

  function cambiarVelocidad() {
    velocidad.factor = velocidad.factor === 1 ? LENTO : 1;
    const lento = velocidad.factor !== 1;
    escena.style.setProperty('--am-vel', velocidad.factor);
    bVel.textContent = 'Velocidad: ' + (lento ? 'lenta' : 'normal');
    bVel.setAttribute('aria-pressed', String(lento));
  }
  async function alternarClase() {
    clase = !clase;
    escena.classList.toggle('clase', clase);
    bClase.textContent = clase ? '✕ Salir' : '⛶ Modo clase';
    try {
      if (clase && escena.requestFullscreen) await escena.requestFullscreen();
      else if (!clase && document.fullscreenElement) await document.exitFullscreen();
    } catch (e) {}
  }
  function alCambiarPantalla() { if (!document.fullscreenElement && clase) { clase = false; escena.classList.remove('clase'); bClase.textContent = '⛶ Modo clase'; } }

  bSig.addEventListener('click', siguiente);
  bAnt.addEventListener('click', anterior);
  bRep.addEventListener('click', repetir);
  bMal.addEventListener('click', verMal);
  bVel.addEventListener('click', cambiarVelocidad);
  bClase.addEventListener('click', alternarClase);
  function alTeclado(ev) {
    if (ev.target.closest && ev.target.closest('input, textarea, select')) return;
    if (!escena.isConnected) return;
    const k = ev.key.toLowerCase();
    if (['arrowright', 'pagedown', ' '].includes(k)) { ev.preventDefault(); siguiente(); }
    else if (['arrowleft', 'pageup'].includes(k)) { ev.preventDefault(); anterior(); }
    else if (k === 'r') repetir();
    else if (k === 'm') verMal();
    else if (k === 'l') cambiarVelocidad();
    else if (k === 'f') alternarClase();
    else if (k === 'escape' && clase) alternarClase();
  }

  return {
    el,
    montado() {
      addEventListener('keydown', alTeclado);
      document.addEventListener('fullscreenchange', alCambiarPantalla);
      const bucle = t => { actualizarAnimaciones(t); raf = requestAnimationFrame(bucle); };
      raf = requestAnimationFrame(bucle);
      construir(0);
    },
    destruir() {
      generacion++;
      cancelarAnimaciones(); velocidad.factor = 1;
      cancelAnimationFrame(raf);
      temporizadores.forEach(clearTimeout);
      removeEventListener('keydown', alTeclado);
      document.removeEventListener('fullscreenchange', alCambiarPantalla);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    },
  };
}
