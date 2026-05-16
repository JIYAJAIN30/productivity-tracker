/* =========================================
   SELECT ELEMENTS
========================================= */

const taskInput =
  document.getElementById("taskInput");

const taskList =
  document.getElementById("taskList");

const progressBar =
  document.getElementById("progressBar");

const progressText =
  document.getElementById("progressText");

const streakText =
  document.getElementById("streak");

/* =========================================
   STREAK
========================================= */

let streak = 0;

streakText.innerText = streak;

/* =========================================
   ADD TASK
========================================= */

function addTask(){

  if(taskInput.value.trim() === ""){
    return;
  }

  const li =
    document.createElement("li");

  li.innerHTML = `

    <span class="task-text">
      ${taskInput.value}
    </span>

    <div class="task-buttons">

      <button
        class="complete-btn"
        onclick="completeTask(this)">

        Complete

      </button>

      <button
        class="delete-btn"
        onclick="deleteTask(this)">

        Delete

      </button>

    </div>
  `;

  taskList.appendChild(li);

  taskInput.value = "";

  updateProgress();
}

/* =========================================
   COMPLETE TASK
========================================= */

function completeTask(button){

  const task =
    button.closest("li");

  /* Prevent multiple clicks */

  if(task.classList.contains("completed")){
    return;
  }

  /* ADD COMPLETED CLASS */

  task.classList.add("completed");

  /* BUTTON CHANGE */

  button.innerText =
    "Completed";

  button.disabled = true;

  button.style.background =
    "#00b894";

  /* UPDATE STREAK */

  streak++;

  streakText.innerText = streak;

  /* UPDATE PROGRESS */

  updateProgress();

  /* CONFETTI */

  confetti();
}

/* =========================================
   DELETE TASK
========================================= */

function deleteTask(button){

  const task =
    button.closest("li");

  task.remove();

  updateProgress();
}

/* =========================================
   RESET TASKS
========================================= */

function resetTasks(){

  taskList.innerHTML = "";

  progressBar.style.width = "0%";

  progressText.innerText =
    "0% Completed";

  streak = 0;

  streakText.innerText = streak;

  alert(
    "All Tasks Reset Successfully!"
  );
}

/* =========================================
   FINALIZE TASKS
========================================= */

function finalizeTasks(){

  updateProgress();

  alert(
    "Tasks Finalized Successfully!"
  );
}

/* =========================================
   UPDATE PROGRESS
========================================= */

function updateProgress(){

  const allTasks =
    document.querySelectorAll(
      "#taskList li"
    );

  const completedTasks =
    document.querySelectorAll(
      "#taskList li.completed"
    );

  let percent = 0;

  if(allTasks.length > 0){

    percent = Math.round(
      (
        completedTasks.length /
        allTasks.length
      ) * 100
    );
  }

  progressBar.style.width =
    percent + "%";

  progressText.innerText =
    `${percent}% Completed`;
}

/* =========================================
   ENTER KEY SUPPORT
========================================= */

taskInput.addEventListener(
  "keypress",
  function(e){

    if(e.key === "Enter"){
      addTask();
    }
  }
);

/* =========================================
   POMODORO TIMER
========================================= */

let timeLeft = 1500;

let timer;

let isRunning = false;

const timeDisplay =
  document.getElementById("time");

const modeDisplay =
  document.getElementById("mode");

/* UPDATE TIMER */

function updateTimerDisplay(){

  let minutes =
    Math.floor(timeLeft / 60);

  let seconds =
    timeLeft % 60;

  timeDisplay.innerText =

    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

/* START TIMER */

function startTimer(){

  if(isRunning){
    return;
  }

  isRunning = true;

  timer = setInterval(()=>{

    if(timeLeft > 0){

      timeLeft--;

      updateTimerDisplay();
    }

    else{

      clearInterval(timer);

      alert(
        "⏰ Session Completed!"
      );

      if(
        modeDisplay.innerText ===
        "Focus Time"
      ){

        modeDisplay.innerText =
          "Break Time";

        timeLeft = 300;
      }

      else{

        modeDisplay.innerText =
          "Focus Time";

        timeLeft = 1500;
      }

      updateTimerDisplay();

      isRunning = false;
    }

  },1000);
}

/* PAUSE TIMER */

function pauseTimer(){

  clearInterval(timer);

  isRunning = false;
}

/* RESET TIMER */

function resetTimer(){

  clearInterval(timer);

  if(
    modeDisplay.innerText ===
    "Focus Time"
  ){

    timeLeft = 1500;
  }

  else{

    timeLeft = 300;
  }

  updateTimerDisplay();

  isRunning = false;
}

/* INITIAL TIMER DISPLAY */

updateTimerDisplay();

/* =========================================
   CONFETTI EFFECT
========================================= */

function confetti(){

  for(let i=0;i<40;i++){

    let conf =
      document.createElement("div");

    conf.style.position = "fixed";

    conf.style.width = "10px";

    conf.style.height = "10px";

    conf.style.background =
      `hsl(${Math.random()*360},
      100%,50%)`;

    conf.style.left =
      Math.random() *
      window.innerWidth + "px";

    conf.style.top = "-10px";

    conf.style.borderRadius = "50%";

    conf.style.zIndex = "999";

    document.body.appendChild(conf);

    let fall = setInterval(()=>{

      conf.style.top =
        parseInt(conf.style.top)
        + 5 + "px";

    },20);

    setTimeout(()=>{

      clearInterval(fall);

      conf.remove();

    },3000);
  }
}