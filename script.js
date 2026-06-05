let tasks = [];

function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();
    if (taskText === "") return;

    if (tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase())) {
        alert("This task already exists!");
        return;
    }

    tasks.push({ text: taskText, done: false, priority: document.getElementById("taskPriority").value });
    input.value = "";
    renderTasks();
}

function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    const weight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    tasks.sort((a, b) => {
        if (a.done !== b.done) return a.done - b.done;
        return (weight[b.priority] || 2) - (weight[a.priority] || 2);
    });

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <div>
                <span>${task.text}</span>
                <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
            <div>
                <button onclick="toggleTask(${index})">✓</button>
                <button onclick="deleteTask(${index})">×</button>
            </div>
        `;
        if (task.done) {
            li.style.textDecoration = "line-through";
            li.style.color = "gray";
        }
        list.appendChild(li);
    });

    updateProgress();
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function updateProgress() {
    let total = tasks.length;
    if (total === 0) {
        document.getElementById("progress").innerText = "Progress: 0% (0/0 tasks completed)";
        return;
    }
    let done = tasks.filter(t => t.done).length;
    document.getElementById("progress").innerText = `Progress: ${Math.round((done / total) * 100)}% (${done}/${total} tasks completed)`;
}

let seconds = 1500;
let currentPresetMins = 25;
let timer = null;

function startTimer() {
    if (timer !== null) return;
    
    const badge = document.getElementById("zenStatus");
    if (badge) {
        badge.classList.add("active");
        document.getElementById("zenText").innerText = "Zen Active";
    }

    timer = setInterval(() => {
        if (seconds > 0) {
            seconds--;
            updateTime();
            if (seconds === 0) {
                stopTimer();
                alert("Time is up! Focus session completed.");
            }
        } else {
            seconds++;
            updateTime();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;

    const badge = document.getElementById("zenStatus");
    if (badge) {
        badge.classList.remove("active");
        document.getElementById("zenText").innerText = "Zen Idle";
    }
}

function updateTime() {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    document.getElementById("time").innerText = hrs > 0 ? 
        `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
}

function pad(num) { return num < 10 ? "0" + num : num; }

function resetTimer() {
    stopTimer();
    seconds = currentPresetMins * 60;
    updateTime();
}

function setTimerPreset(mins) {
    stopTimer();
    currentPresetMins = mins;
    seconds = mins * 60;
    updateTime();
}

function setCustomPreset() {
    let mins = prompt("Enter custom duration in minutes:", currentPresetMins);
    if (mins === null) return;
    let val = parseInt(mins, 10);
    if (isNaN(val) || val <= 0) {
        alert("Please enter a valid positive number!");
        return;
    }
    setTimerPreset(val);
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer !== null) {
        document.title = "Return to Zen Mode...";
    } else {
        document.title = "Zen Mode - Productivity Tracker";
        if (timer !== null) {
            alert("Welcome back to your Zen session! Keep focusing and avoid distractions.");
        }
    }
});

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(t => { if (!t.priority) t.priority = 'Medium'; });
    renderTasks();
}
updateTime();