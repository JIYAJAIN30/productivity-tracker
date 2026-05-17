/* ═══════════════════════════════════════════════════════════
   PREMIUM PRODUCTIVITY TRACKER - JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

let tasks = [];
let timerState = {
    seconds: 0,
    interval: null,
    isRunning: false
};

/* ─────────────────────────────────────────────────────────
   TASK MANAGEMENT
   ───────────────────────────────────────────────────────── */

/**
 * Add a new task with smooth animation
 */
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        input.focus();
        return;
    }

    tasks.push({ 
        text: taskText, 
        done: false,
        createdAt: new Date()
    });
    
    input.value = "";
    input.focus();
    renderTasks();
    updateProgress();
}

/**
 * Render all tasks with enhanced UI
 */
function renderTasks() {
    const list = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const taskCount = document.getElementById("taskCount");

    list.innerHTML = "";
    taskCount.textContent = tasks.filter(t => !t.done).length;

    if (tasks.length === 0) {
        emptyState.classList.add("visible");
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.remove("visible");
    emptyState.classList.add("hidden");

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.done ? 'completed' : ''}`;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.done ? 'checked' : ''} 
                onchange="toggleTask(${index})"
                aria-label="Mark task as ${task.done ? 'incomplete' : 'complete'}"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="task-btn delete" onclick="deleteTask(${index})" aria-label="Delete task">
                    🗑️
                </button>
            </div>
        `;

        list.appendChild(li);
    });
}

/**
 * Toggle task completion status
 */
function toggleTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].done = !tasks[index].done;
        renderTasks();
        updateProgress();
    }
}

/**
 * Delete a task
 */
function deleteTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        renderTasks();
        updateProgress();
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/* ─────────────────────────────────────────────────────────
   PROGRESS TRACKING
   ───────────────────────────────────────────────────────── */

/**
 * Update progress circle and statistics
 */
function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(task => task.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    // Update percentage
    document.getElementById("progressPercent").textContent = `${percent}%`;

    // Update stats
    document.getElementById("tasksDone").textContent = done;
    document.getElementById("tasksTotal").textContent = total;

    // Update circular progress
    const circumference = 377; // 2 * π * r, where r = 60
    const offset = circumference - (percent / 100) * circumference;
    const progressRing = document.querySelector(".progress-ring-fill");
    progressRing.style.strokeDashoffset = offset;

    // Add celebration for 100% completion
    if (percent === 100 && total > 0) {
        celebrateCompletion();
    }
}

/**
 * Celebrate when all tasks are completed
 */
function celebrateCompletion() {
    const progressCircle = document.querySelector(".progress-circle");
    if (progressCircle.classList.contains("celebrated")) return;

    progressCircle.classList.add("celebrated");
    createConfetti();

    setTimeout(() => {
        progressCircle.classList.remove("celebrated");
    }, 2000);
}

/**
 * Create confetti animation (simple version)
 */
function createConfetti() {
    // Add a subtle glow effect
    const progressWidget = document.querySelector(".progress-widget");
    progressWidget.style.boxShadow = "0 0 40px rgba(90, 227, 168, 0.5), 0 0 60px rgba(79, 157, 255, 0.3)";
    
    setTimeout(() => {
        progressWidget.style.boxShadow = "var(--shadow-md)";
    }, 500);
}

/* ─────────────────────────────────────────────────────────
   TIMER FUNCTIONALITY
   ───────────────────────────────────────────────────────── */

/**
 * Start the timer
 */
function startTimer() {
    if (timerState.isRunning) return;

    timerState.isRunning = true;
    
    timerState.interval = setInterval(() => {
        timerState.seconds++;
        updateTime();
    }, 1000);

    // Update button states
    updateTimerButtons();
}

/**
 * Stop/Pause the timer
 */
function stopTimer() {
    if (!timerState.isRunning) return;

    clearInterval(timerState.interval);
    timerState.isRunning = false;
    
    updateTimerButtons();
}

/**
 * Reset the timer
 */
function resetTimer() {
    clearInterval(timerState.interval);
    timerState.seconds = 0;
    timerState.isRunning = false;
    updateTime();
    updateTimerButtons();
}

/**
 * Update timer display
 */
function updateTime() {
    const hours = Math.floor(timerState.seconds / 3600);
    const minutes = Math.floor((timerState.seconds % 3600) / 60);
    const seconds = timerState.seconds % 60;

    document.getElementById("time").textContent = 
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Pad numbers with leading zero
 */
function pad(num) {
    return num < 10 ? "0" + num : num;
}

/**
 * Update button states based on timer status
 */
function updateTimerButtons() {
    const startBtn = document.querySelector(".timer-controls .btn-primary");
    const stopBtn = document.querySelector(".timer-controls .btn-secondary");
    
    if (!startBtn || !stopBtn) return;

    if (timerState.isRunning) {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.6";
        stopBtn.disabled = false;
        stopBtn.style.opacity = "1";
    } else {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        stopBtn.disabled = false;
        stopBtn.style.opacity = "1";
    }
}

/* ─────────────────────────────────────────────────────────
   INITIALIZATION
   ───────────────────────────────────────────────────────── */

/**
 * Initialize the application
 */
function init() {
    const taskInput = document.getElementById("taskInput");
    
    // Focus on input for better UX
    if (taskInput) {
        taskInput.focus();
    }

    // Initialize empty state
    updateProgress();
    renderTasks();
}

/**
 * Add keyboard shortcuts
 */
document.addEventListener("keydown", (event) => {
    // Ctrl+Enter or Cmd+Enter to add task
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        const taskInput = document.getElementById("taskInput");
        if (taskInput === document.activeElement) {
            addTask();
        }
    }

    // Escape to blur input
    if (event.key === "Escape") {
        document.activeElement.blur();
    }
});

/**
 * Initialize on page load
 */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}