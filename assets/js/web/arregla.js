// arregla.js — Práctica «Arregla la página»: una página bien hecha + 5 errores escondidos al azar.
import { validar, contarTodo } from './validador.js';

const pagina = (titulo, sitio, cuerpo) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
</head>
<body>
  <header>
    <p>${sitio}</p>
  </header>
${cuerpo}  <footer>
    <p>2026 · Página de prácticas de 1.º SMR</p>
  </footer>
</body>
</html>`;

export const TEMAS = [
  {
    id: 'receta', nombre: 'Una receta de cocina',
    codigo: pagina('Tortilla de patatas', 'Recetas de la abuela', `  <nav>
    <a href="index.html">Inicio</a> |
    <a href="postres.html">Postres</a>
  </nav>
  <main>
    <h1>Tortilla de patatas</h1>
    <img src="img/tortilla.jpg" alt="Tortilla de patatas cortada en triángulos" width="300">
    <p>Una receta <strong>fácil</strong> para cuatro personas.</p>
    <h2>Ingredientes</h2>
    <ul>
      <li>4 patatas medianas</li>
      <li>6 huevos</li>
      <li>Media cebolla</li>
      <li>Aceite de oliva y sal</li>
    </ul>
    <h2>Pasos</h2>
    <ol>
      <li>Pela y corta las patatas en láminas finas.</li>
      <li>Fríelas a fuego lento con la cebolla.</li>
      <li>Bate los huevos y mézclalo todo.</li>
      <li>Cuaja la tortilla por los dos lados.</li>
    </ol>
    <h2>Tiempos</h2>
    <table border="1">
      <caption>Tiempo de cada parte</caption>
      <tr>
        <th>Parte</th>
        <th>Minutos</th>
      </tr>
      <tr>
        <td>Preparación</td>
        <td>15</td>
      </tr>
      <tr>
        <td>Cocinado</td>
        <td>25</td>
      </tr>
    </table>
    <p><a href="postres.html">Ver las recetas de postres</a></p>
  </main>
`),
  },
  {
    id: 'grupo', nombre: 'Un grupo de música',
    codigo: pagina('Los Cables Sueltos', 'Los Cables Sueltos · grupo de rock', `  <nav>
    <a href="index.html">Inicio</a> |
    <a href="discos.html">Discos</a>
  </nav>
  <main>
    <h1>Los Cables Sueltos</h1>
    <img src="img/grupo.jpg" alt="Los cuatro miembros del grupo en el escenario" width="320">
    <p>Somos un grupo de rock de Talavera. Tocamos <strong>en directo</strong> desde 2022.</p>
    <h2>Miembros</h2>
    <ul>
      <li>Marta: voz</li>
      <li>Iker: guitarra</li>
      <li>Sara: bajo</li>
      <li>Dani: batería</li>
    </ul>
    <h2>Próximos conciertos</h2>
    <table border="1">
      <caption>Gira de primavera</caption>
      <tr>
        <th>Fecha</th>
        <th>Ciudad</th>
      </tr>
      <tr>
        <td>12 de marzo</td>
        <td>Toledo</td>
      </tr>
      <tr>
        <td>2 de abril</td>
        <td>Madrid</td>
      </tr>
    </table>
    <h2>Vídeo del último concierto</h2>
    <video src="video/concierto.mp4" width="400" controls>
      Tu navegador no puede reproducir este vídeo.
    </video>
    <p><a href="discos.html">Escuchar nuestros discos</a></p>
  </main>
`),
  },
  {
    id: 'bicis', nombre: 'Una tienda de bicis',
    codigo: pagina('Pedalea · Tienda de bicicletas', 'Pedalea · bicicletas y reparaciones', `  <nav>
    <a href="index.html">Inicio</a> |
    <a href="taller.html">Taller</a>
  </nav>
  <main>
    <h1>Bicicletas Pedalea</h1>
    <img src="img/bici.jpg" alt="Bicicleta de montaña roja en el escaparate" width="300">
    <p>Vendemos y <strong>reparamos</strong> bicicletas de todo tipo.</p>
    <h2>Qué vendemos</h2>
    <ul>
      <li>Bicis de montaña</li>
      <li>Bicis de paseo</li>
      <li>Cascos y luces</li>
    </ul>
    <h2>Precios del taller</h2>
    <table border="1">
      <caption>Reparaciones más pedidas</caption>
      <tr>
        <th>Reparación</th>
        <th>Precio</th>
      </tr>
      <tr>
        <td>Cambiar una cámara</td>
        <td>8 €</td>
      </tr>
      <tr>
        <td>Ajustar los frenos</td>
        <td>12 €</td>
      </tr>
    </table>
    <h2>Pide cita</h2>
    <form action="/cita" method="post">
      <p>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
      </p>
      <p>
        <label for="telefono">Teléfono:</label>
        <input type="text" id="telefono" name="telefono" required>
      </p>
      <button type="submit">Pedir cita</button>
    </form>
    <p><a href="taller.html">Ver todos los servicios del taller</a></p>
  </main>
`),
  },
  {
    id: 'jornada', nombre: 'Una noticia del instituto',
    codigo: pagina('Jornada de puertas abiertas', 'Instituto · Noticias', `  <nav>
    <a href="index.html">Inicio</a> |
    <a href="ciclos.html">Ciclos</a>
  </nav>
  <main>
    <h1>Jornada de puertas abiertas</h1>
    <img src="img/taller.jpg" alt="Alumnos de SMR enseñando el taller de montaje" width="320">
    <p>El jueves abrimos el instituto a las familias. <strong>No hace falta inscribirse.</strong></p>
    <h2>Programa</h2>
    <ol>
      <li>Bienvenida en el salón de actos</li>
      <li>Visita a los talleres</li>
      <li>Preguntas a los profesores</li>
    </ol>
    <h2>Horario</h2>
    <table border="1">
      <caption>Horario del jueves</caption>
      <tr>
        <th>Hora</th>
        <th>Actividad</th>
      </tr>
      <tr>
        <td>17:00</td>
        <td>Bienvenida</td>
      </tr>
      <tr>
        <td>17:30</td>
        <td>Visita a los talleres</td>
      </tr>
    </table>
    <h2>Déjanos tu correo</h2>
    <form action="/avisos" method="post">
      <p>
        <label for="correo">Correo:</label>
        <input type="email" id="correo" name="correo" required>
      </p>
      <button type="submit">Avisadme</button>
    </form>
    <p><a href="ciclos.html">Conoce los ciclos que se imparten</a></p>
  </main>
`),
  },
  {
    id: 'juego', nombre: 'La ficha de un videojuego',
    codigo: pagina('Robots al rescate', 'Juegos indie · fichas', `  <nav>
    <a href="index.html">Inicio</a> |
    <a href="juegos.html">Todos los juegos</a>
  </nav>
  <main>
    <h1>Robots al rescate</h1>
    <img src="img/robots.png" alt="Captura del juego: tres robots saltando entre plataformas" width="320">
    <p>Un juego de plataformas para <strong>dos jugadores</strong>.</p>
    <h2>Características</h2>
    <ul>
      <li>30 niveles</li>
      <li>Modo cooperativo</li>
      <li>Se puede jugar con mando</li>
    </ul>
    <h2>Requisitos mínimos</h2>
    <table border="1">
      <caption>Para jugar en un PC</caption>
      <tr>
        <th>Componente</th>
        <th>Mínimo</th>
      </tr>
      <tr>
        <td>Memoria RAM</td>
        <td>8 GB</td>
      </tr>
      <tr>
        <td>Disco</td>
        <td>4 GB libres</td>
      </tr>
    </table>
    <h2>Tráiler</h2>
    <video src="video/trailer.mp4" width="400" controls>
      Tu navegador no puede reproducir este vídeo.
    </video>
    <p><a href="juegos.html">Ver más juegos para dos jugadores</a></p>
  </main>
`),
  },
  {
    id: 'pizza', nombre: 'El pedido de una pizzería (formulario completo)', formulario: true,
    codigo: pagina('Pizzería La Leña · Pedidos', 'Pizzería La Leña', `  <nav>
    <a href="index.html">Inicio</a> |
    <a href="carta.html">Carta</a>
  </nav>
  <main>
    <h1>Haz tu pedido</h1>
    <img src="img/pizza.jpg" alt="Pizza margarita recién salida del horno de leña" width="300">
    <p>Rellena el formulario y te avisamos <strong>cuando esté lista</strong>.</p>
    <h2>Las más pedidas</h2>
    <ul>
      <li>Margarita</li>
      <li>Cuatro quesos</li>
      <li>Barbacoa</li>
    </ul>
    <h2>Tu pedido</h2>
    <form action="/pedido" method="post">
      <p>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
      </p>
      <p>
        <label for="correo">Correo:</label>
        <input type="email" id="correo" name="correo" required>
      </p>
      <p>
        <label for="dia">Día del pedido:</label>
        <input type="date" id="dia" name="dia">
      </p>
      <p>
        <label for="cantidad">Número de pizzas:</label>
        <input type="number" id="cantidad" name="cantidad" min="1" max="10">
      </p>
      <p>
        <label for="masa">Masa:</label>
        <select id="masa" name="masa">
          <option value="fina">Fina</option>
          <option value="normal">Normal</option>
          <option value="gruesa">Gruesa</option>
        </select>
      </p>
      <p>
        Entrega:
        <input type="radio" id="local" name="entrega" value="local">
        <label for="local">La recojo en el local</label>
        <input type="radio" id="casa" name="entrega" value="casa">
        <label for="casa">A domicilio</label>
      </p>
      <p>
        <input type="checkbox" id="queso" name="queso" value="si">
        <label for="queso">Con extra de queso</label>
      </p>
      <p>
        <label for="notas">Comentarios:</label>
        <textarea id="notas" name="notas" rows="3"></textarea>
      </p>
      <button type="submit">Enviar pedido</button>
    </form>
    <p><a href="carta.html">Ver la carta completa</a></p>
  </main>
`),
  },
];

// ---------- Catálogo de errores ----------
// aplicar(codigo) devuelve el código con el error, o null si esta página no tiene dónde ponerlo.
const una = (re, fn) => c => { const m = c.match(re); return m ? c.replace(re, fn) : null; };
export const ERRORES = [
  { id: 'alt', pista: 'A una imagen le falta algo que necesita el lector de pantalla.', aplicar: una(/(<img\b[^>]*?) alt="[^"]*"/, '$1') },
  { id: 'title', pista: 'Mira la pestaña del navegador: ¿qué pone?', aplicar: una(/<title>[^<]+<\/title>/, '<title></title>') },
  { id: 'charset', pista: 'Fíjate en las tildes y las eñes de la vista.', solucion: 'Falta <meta charset="UTF-8"> dentro del head.', aplicar: una(/ {2}<meta charset="UTF-8">\n/, '') },
  { id: 'lang', pista: 'El navegador no sabe en qué idioma está la página.', aplicar: una(/<html lang="es">/, '<html>') },
  { id: 'head', pista: 'La cabecera (head) no termina donde debe.', solucion: 'Falta el </head> justo antes de <body>.', aplicar: una(/<\/head>\n/, '') },
  { id: 'cierre-h', pista: 'Un encabezado se abre con un nivel y se cierra con otro.', aplicar: c => { const m = [...c.matchAll(/<h2>([^<]+)<\/h2>/g)].pop(); return m ? c.slice(0, m.index) + `<h2>${m[1]}</h3>` + c.slice(m.index + m[0].length) : null; } },
  { id: 'salto', pista: 'Los encabezados no van en orden.', aplicar: una(/<h2>([^<]+)<\/h2>/, '<h4>$1</h4>') },
  { id: 'anidado', pista: 'Lo último que se abre es lo primero que se cierra… y aquí no.', aplicar: una(/<strong>([^<]*)<\/strong>([^<]*)<\/p>/, '<strong>$1$2</p></strong>') },
  { id: 'lista', pista: 'Unos elementos de lista (li) se han quedado sin su lista.', solucion: 'Faltan <ul> antes de los li y </ul> después.', aplicar: una(/\n( *)<ul>\n([\s\S]*?)\n *<\/ul>/, '\n$2') },
  { id: 'fila', pista: 'A una fila de la tabla le faltan sus etiquetas de fila.', solucion: 'Faltan <tr> antes de esas dos celdas td y </tr> después.', aplicar: una(/\n *<tr>\n( *<td>[^\n]*\n *<td>[^\n]*)\n *<\/tr>/, '\n$1') },
  { id: 'ruta', pista: 'Una ruta solo funcionaría en el ordenador de quien hizo la página.', aplicar: una(/src="img\/([^"]+)"/, 'src="C:\\Users\\alumno\\Escritorio\\web\\img\\$1"') },
  { id: 'aqui', pista: 'Hay un enlace que no dice adónde lleva.', aplicar: c => { const i = c.indexOf('<main>'); const m = c.slice(i).match(/<a href="([^"]+)">[^<]+<\/a>/); return m ? c.slice(0, i) + c.slice(i).replace(m[0], `<a href="${m[1]}">pincha aquí</a>`) : null; } },
  { id: 'mayus', pista: 'Una etiqueta no sigue las buenas costumbres de XHTML.', aplicar: una(/<p>([^<]*<strong>)/, '<P>$1') },
  { id: 'vacio', pista: 'Se ha cerrado un elemento que es vacío.', aplicar: una(/(<img\b[^>]*>)/, '$1</img>') },
  { id: 'controls', pista: 'El vídeo no tiene botones.', aplicar: una(/ controls>/, '>') },
  { id: 'name', form: true, pista: 'Un dato del formulario no llegaría nunca al servidor.', aplicar: una(/(<input type="(?:text|email)" id="[^"]+") name="[^"]+"/, '$1') },
  { id: 'for', form: true, pista: 'Al pulsar el texto de un campo, no se activa el campo.', aplicar: una(/<label for="([^"]+)">/, '<label for="$1-campo">') },
  { id: 'tipo', form: true, pista: 'Un campo del formulario tiene un tipo que el navegador no conoce.', aplicar: c => c.includes('<input type="email"') ? c.replace('<input type="email"', '<input type="emial"') : c.replace('<input type="text"', '<input type="texto"') },
  { id: 'method', form: true, pista: 'El formulario no sabe de qué forma enviar los datos.', aplicar: una(/ method="post">/, ' method="enviar">') },
  { id: 'action', form: true, pista: 'El formulario no dice adónde se envían los datos.', solucion: 'Falta el atributo action en la etiqueta <form>, con la dirección a la que se envían los datos.', aplicar: una(/<form action="[^"]+" /, '<form ') },
  { id: 'boton', form: true, pista: 'El botón del formulario tiene un tipo que no existe.', aplicar: una(/<button type="submit">/, '<button type="enviar">') },
  { id: 'radio-name', form: true, pista: 'Dos opciones que deberían excluirse se pueden marcar a la vez.', aplicar: c => { const ms = [...c.matchAll(/<input type="radio" id="([^"]+)" name="[^"]+"/g)]; if (ms.length < 2) return null; const m = ms[1]; return c.slice(0, m.index) + `<input type="radio" id="${m[1]}" name="${m[1]}"` + c.slice(m.index + m[0].length); } },
  { id: 'radio-value', form: true, pista: 'Al marcar una de las opciones, el servidor no sabría cuál se ha elegido.', aplicar: una(/(<input type="radio"[^>]*?) value="[^"]*"/, '$1') },
  { id: 'id-rep', form: true, pista: 'Dos campos se llaman igual donde no pueden repetirse.', aplicar: c => { const ms = [...c.matchAll(/<input type="radio" id="([^"]+)"/g)]; if (ms.length < 2) return null; const m = ms[1]; return c.slice(0, m.index) + `<input type="radio" id="${ms[0][1]}"` + c.slice(m.index + m[0].length); } },
  { id: 'select', form: true, pista: 'Las opciones de la lista desplegable se han quedado sin su lista.', solucion: c => `Faltan ${(c.match(/<select[^>]*>/) || ['<select>'])[0]} antes de las option y </select> después.`, aplicar: una(/\n *<select[^>]*>\n([\s\S]*?)\n *<\/select>/, '\n$1') },
  { id: 'textarea', form: true, pista: 'El cuadro de varias líneas está escrito como si fuera otro tipo de campo.', solucion: c => `El cuadro de varias líneas no es un input. Se escribe: ${(c.match(/<textarea[^>]*><\/textarea>/) || [''])[0]}`, aplicar: una(/<textarea( id="[^"]+" name="[^"]+")[^>]*><\/textarea>/, '<input type="textarea"$1>') },
  { id: 'label-suelto', form: true, pista: 'El texto de un campo está suelto: no es una etiqueta de formulario.', aplicar: c => { const m = [...c.matchAll(/<label for="[^"]+">([^<]+)<\/label>(\s*<input type="(?!radio|checkbox))/g)].pop(); return m ? c.slice(0, m.index) + m[1] + m[2] + c.slice(m.index + m[0].length) : null; } },
  { id: 'mayor', pista: 'A una etiqueta le falta un símbolo.', aplicar: una(/<h1>([^<]+)<\/h1>/, '<h1>$1</h1') },
];

const CUENTA = ['img', 'li', 'a', 'td', 'th', 'tr', 'h1', 'h2', 'p', 'input', 'video', 'table', 'form', 'label', 'select', 'option', 'textarea', 'button'];

const clave = r => r.codigo;
function lineaDistinta(a, b) {
  const la = a.split('\n'), lb = b.split('\n');
  let i = 0;
  while (i < la.length && la[i] === lb[i]) i++;
  return { linea: i + 1, bien: (la[i] || '').trim(), mal: (lb[i] || '').trim() };
}

// Crea un ejercicio: { tema, original, codigo, errores: [{id, pista, codigos, linea, bien, mal}] }
export function crearEjercicio(temaId, n = 5, azar = Math.random) {
  const tema = TEMAS.find(t => t.id === temaId) || TEMAS[Math.floor(azar() * TEMAS.length)];
  for (let intento = 0; intento < 30; intento++) {
    let orden = ERRORES.slice().sort(() => azar() - 0.5);
    if (tema.formulario) {   // en la página de formulario, cuatro de los cinco errores son del formulario
      const f = orden.filter(e => e.form), o = orden.filter(e => !e.form);
      orden = [...f.slice(0, 4), ...o, ...f.slice(4)];
    }
    let codigo = tema.codigo;
    const usados = new Set(validar(codigo).map(clave));
    const errores = [];
    for (const e of orden) {
      if (errores.length === n) break;
      const nuevo = e.aplicar(codigo);
      if (!nuevo || nuevo === codigo) continue;
      const antes = new Set(validar(codigo).map(clave));
      const despues = validar(nuevo).map(clave).filter(k => !antes.has(k));
      if (!despues.length || despues.some(k => usados.has(k))) continue;
      despues.forEach(k => usados.add(k));
      const d = lineaDistinta(codigo, nuevo);
      errores.push({ id: e.id, pista: e.pista, codigos: [...new Set(despues)], bien: d.bien, mal: e.solucion ? null : d.mal, solucion: typeof e.solucion === 'function' ? e.solucion(codigo) : e.solucion || null });
      codigo = nuevo;
    }
    if (errores.length === n) {
      // la línea de cada error, contada en el código final
      const res = validar(codigo);
      errores.forEach(er => { er.linea = (res.find(r => er.codigos.includes(r.codigo)) || { linea: 1 }).linea; });
      return { tema, original: tema.codigo, codigo, errores };
    }
  }
  throw new Error('No se ha podido preparar el ejercicio');
}

// Corrige lo que ha escrito el alumno
export function corregir(ej, codigo) {
  const res = validar(codigo);
  const presentes = new Set(res.map(clave));
  const errores = ej.errores.map(e => ({ ...e, arreglado: !e.codigos.some(k => presentes.has(k)) }));
  // faltan: elementos que tiene la página correcta y aquí no están.
  // borrados: los que ha quitado el alumno (algunos errores ya cambian una etiqueta por otra, y eso no cuenta).
  const bien = contarTodo(ej.original), dado = contarTodo(ej.codigo), ahora = contarTodo(codigo);
  const n = (c, k) => c[k] || 0;
  const faltan = CUENTA.map(nombre => ({ nombre, falta: n(bien, nombre) - n(ahora, nombre) })).filter(x => x.falta > 0);
  const borrados = CUENTA.map(nombre => ({ nombre, falta: Math.min(n(bien, nombre), n(dado, nombre)) - n(ahora, nombre) })).filter(x => x.falta > 0);
  return { res, errores, faltan, borrados, terminado: !res.length && !faltan.length };
}
