// main.js — Enrutador de la web (rutas con #/…). Cada vista devuelve { el, montado?, destruir? }.
import { h } from './util.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaEscena } from './web/escena.js';
import { vistaPractica } from './vistas/practica.js';

const main = document.getElementById('contenido');
let actual = null;

function vistaCreditos() {
  return { el: h('section.contenido', { style: 'max-width:72ch' },
    h('h1', 'Créditos'),
    h('p', 'Contenido: Tema 2 «Creación de páginas web con HTML y XHTML» del módulo Aplicaciones web (1.º SMR).'),
    h('p', 'El editor y el navegador de la clase animada son dibujos: imitan Visual Studio Code y un navegador, pero no son esos programas. El validador es una simulación sencilla del validador del W3C (validator.w3.org): para entregar, valida siempre en la web oficial.'),
    h('p', 'Lucía Martín, las recetas, el grupo, la tienda y el videojuego de la práctica son inventados. Las direcciones que acaban en ejemplo.es no existen.')) };
}

const RUTAS = [
  [/^$/, () => vistaInicio()],
  [/^creditos$/, () => vistaCreditos()],
  [/^clase$/, () => vistaEscena()],
  [/^practica$/, () => vistaPractica()],
];

let turno = 0;
async function navegar() {
  const mio = ++turno;
  const ruta = decodeURIComponent(location.hash.replace(/^#\/?/, '')).replace(/\/$/, '');
  if (actual && actual.destruir) { try { actual.destruir(); } catch (e) { console.error(e); } }
  actual = null;
  main.replaceChildren(h('div.cargando', 'Cargando…'));
  const seccion = ruta === '' ? 'inicio' : ruta.split('/')[0];
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.dataset.ruta === seccion) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  try {
    const r = RUTAS.find(([re]) => re.test(ruta));
    if (!r) throw new Error('Esta página no existe.');
    const vista = await r[1](ruta.match(r[0]));
    if (mio !== turno) { if (vista && vista.destruir) vista.destruir(); return; }
    actual = vista;
    main.replaceChildren(actual.el);
    if (actual.montado) actual.montado();
  } catch (e) {
    if (mio !== turno) return;
    console.error(e);
    main.replaceChildren(h('div.aviso', h('h2', 'Algo no ha ido bien'), h('p', e.message), h('a.btn', { href: '#/' }, 'Volver al inicio')));
  }
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

window.addEventListener('hashchange', navegar);
navegar();
