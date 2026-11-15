// iguala.js — «Iguala la página»: práctica de CSS sin nota. El HTML está bien; la hoja de estilos tiene 5 fallos.
import { h } from '../util.js';
import { HTML, CSS_BIEN, documento, crearEjercicio, comparar } from '../web/iguala.js';

export function vistaIguala() {
  let ej, temporizador = 0, pistas = new Set(), listos = { modelo: false, alumno: false };
  const gutter = h('pre.tw-gutter', { 'aria-hidden': 'true' });
  const area = h('textarea.tw-area', { spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Hoja de estilos CSS de la página' });
  const marco = titulo => h('iframe.tw-vista-p', { title: titulo, sandbox: 'allow-same-origin' });
  const modelo = marco('Así debe quedar'), alumno = marco('Tu página');
  const tarjetas = h('ol.tw-errores'), estado = h('p.tw-estado', { 'aria-live': 'polite' }), final = h('p.tw-contador');

  function numerar() { gutter.textContent = Array.from({ length: area.value.split('\n').length }, (_, i) => i + 1).join('\n'); gutter.scrollTop = area.scrollTop; }
  function evaluar() {
    if (!ej || !listos.modelo || !listos.alumno || !modelo.contentDocument || !alumno.contentDocument) return;
    const hechos = comparar(ej.fallos, modelo.contentDocument, alumno.contentDocument), n = hechos.filter(Boolean).length;
    estado.textContent = `${n} de ${ej.fallos.length} diferencias arregladas`;
    tarjetas.replaceChildren(...ej.fallos.map((f, i) => {
      const li = h('li' + (hechos[i] ? '.ok' : ''), h('b', hechos[i] ? `✓ Diferencia ${i + 1}: arreglada` : `Diferencia ${i + 1}`), h('p', f.nota));
      if (!hechos[i]) li.append(pistas.has(i) ? h('p.tw-sol', f.pista) : h('div.tw-botones-error', h('button.btn.sec.peq', { type: 'button', onclick: () => { pistas.add(i); evaluar(); } }, 'Pista')));
      return li;
    }));
    final.replaceChildren(n === ej.fallos.length ? h('span.tw-bien', `¡Página igualada! ${pistas.size ? `Has usado ${pistas.size} pista${pistas.size === 1 ? '' : 's'}.` : 'Sin usar ninguna pista.'} Prueba con otra.`) : '');
  }
  for (const [marcoX, clave] of [[modelo, 'modelo'], [alumno, 'alumno']]) marcoX.addEventListener('load', () => {
    listos[clave] = true;
    const d = marcoX.contentDocument;
    if (d) d.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('a')) ev.preventDefault(); });
    evaluar();
  });
  function pintarAlumno() { listos.alumno = false; alumno.srcdoc = documento(area.value); }
  function nuevo() {
    ej = crearEjercicio(); pistas = new Set();
    area.value = ej.css; numerar();
    listos.modelo = false; modelo.srcdoc = documento(CSS_BIEN);
    pintarAlumno();
  }
  area.addEventListener('input', () => { numerar(); clearTimeout(temporizador); temporizador = setTimeout(pintarAlumno, 350); });
  area.addEventListener('scroll', () => { gutter.scrollTop = area.scrollTop; });
  area.addEventListener('keydown', ev => { if (ev.key === 'Tab' && !ev.shiftKey) { ev.preventDefault(); area.setRangeText('  ', area.selectionStart, area.selectionEnd, 'end'); area.dispatchEvent(new Event('input')); } });

  const el = h('section.tw-practica',
    h('div.am-cab', h('div',
      h('span.etiqueta', 'Práctica de CSS · sin nota'),
      h('h1', 'Iguala la página'),
      h('p.lead', 'El HTML de esta página está bien, pero en su hoja de estilos se han colado 5 fallos. Compara tu página con el modelo, busca el fallo en el CSS y corrígelo hasta que las dos se vean igual. No toques el HTML: no hace falta.'))),
    h('div.tw-p-barra',
      h('button.btn', { type: 'button', onclick: nuevo }, 'Nueva página'),
      h('button.btn.sec', { type: 'button', onclick: () => { area.value = ej.css; pistas.clear(); numerar(); pintarAlumno(); } }, 'Volver a empezar esta'), estado),
    h('div.tw-p-rejilla.tw-ig',
      h('div.tw-p-editor', h('div.tw-p-cab', h('span.ico.css'), 'estilos.css'), h('div.tw-p-codigo', gutter, area)),
      h('div.tw-ig-vistas',
        h('div.tw-p-vista', h('p.tw-ig-rotulo', 'Así debe quedar'), modelo),
        h('div.tw-p-vista', h('p.tw-ig-rotulo.tuya', 'Tu página'), alumno))),
    h('div.tw-p-abajo',
      h('div', h('h2', 'El HTML (no hay que tocarlo)'), h('pre.tw-ig-html', HTML)),
      h('div', h('h2', 'Las 5 diferencias'), h('p.tw-nota', 'Se marcan en verde cuando tu página queda igual que el modelo en ese punto.'), tarjetas, final)));
  return { el, montado: nuevo, destruir() { clearTimeout(temporizador); } };
}
