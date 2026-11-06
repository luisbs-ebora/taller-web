// practica.js — «Arregla la página»: práctica sin nota. Una página con 5 errores escondidos.
import { h, progreso } from '../util.js';
import { TEMAS, crearEjercicio, corregir } from '../web/arregla.js';
import { paginaDe } from '../web/escena.js';

const CLAVE = 'arregla';

export function vistaPractica() {
  let ej, temporizador = 0, pistasVistas = new Set(), solucionesVistas = new Set();

  const selTema = h('select#tw-tema', { 'aria-label': 'Tema de la página' },
    h('option', { value: '' }, 'Tema al azar'), TEMAS.map(t => h('option', { value: t.id }, t.nombre)));
  const bNueva = h('button.btn', { type: 'button' }, 'Nueva página');
  const bReiniciar = h('button.btn.sec', { type: 'button' }, 'Volver a empezar esta');
  const gutter = h('pre.tw-gutter', { 'aria-hidden': 'true' });
  const area = h('textarea.tw-area', { spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Código HTML de la página' });
  const vista = h('iframe.tw-vista-p', { title: 'Vista de la página', sandbox: 'allow-same-origin' });
  const pestanaVista = h('span.tw-nav-tit', '');
  const bValidar = h('button.btn.azul', { type: 'button' }, 'Validar (como el W3C)');
  const resultados = h('div.tw-resultados', { 'aria-live': 'polite' });
  const tarjetas = h('ol.tw-errores');
  const estado = h('p.tw-estado', { 'aria-live': 'polite' });
  const contador = h('p.tw-contador');

  const el = h('section.tw-practica',
    h('div.am-cab', h('div',
      h('span.etiqueta', 'Práctica · sin nota'),
      h('h1', 'Arregla la página'),
      h('p.lead', 'Alguien ha hecho esta página con prisa y ha dejado 5 errores. Encuéntralos mirando la vista y el código, corrígelos en el editor y pasa el validador hasta que salga en verde. Si te atascas, pide una pista.'))),
    h('div.tw-p-barra', selTema, bNueva, bReiniciar, estado),
    h('div.tw-p-rejilla',
      h('div.tw-p-editor', h('div.tw-p-cab', h('span.ico.html'), 'pagina.html'), h('div.tw-p-codigo', gutter, area)),
      h('div.tw-p-vista', h('div.tw-nav-pestanas', h('div.tw-nav-pestana', h('span.tw-favicon', '◆'), pestanaVista)), vista)),
    h('div.tw-p-abajo',
      h('div', h('h2', 'Validador'), bValidar, resultados),
      h('div', h('h2', 'Los 5 errores'), h('p.tw-nota', 'Se marcan en verde cuando los arreglas.'), tarjetas, contador)));

  function nuevo(temaId) {
    ej = crearEjercicio(temaId || selTema.value || null);
    pistasVistas = new Set(); solucionesVistas = new Set();
    area.value = ej.codigo;
    resultados.replaceChildren(h('p.tw-nota', 'Pulsa «Validar» cuando quieras comprobar el código.'));
    progreso.set(CLAVE + ':borrador', { tema: ej.tema.id, ej: { codigo: ej.codigo, errores: ej.errores }, texto: area.value });
    refrescar(true);
  }
  function guardarBorrador() {
    progreso.set(CLAVE + ':borrador', { tema: ej.tema.id, ej: { codigo: ej.codigo, errores: ej.errores }, texto: area.value });
  }
  function restaurar() {
    const b = progreso.get(CLAVE + ':borrador');
    const tema = b && TEMAS.find(t => t.id === b.tema);
    if (!tema || !b.ej) return false;
    ej = { tema, original: tema.codigo, codigo: b.ej.codigo, errores: b.ej.errores };
    area.value = b.texto;
    resultados.replaceChildren(h('p.tw-nota', 'Has vuelto a la página que dejaste a medias.'));
    refrescar(true);
    return true;
  }

  function numerar() {
    const n = area.value.split('\n').length;
    gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n');
    gutter.scrollTop = area.scrollTop;
  }
  function pintarVista() {
    vista.srcdoc = paginaDe(area.value, 'pagina.html');
  }
  vista.addEventListener('load', () => {
    const d = vista.contentDocument;
    if (!d) return;
    pestanaVista.textContent = (d.title && d.title.trim()) || 'pagina.html';
    d.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('a')) ev.preventDefault(); });
    d.addEventListener('submit', ev => ev.preventDefault(), true);
  });

  function refrescar(conVista) {
    numerar();
    if (conVista) pintarVista();
    const c = corregir(ej, area.value);
    const hechos = c.errores.filter(e => e.arreglado).length;
    estado.textContent = `${ej.tema.nombre} · ${hechos} de ${ej.errores.length} errores arreglados`;
    tarjetas.replaceChildren(...c.errores.map((e, i) => {
      const li = h('li' + (e.arreglado ? '.ok' : ''));
      const cuerpo = [h('b', e.arreglado ? `✓ Error ${i + 1}: arreglado` : `Error ${i + 1}`)];
      if (!e.arreglado) {
        if (pistasVistas.has(i)) cuerpo.push(h('p', e.pista), h('p.tw-nota', `Mira cerca de la línea ${e.linea}.`));
        if (solucionesVistas.has(i)) cuerpo.push(h('p.tw-sol', e.solucion
          ? e.solucion
          : [h('span', 'Está así: '), h('code', e.mal), h('br'), h('span', 'Debería ser: '), h('code', e.bien)]));
        const botones = h('div.tw-botones-error');
        if (!pistasVistas.has(i)) botones.append(h('button.btn.sec.peq', { type: 'button', onclick: () => { pistasVistas.add(i); refrescar(); } }, 'Pista'));
        else if (!solucionesVistas.has(i)) botones.append(h('button.btn.sec.peq', { type: 'button', onclick: () => { solucionesVistas.add(i); refrescar(); } }, 'Ver solución'));
        cuerpo.push(botones);
      }
      li.append(...cuerpo);
      return li;
    }));
    if (c.faltan.length) contador.replaceChildren(h('span.tw-aviso', `Ojo: has borrado contenido (${c.faltan.map(f => `${f.falta} ${f.nombre}`).join(', ')}). Hay que arreglar los errores sin quitar nada de la página.`));
    else if (c.terminado) contador.replaceChildren(h('span.tw-bien', `¡Página arreglada! ${solucionesVistas.size ? `Has mirado ${solucionesVistas.size} solución${solucionesVistas.size === 1 ? '' : 'es'}.` : 'Sin mirar ninguna solución.'} Prueba con otra.`));
    else contador.replaceChildren();
    return c;
  }

  let anotado = false;
  function validarAhora() {
    const c = refrescar();
    if (!c.res.length) {
      resultados.replaceChildren(h('p.tw-w3c-ok', h('b', 'Document checking completed. No errors or warnings to show.'), h('br'), 'Comprobación terminada: ni errores ni avisos.'));
      if (c.terminado && !anotado) { anotado = true; progreso.anotarPractica({ tipo: CLAVE, tema: ej.tema.id, soluciones: solucionesVistas.size }); pintarCuenta(); }
      return;
    }
    const errores = c.res.filter(r => r.tipo === 'error').length;
    resultados.replaceChildren(
      h('p', h('b', `${errores} error${errores === 1 ? '' : 'es'}`), ` y ${c.res.length - errores} aviso${c.res.length - errores === 1 ? '' : 's'}. Pulsa uno para ir a su línea.`),
      h('ol.tw-w3c', c.res.map(r => h('li.w-' + r.tipo,
        h('button', { type: 'button', onclick: () => irALinea(r.linea) },
          h('b', r.tipo === 'error' ? 'Error: ' : 'Aviso: '), r.msg, h('small', `Línea ${r.linea} · ${r.explica}`))))));
  }
  function irALinea(n) {
    const lineas = area.value.split('\n');
    const ini = lineas.slice(0, n - 1).reduce((s, l) => s + l.length + 1, 0);
    area.focus();
    area.setSelectionRange(ini, ini + (lineas[n - 1] || '').length);
    const alto = parseFloat(getComputedStyle(area).lineHeight) || 20;
    area.scrollTop = Math.max(0, (n - 4) * alto);
    numerar();
  }
  const cuenta = h('p.tw-nota');
  function pintarCuenta() {
    const n = progreso.practicas().filter(p => p.tipo === CLAVE).length;
    cuenta.textContent = n ? `Páginas arregladas en este navegador: ${n}.` : '';
  }

  area.addEventListener('input', () => {
    anotado = false;
    numerar();
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { refrescar(true); guardarBorrador(); }, 350);
  });
  area.addEventListener('scroll', () => { gutter.scrollTop = area.scrollTop; });
  area.addEventListener('keydown', ev => {
    if (ev.key === 'Tab' && !ev.shiftKey) {
      ev.preventDefault();
      const s = area.selectionStart;
      area.setRangeText('  ', s, area.selectionEnd, 'end');
      area.dispatchEvent(new Event('input'));
    }
  });
  bValidar.addEventListener('click', validarAhora);
  bNueva.addEventListener('click', () => { anotado = false; nuevo(); });
  bReiniciar.addEventListener('click', () => { anotado = false; area.value = ej.codigo; solucionesVistas.clear(); pistasVistas.clear(); refrescar(true); guardarBorrador(); });
  selTema.addEventListener('change', () => { anotado = false; nuevo(); });
  el.querySelector('.tw-p-abajo > div:last-child').append(cuenta);

  return {
    el,
    montado() { if (!restaurar()) nuevo(); pintarCuenta(); },
    destruir() { clearTimeout(temporizador); if (ej) guardarBorrador(); },
  };
}
