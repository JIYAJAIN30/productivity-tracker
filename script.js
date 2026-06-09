let tasks = []
let seconds = 0
let timer = null

// ➤ Navigation
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
    document.getElementById(pageId).classList.add("active")
}

// ➤ Add Task
function addTask() {
    let input = document.getElementById("taskInput")
    let taskText = input.value.trim()
    if (taskText === "") return
    tasks.push({ text: taskText, done: false })
    input.value = ""
    renderTasks()
}

// ➤ Render Tasks (with CRUD buttons)
function renderTasks() {
    let list = document.getElementById("taskList")
    list.innerHTML = ""
    tasks.forEach((task, index) => {
        let li = document.createElement("li")
        li.innerHTML = `
            ${task.text}
            <button onclick="toggleTask(${index})">✔</button>
            <button onclick="updateTask(${index})">✏️</button>
            <button onclick="deleteTask(${index})">❌</button>
        `
        if (task.done) {
            li.style.textDecoration = "line-through"
            li.style.color = "gray"
        }
        list.appendChild(li)
    })
    updateProgress()
}

// ➤ Toggle Task Completion
function toggleTask(index) {
    tasks[index].done = !tasks[index].done
    renderTasks()
}

// ➤ Update Task Text
function updateTask(index) {
    let newText = prompt("Edit your task:", tasks[index].text)
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim()
        renderTasks()
    }
}

// ➤ Delete Task
function deleteTask(index) {
    tasks.splice(index, 1)
    renderTasks()
}

// ➤ Progress Calculation
function updateProgress() {
    let total = tasks.length
    let progressText = document.getElementById("progressText")
    if (total === 0) {
        progressText.innerText = "Progress: 0% (0/0 tasks completed)"
        return
    }
    let doneTasks = tasks.filter(task => task.done).length
    let percent = Math.round((doneTasks / total) * 100)
    progressText.innerText = `Progress: ${percent}% (${doneTasks}/${total} tasks completed)`
}

// ⏱️ Timer Functions
function startTimer() {
    if (timer !== null) return
    timer = setInterval(() => {
        seconds++
        updateTime()
    }, 1000)
}

function stopTimer() {
    clearInterval(timer)
    timer = null
}

function updateTime() {
    let hrs = Math.floor(seconds / 3600)
    let mins = Math.floor((seconds % 3600) / 60)
    let secs = seconds % 60
    document.getElementById("time").innerText =
        `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
}

function pad(num) {
    return num < 10 ? "0" + num : num
}

// 🌙 Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode")
}

