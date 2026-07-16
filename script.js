let tasks = [];

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
let seconds = 0;          // total elapsed seconds (displayed)
let timer = null;
let startTime = null;     // epoch ms when the current run segment started
let accumulated = 0;      // elapsed seconds counted before the current run segment

function startTimer() {
    if (timer !== null) return; // prevent multiple timers

    startTime = Date.now();
    timer = setInterval(() => {
        // derive elapsed from the clock so background-tab throttling can't drift it
        seconds = accumulated + Math.floor((Date.now() - startTime) / 1000);
        updateTime();
    }, 1000);
}

function stopTimer() {
    if (timer === null) return;

    // freeze elapsed time so a later start resumes from here (no drift, no reset)
    accumulated += Math.floor((Date.now() - startTime) / 1000);
    seconds = accumulated;
    clearInterval(timer);
    timer = null;
    updateTime();
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