const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to update task counters
function updateCounters() {
    const totalTasks = listContainer.getElementsByTagName("li").length;
    const completedTasks = listContainer.querySelectorAll(".completed").length;
    
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = totalTasks - completedTasks;
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
    updateCounters();
}

// Function to create a task element and append it to the list
function createTaskElement(task, completed = false) {
    const li = document.createElement("li");

    li.innerHTML = `
        <label>
            <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
            <span>${task}</span>
        </label>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    if (completed) {
        li.classList.add("completed");
    }

    listContainer.appendChild(li);
    updateCounters();

    const checkbox = li.querySelector(".task-checkbox");
    checkbox.addEventListener("change", function () {
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
        saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", function () {
        li.remove();
        updateCounters();
        saveTasks();
    });

    li.querySelector(".edit-btn").addEventListener("click", function () {
        const newTask = prompt("Edit your task:", task);
        if (newTask) {
            li.querySelector("span").textContent = newTask;
            saveTasks();
        }
    });

    saveTasks(); // Save after adding a new task
}

// Function to add a new task
function addTask() {
    const task = inputBox.value.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }

    createTaskElement(task);
    inputBox.value = "";
}
