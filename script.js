// Get references to the input, button, task list, and progress bar elements
const taskInput = document.getElementById("taskinput");
const newTaskButton = document.getElementById("newtask");
const taskList = document.getElementById("task-list");
const progressBar = document.querySelector(".bg-blue-500");
const progressCircle = document.querySelector(".curcle h2");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Add a new task when the button is clicked
newTaskButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission
  const taskName = taskInput.value.trim(); // Get and trim the input value

  if (taskName === "") {
    alert("Please enter a task name.");
    return;
  }

  addTaskToList(taskName, false); // Add task as incomplete
  saveTaskToLocalStorage(taskName, false);

  taskInput.value = ""; // Clear the input field
  updateProgressBar();
});

// Function to add a task to the list
function addTaskToList(taskName, isCompleted) {
  const li = document.createElement("li");
  li.className =
    "flex justify-between items-center p-2 bg-gray-100 rounded-md";

  li.innerHTML = `
    <div class="flex items-center space-x-2 max-w-[75%] break-words">
      <input type="checkbox" class="h-4 w-4 text-blue-500 rounded" ${
        isCompleted ? "checked" : ""
      } />
      <span class="${isCompleted ? "line-through text-gray-400" : ""}">${taskName}</span>
    </div>
    <div class="flex items-center space-x-3">
      <img class="h-5 w-5 cursor-pointer" src="img/edit.png" alt="Edit Task" title="Edit Task" />
      <img class="h-5 w-5 cursor-pointer" src="img/bin.png" alt="Delete Task" title="Delete Task" />
    </div>
  `;

  // Add delete functionality to the delete icon
  const deleteIcon = li.querySelector("img[alt='Delete Task']");
  deleteIcon.addEventListener("click", () => {
    li.remove();
    deleteTaskFromLocalStorage(taskName);
    updateProgressBar();
  });

  // Add edit functionality to the edit icon
  const editIcon = li.querySelector("img[alt='Edit Task']");
  editIcon.addEventListener("click", () => {
    const newTaskName = prompt("Edit your task:", taskName);
    if (newTaskName && newTaskName.trim() !== "") {
      const span = li.querySelector("span");
      span.textContent = newTaskName.trim(); // Update in UI
      updateTaskNameInLocalStorage(taskName, newTaskName.trim());
    } else {
      alert("Task name cannot be empty.");
    }
  });

  // Add strike-through functionality to the checkbox
  const checkbox = li.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", () => {
    const span = li.querySelector("span");
    if (checkbox.checked) {
      span.classList.add("line-through", "text-gray-400");
      updateTaskCompletionInLocalStorage(taskName, true);
    } else {
      span.classList.remove("line-through", "text-gray-400");
      updateTaskCompletionInLocalStorage(taskName, false);
    }
    updateProgressBar();
  });

  // Append the task to the task list
  taskList.appendChild(li);
}

// Function to save a task to local storage
function saveTaskToLocalStorage(taskName, isCompleted) {
  const tasks = getTasksFromLocalStorage();
  tasks.push({ name: taskName, completed: isCompleted });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) => addTaskToList(task.name, task.completed));
  updateProgressBar();
}

// Function to get tasks from local storage
function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Function to delete a task from local storage
function deleteTaskFromLocalStorage(taskName) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter((task) => task.name !== taskName);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to update task completion status in local storage
function updateTaskCompletionInLocalStorage(taskName, isCompleted) {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = tasks.findIndex((task) => task.name === taskName);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Function to update task name in local storage
function updateTaskNameInLocalStorage(oldTaskName, newTaskName) {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = tasks.findIndex((task) => task.name === oldTaskName);
  if (taskIndex !== -1) {
    tasks[taskIndex].name = newTaskName;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Function to update the progress bar
function updateProgressBar() {
  const tasks = getTasksFromLocalStorage();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  progressBar.style.width = `${progressPercentage}%`;
  progressCircle.textContent = `${completedTasks}/${totalTasks}`;
}
// Function to show congratulations animation
function showCongratulations() {
  const congratsDiv = document.getElementById("congratulations");
  congratsDiv.classList.remove("hidden"); // Show the congratulations div

  const closeButton = document.getElementById("closeCongrats");
  closeButton.addEventListener("click", () => {
    congratsDiv.classList.add("hidden"); // Hide the congratulations div
  });
}

// Function to update the progress bar
function updateProgressBar() {
  const tasks = getTasksFromLocalStorage();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  progressBar.style.width = `${progressPercentage}%`;
  progressCircle.textContent = `${completedTasks}/${totalTasks}`;

  // Show congratulations animation when all tasks are completed
  if (totalTasks > 0 && completedTasks === totalTasks) {
    showCongratulations();
  }
}
