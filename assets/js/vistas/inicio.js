// inicio.js — Portada del Taller Web.
import { h } from '../util.js';

// Dibujo de la portada: el editor a la izquierda y el navegador a la derecha
function dibujo() {
  const d = document.createElement('div');
  d.innerHTML = `<svg class="tw-heroe-dibujo" viewBox="0 0 460 300" role="img" aria-label="Dibujo de un editor de código y un navegador">
    <g stroke="#1d1b24" stroke-width="4" stroke-linejoin="round">
      <rect x="10" y="30" width="250" height="210" rx="16" fill="#1f1f1f"/>
      <path d="M10 46a16 16 0 0 1 16-16h218a16 16 0 0 1 16 16v14H10z" fill="#37405a"/>
      <g class="flota"><rect x="196" y="70" width="254" height="200" rx="16" fill="#fffaf0"/>
      <path d="M196 86a16 16 0 0 1 16-16h222a16 16 0 0 1 16 16v16H196z" fill="#dee1e6"/>
      <rect x="216" y="122" width="130" height="16" rx="4" fill="#1d1b24" stroke="none"/>
      <rect x="216" y="150" width="200" height="9" rx="4" fill="#9aa3b2" stroke="none"/>
      <rect x="216" y="168" width="170" height="9" rx="4" fill="#9aa3b2" stroke="none"/>
      <rect x="216" y="192" width="90" height="56" rx="8" fill="#ffd23f"/>
      <rect x="320" y="192" width="110" height="56" rx="8" fill="#4a86e8"/></g>
    </g>
    <g fill="#ff5f57"><circle cx="30" cy="45" r="5"/></g><circle cx="46" cy="45" r="5" fill="#febc2e"/><circle cx="62" cy="45" r="5" fill="#28c840"/>
    <g font-family="JetBrains Mono, monospace" font-size="15" font-weight="500">
      <text x="28" y="90" fill="#808080">&lt;<tspan fill="#569cd6">h1</tspan>&gt;</text>
      <text x="28" y="116" fill="#d4d4d4">  Hola</text>
      <text x="28" y="142" fill="#808080">&lt;/<tspan fill="#569cd6">h1</tspan>&gt;</text>
      <text x="28" y="168" fill="#808080">&lt;<tspan fill="#569cd6">p</tspan>&gt;</text>
      <text x="28" y="194" fill="#6a9955">&lt;!-- ... --&gt;</text>
    </g>
    <g stroke="#1d1b24" stroke-width="4" stroke-linejoin="round"><circle cx="196" cy="34" r="24" fill="#ff6a3d"/><path d="M186 26l-7 8 7 8M206 26l7 8-7 8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>
  </svg>`;
  return d.firstElementChild;
}

export function vistaInicio() {
  const tarjeta = (href, num, titulo, texto, extra) => h('a.tarjeta.leccion-card', { href },
    h('span.num', num), h('h3', titulo), h('p', texto), extra ? h('span.estado.chip', extra) : null);
  return { el: h('section',
    h('div.tw-heroe',
      h('div.inicio-cab',
        h('span.etiqueta', 'Aplicaciones web · 1.º SMR · Tema 2'),
        h('h1', 'Taller ', h('span', 'Web')),
        h('p.lead', 'Cómo se hace una página web con HTML, de la carpeta vacía a un sitio completo. Lo ves escribir en Visual Studio Code y aparecer en el navegador, y en cada paso puedes ver qué pasa si lo haces mal.')),
      dibujo()),
    h('div.rejilla', { style: 'margin-top:28px' },
      tarjeta('#/clase', '1', 'Mi primer sitio web', 'Las cuatro sesiones del tema en 18 pasos: esqueleto, etiquetas, imagen, enlaces, tabla, formulario, vídeo, HTML5, F12, validador y accesibilidad.', '18 pasos'),
      tarjeta('#/practica', '2', 'Arregla la página', 'Una página con 5 errores escondidos. Encuéntralos, corrígelos y pásala por el validador hasta que salga en verde.', 'Sin nota'))) };
}
