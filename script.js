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
        if (task.done) li.classList.add("done");

        li.innerHTML = `
            <span class="check">${task.done ? "✓" : ""}</span>
            <span class="task-text">${task.text}</span>
            <span class="done-badge">Done</span>
            <span class="del" onclick="deleteTask(${index})">🗑</span>
        `;

        li.querySelector(".check").addEventListener("click", () => toggleTask(index));

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
    let done = tasks.filter(t => t.done).length;
    let percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressCount").textContent = done + " / " + total + " tasks";
    document.getElementById("progress").textContent = percent + "% complete";
}

// ⏱️ Timer
let seconds = 0;
let timer = null;

function startTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
        document.querySelector(".btn-start").textContent = "▶ Start";
        return;
    }
    timer = setInterval(() => { seconds++; updateTime(); }, 1000);
    document.querySelector(".btn-start").textContent = "⏸ Pause";
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    updateTime();
    document.querySelector(".btn-start").textContent = "▶ Start";
}

function updateTime() {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    document.getElementById("time").innerText = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function pad(num) {
    return num < 10 ? "0" + num : num;
}