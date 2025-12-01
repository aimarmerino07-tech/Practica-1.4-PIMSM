
const tituloInput = document.getElementById('titulo');
const contenidoInput = document.getElementById('contenido');
const prioridadSelect = document.getElementById('prioridad');
const listaNotasDiv = document.getElementById('listaNotas');
const filtroSelect = document.getElementById('filtro');

let notas = [];
let editandoId = null;

function generarId() {
  return Date.now().toString();
}

function guardarNotas() {
  localStorage.setItem('tusNotas', JSON.stringify(notas));
}

function cargarNotas() {
  const data = localStorage.getItem('tusNotas');
  notas = data ? JSON.parse(data) : [];
}

function limpiarFormulario() {
  tituloInput.value = '';
  contenidoInput.value = '';
  prioridadSelect.value = 'media';
  editandoId = null;
  document.querySelector('button[onclick="agregarNota()"]').textContent = 'Guardar Nota';
}

function agregarNota() {
  const titulo = tituloInput.value.trim();
  const contenido = contenidoInput.value.trim();
  const prioridad = prioridadSelect.value;

  if (!titulo || !contenido) {
    alert('Rellena título y contenido antes de guardar.');
    return;
  }

  if (editandoId) {
    const nota = notas.find(n => n.id === editandoId);
    nota.titulo = titulo;
    nota.contenido = contenido;
    nota.prioridad = prioridad;
  } else {
    const nuevaNota = {
      id: generarId(),
      titulo,
      contenido,
      prioridad,
      fecha: new Date().toISOString()
    };
    notas.unshift(nuevaNota);
  }

  guardarNotas();
  mostrarNotas();
  limpiarFormulario();
}

function eliminarNota(id) {
  if (!confirm('¿Eliminar esta nota?')) return;
  notas = notas.filter(n => n.id !== id);
  guardarNotas();
  mostrarNotas();
}

function editarNota(id) {
  const nota = notas.find(n => n.id === id);
  if (!nota) return;
  tituloInput.value = nota.titulo;
  contenidoInput.value = nota.contenido;
  prioridadSelect.value = nota.prioridad;
  editandoId = id;
  document.querySelector('button[onclick="agregarNota()"]').textContent = 'Actualizar Nota';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarNotas() {
  const filtro = filtroSelect.value;
  listaNotasDiv.innerHTML = '';

  const filtradas = notas.filter(n => filtro === 'todas' ? true : n.prioridad === filtro);

  if (filtradas.length === 0) {
    listaNotasDiv.innerHTML = '<p>No hay notas para mostrar.</p>';
    return;
  }

  filtradas.forEach(nota => {
    const div = document.createElement('div');
    div.className = 'nota';
    div.innerHTML = `
      <h3>${escapeHtml(nota.titulo)}</h3>
      <small>Prioridad: ${nota.prioridad} • ${new Date(nota.fecha).toLocaleString()}</small>
      <p>${escapeHtml(nota.contenido)}</p>
      <div class="acciones">
        <button onclick="editarNota('${nota.id}')">Editar</button>
        <button class="eliminar" onclick="eliminarNota('${nota.id}')">Eliminar</button>
      </div>
    `;
    listaNotasDiv.appendChild(div);
  });
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Inicialización
cargarNotas();
mostrarNotas();

