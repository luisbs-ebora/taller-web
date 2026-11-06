// inicio.js — Portada del Taller Web.
import { h } from '../util.js';

export function vistaInicio() {
  const tarjeta = (href, num, titulo, texto, extra) => h('a.tarjeta.leccion-card', { href },
    h('span.num', num), h('h3', titulo), h('p', texto), extra ? h('span.estado.chip', extra) : null);
  return { el: h('section',
    h('div.inicio-cab',
      h('span.etiqueta', 'Aplicaciones web · 1.º SMR · Tema 2'),
      h('h1', 'Taller Web'),
      h('p.lead', 'Cómo se hace una página web con HTML, de la carpeta vacía a un sitio completo. Lo ves escribir en Visual Studio Code y aparecer en el navegador, y en cada paso puedes ver qué pasa si lo haces mal.')),
    h('div.rejilla', { style: 'margin-top:28px' },
      tarjeta('#/clase', '1', 'Mi primer sitio web', 'Las cuatro sesiones del tema en 18 pasos: esqueleto, etiquetas, imagen, enlaces, tabla, formulario, vídeo, HTML5, F12, validador y accesibilidad.', '18 pasos'),
      tarjeta('#/practica', '2', 'Arregla la página', 'Una página con 5 errores escondidos. Encuéntralos, corrígelos y pásala por el validador hasta que salga en verde.', 'Sin nota'))) };
}
