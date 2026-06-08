// =========================
// Task Storage
// =========================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ➤ Add Task
function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") return;

    tasks.push({
        text: taskText,
        done: false
    });

    saveTasks();
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
            ${task.text}
            <button onclick="toggleTask(${index})">✔</button>
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
    saveTasks();
    renderTasks();
}

// ➤ Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
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

// =========================
// Timer Storage
// =========================
let seconds = Number(localStorage.getItem("timer")) || 0;
let timer = null;

// Save Timer
function saveTimer() {
    localStorage.setItem("timer", seconds);
}

// ➤ Start Timer
function startTimer() {
    if (timer !== null) return;

    timer = setInterval(() => {
        seconds++;
        saveTimer();
        updateTime();
    }, 1000);
}

// ➤ Stop Timer
function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// ➤ Reset Timer
function resetTimer() {
    stopTimer();
    seconds = 0;
    saveTimer();
    updateTime();
}

// ➤ Update Timer Display
function updateTime() {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    document.getElementById("time").innerText =
        `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

// ➤ Format Numbers
function pad(num) {
    return num < 10 ? "0" + num : num;
}

// =========================
// Load Saved Data
// =========================
renderTasks();
updateTime();