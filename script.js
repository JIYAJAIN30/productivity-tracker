let tasks = [];

// ➤ Add Task
function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();
    if (taskText === "") return;
    const normalized = taskText.replace(/\s+/g, " ").toLowerCase();
    const isDuplicate = tasks.some(task =>
        task.text.replace(/\s+/g, " ").toLowerCase() === normalized
    );
    if (isDuplicate) {
        alert(`"${taskText}" already exists in your list!`);
        return;
    }
    tasks.push({ text: taskText, done: false });
    input.value = "";
    renderTasks();
}

document.getElementById('taskInput')
  .addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });

    

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
let seconds = 0;
let timer = null;
function startTimer() {
    if (timer !== null) return; // prevent multiple timers
    timer = setInterval(() => {
        seconds++;
        updateTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}
function resetTimer(){
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

//- 25min
const POMO_MODES = { focus: 25 * 60, break: 5 * 60 };
let pomoSeconds = 25 * 60;
let pomoTotal   = 25 * 60;
let pomoTimer   = null;

function startPomodoro() {
    if (pomoTimer !== null) return;
    pomoTimer = setInterval(() => {
        if (pomoSeconds <= 0) { stopPomodoro(); return; }
        pomoSeconds--;
        updatePomoTime();
    }, 1000);
}

function stopPomodoro() {
    clearInterval(pomoTimer);
    pomoTimer = null;
}

function resetPomodoro() {
    stopPomodoro();
    pomoSeconds = pomoTotal;
    updatePomoTime();
}

function switchMode(mode) {
    stopPomodoro();
    pomoTotal   = POMO_MODES[mode];
    pomoSeconds = POMO_MODES[mode];
    document.getElementById("pomo-mode").innerText =
        mode === "focus" ? "Focus session" : "Short break";
    updatePomoTime();
}

function updatePomoTime() {
    let mins = Math.floor(pomoSeconds / 60);
    let secs = pomoSeconds % 60;
    document.getElementById("pomodoro-time").innerText =
        `${pad(mins)}:${pad(secs)}`;
}

function pad(num) {
    return num < 10 ? "0" + num : num;
}