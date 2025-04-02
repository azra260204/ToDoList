const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Add event listener for 'Enter' key to add task
inputBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

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
        <label style="display: flex; align-items: center; gap: 10px; flex: 1;">
            <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
            <span contenteditable="true" class="task-text">${task}</span>
        </label>
        <div style="display: flex; gap: 5px;">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    if (completed) {
        li.classList.add("completed");
        addSmiley(li);
    }

    listContainer.appendChild(li);
    updateCounters();

    const checkbox = li.querySelector(".task-checkbox");
    checkbox.addEventListener("change", function () {
        li.classList.toggle("completed", checkbox.checked);
        if (checkbox.checked) {
            addSmiley(li);
        } else {
            removeSmiley(li);
        }
        updateCounters();
        saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", function () {
        li.remove();
        updateCounters();
        saveTasks();
    });

    saveTasks(); // Save after adding a new task
}

// Function to add smiley face when task is completed
function addSmiley(li) {
    if (!li.querySelector(".smiley")) {
        const smiley = document.createElement("span");
        smiley.className = "smiley";
        smiley.textContent = "";
        smiley.style.position = "absolute";
        smiley.style.left = "50%";
        smiley.style.top = "50%";
        smiley.style.transform = "translate(-50%, -50%)";
        smiley.style.fontSize = "24px";
        li.appendChild(smiley);
    }
}

// Function to remove smiley face when task is unchecked
function removeSmiley(li) {
    const smiley = li.querySelector(".smiley");
    if (smiley) {
        smiley.remove();
    }
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
