const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const errorMessage = document.getElementById("errorMessage");

let tareasPendientes = 0;

function actualizarContador() {
  pendingCount.textContent = tareasPendientes;
}

function mostrarError(mensaje) {
  errorMessage.textContent = mensaje;
}

function limpiarError() {
  errorMessage.textContent = "";
}

function crearTarea(textoTarea) {
  const li = document.createElement("li");
  li.classList.add("task-item");

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", "Marcar tarea como completada");

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = textoTarea;

  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Completar";
  completeBtn.classList.add("complete-btn");
  completeBtn.type = "button";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Eliminar";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.type = "button";

  taskContent.appendChild(checkbox);
  taskContent.appendChild(span);

  taskActions.appendChild(completeBtn);
  taskActions.appendChild(deleteBtn);

  li.appendChild(taskContent);
  li.appendChild(taskActions);

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      span.classList.add("completed");
      if (!li.dataset.completed) {
        tareasPendientes--;
        li.dataset.completed = "true";
      }
    } else {
      span.classList.remove("completed");
      if (li.dataset.completed === "true") {
        tareasPendientes++;
        li.dataset.completed = "false";
      }
    }
    actualizarContador();
  });

  completeBtn.addEventListener("click", function () {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  });

  deleteBtn.addEventListener("click", function () {
    if (li.dataset.completed !== "true") {
      tareasPendientes--;
    }
    li.remove();
    actualizarContador();
  });

  li.dataset.completed = "false";
  taskList.appendChild(li);

  tareasPendientes++;
  actualizarContador();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const textoIngresado = taskInput.value.trim();

  if (textoIngresado === "") {
    mostrarError("No puedes agregar tareas vacías o con solo espacios.");
    return;
  }

  limpiarError();
  crearTarea(textoIngresado);
  taskInput.value = "";
  taskInput.focus();
});