let tasks = [];

// 🌙 Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save theme preference
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme on refresh
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
});


// ➤ Add Task
function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") return;

    tasks.push({ text: taskText, done: false });
    input.value = "";
    renderTasks();
}

// ➤ Render Tasks
function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <span>${task.text}</span>

            <button onclick="toggleTask(${index})">✔</button>
            <button onclick="editTask(${index})">✏️</button>
            <button onclick="deleteTask(${index})">❌</button>
        `;

        if (task.done) {
            li.style.textDecoration = "line-through";
            li.style.color = "gray";
        }

        list.appendChild(li);
    });

    updateProgress();
}

// ➤ Toggle Task
function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

// ➤ Edit Task
function editTask(index) {

    let newText = prompt("Edit your task:", tasks[index].text);

    if (newText === null) return;

    newText = newText.trim();

    if (newText === "") return;

    tasks[index].text = newText;

    renderTasks();
}

// ➤ Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// ➤ Progress Calculation
function updateProgress() {
    let total = tasks.length;

    if (total === 0) {
        document.getElementById("progress").innerText =
            "Progress: 0% (0/0 tasks completed)";
        return;
    }

    let doneTasks = tasks.filter(task => task.done).length;
    let percent = Math.round((doneTasks / total) * 100);

    document.getElementById("progress").innerText =
        `Progress: ${percent}% (${doneTasks}/${total} tasks completed)`;
}


// ⏱️ Timer
let seconds = 0;
let timer = null;

function startTimer() {
    if (timer !== null) return;

    timer = setInterval(() => {
        seconds++;
        updateTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function updateTime() {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    document.getElementById("time").innerText =
        `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function pad(num) {
    return num < 10 ? "0" + num : num;
}