let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// -------------------- SAVE --------------------
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// -------------------- ADD TASK --------------------
function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();
    let priority = document.getElementById("prioritySelect")?.value || "Medium";

    if (!text) return;

    tasks.push({
        text,
        done: false,
        priority,
        createdAt: Date.now()
    });

    input.value = "";
    saveTasks();
    renderTasks();
}

// -------------------- RENDER --------------------
function renderTasks(filter = "all") {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (filter === "active") return !task.done;
        if (filter === "done") return task.done;
        return true;
    });

    filtered.forEach((task, index) => {
        let li = document.createElement("li");

        let priorityColor =
            task.priority === "High" ? "red" :
            task.priority === "Medium" ? "orange" : "green";

        li.innerHTML = `
            <span style="color:${priorityColor}">
                [${task.priority}]
            </span>
            ${task.text}

            <button onclick="toggleTask(${index})">✔</button>
            <button onclick="editTask(${index})">✏️</button>
            <button onclick="deleteTask(${index})">❌</button>
        `;

        if (task.done) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }

        list.appendChild(li);
    });

    updateProgress();
    saveTasks();
}

// -------------------- TOGGLE --------------------
function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

// -------------------- DELETE --------------------
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// -------------------- EDIT --------------------
function editTask(index) {
    let newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        renderTasks();
    }
}

// -------------------- PROGRESS --------------------
function updateProgress() {
    let total = tasks.length;
    let done = tasks.filter(t => t.done).length;

    let percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("progress").innerText =
        `Progress: ${percent}% (${done}/${total})`;
}

// -------------------- FILTER BUTTONS --------------------
function showAll() { renderTasks("all"); }
function showActive() { renderTasks("active"); }
function showDone() { renderTasks("done"); }

// -------------------- TIMER (PAUSE + RESUME) --------------------
let seconds = 0;
let timer = null;
let running = false;

function toggleTimer() {
    if (running) {
        clearInterval(timer);
        timer = null;
    } else {
        timer = setInterval(() => {
            seconds++;
            updateTime();
        }, 1000);
    }
    running = !running;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    running = false;
    seconds = 0;
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

// Initial render
renderTasks();
updateTime();
