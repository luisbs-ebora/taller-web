// indice.js — Qué hay en el taller, por tema. De aquí salen el menú lateral, la portada y la página de cada tema.
// Para añadir una actividad o un tema, basta con añadirlo aquí.
export const INDICE = {
  clave: 'taller-web',
  grupos: [
    { rotulo: '1.º SMR · Aplicaciones web', temas: [
      { id: 't2', n: 'Tema 2', titulo: 'Páginas web con HTML',
        resumen: 'Cómo se hace una página web con HTML, de la carpeta vacía a un sitio completo, y cómo encontrar y corregir sus errores.',
        items: [
          { href: '#/clase', titulo: 'Mi primer sitio web', texto: 'Las cuatro sesiones del tema en 18 pasos: esqueleto, etiquetas, imagen, enlaces, tabla, formulario, vídeo, HTML5, F12, validador y accesibilidad.', chip: '18 pasos' },
          { href: '#/practica', titulo: 'Arregla la página', texto: 'Una página con 5 errores escondidos. Encuéntralos, corrígelos y pásala por el validador hasta que salga en verde.', chip: 'Sin nota' }
        ] },
      { id: 't3', n: 'Tema 3', titulo: 'Hojas de estilo con CSS',
        resumen: 'Dar forma a la página con una hoja de estilos: selectores, colores, medidas y cajas.',
        items: [
          { href: '#/css', titulo: 'Iguala la página (CSS)', texto: 'El HTML está bien, pero la hoja de estilos tiene 5 fallos: selectores, unidades, puntos y comas… Corrígela hasta que tu página se vea como el modelo.', chip: 'Sin nota' }
        ] }
    ] }
  ]
};
