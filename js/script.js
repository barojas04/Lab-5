// Referencias al DOM
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const pendingCountEl = document.querySelector("#pendingCount");
const completedCountEl = document.querySelector("#completedCount");
const errorMessage = document.querySelector("#errorMessage");
const emptyState = document.querySelector("#emptyState");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

// Estado de la aplicación
let tasks = [];

// Inicialización
function init() {
  renderTasks();
}

// Actualizar contadores
function updateStats() {
  const pendingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  
  pendingCountEl.textContent = pendingCount;
  completedCountEl.textContent = completedCount;
  
  if (tasks.length === 0) {
    emptyState.classList.remove("hidden");
    taskList.style.display = "none";
  } else {
    emptyState.classList.add("hidden");
    taskList.style.display = "flex";
  }
}

// Mostrar error
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.add("show");
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 3000);
}

// Limpiar completadas
function clearCompleted() {
  // Animamos la salida de las completadas
  const completedItems = document.querySelectorAll('.task-item.completed');
  completedItems.forEach(item => item.classList.add('removing'));
  
  setTimeout(() => {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
  }, 300);
}

// Toggle estado de tarea
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// Eliminar tarea
function deleteTask(id) {
  const taskElement = document.querySelector(`#task-${id}`);
  if (taskElement) {
    taskElement.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }, 300); // Esperar a que termine la animación
  } else {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
  }
}

// Renderizar tareas
function renderTasks() {
  taskList.innerHTML = "";
  
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.id = `task-${task.id}`;
    
    li.innerHTML = `
      <div class="task-content">
        <label class="checkbox-wrapper">
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
          <span class="checkmark">
            <span class="material-symbols-rounded">check</span>
          </span>
        </label>
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <div class="task-actions">
        <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})" aria-label="Eliminar tarea">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
    `;
    
    taskList.appendChild(li);
  });
  
  updateStats();
}

// Función auxiliar para escapar HTML y evitar XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Manejador del formulario
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  
  const text = taskInput.value.trim();
  
  if (!text) {
    showError("Por favor, escribe una tarea válida.");
    return;
  }
  
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };
  
  tasks.unshift(newTask); // Añadir al principio
  renderTasks();
  
  taskInput.value = "";
  taskInput.focus();
});

// Event listener para limpiar completadas
clearCompletedBtn.addEventListener("click", clearCompleted);

// Funciones globales necesarias para los event handlers inline
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// Arrancar la app
init();