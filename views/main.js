const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const filters = document.querySelectorAll(".filter");
let filter = '';



function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
    
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo)  {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});


function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}


function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}


filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
  
});




const toDos = document.querySelector('#toDo');
toDos.addEventListener('click', () => {
  const { action } = toDos.dataset;
  if(action==='show' || toDos.style.display==='none'){
    toDos.dataset.action = 'hide';
    $('#toggle').show("slide", { direction: "right" }, 1000);
  }else{
    toDos.dataset.action = 'show';
    $('#toggle').hide("slide", {direction: "right" }, 1000);
  }

});

const point = document.querySelector('#points');
point.addEventListener('click', () => {
  toDos.dataset.action = 'show';
  $('#toggle').hide("slide", {direction: "right" }, 1000);
  
});

const aiChat = document.querySelector('#aiChat');
aiChat.addEventListener('click', () => {
  const { action } = aiChat.dataset;
  if(action==='show' ){
    aiChat.dataset.action = 'hide';
    $('#toggle2').show("slide", { direction: "right" }, 1000);
  }else{
    aiChat.dataset.action = 'show';
    $('#toggle2').hide("slide", {direction: "right" }, 1000);
  }

});

const point2 = document.querySelector('#points2');
point2.addEventListener('click', () => {
  aiChat.dataset.action = 'show';
  $('#toggle2').hide("slide", {direction: "right" }, 1000);
});


const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15

};

function updateTimers() {
  
  const pomodoroTimeInput = document.getElementById("pomodoroTime");
  const shortBreakTimeInput = document.getElementById("shortBreakTime");
  const longBreakTimeInput = document.getElementById("longBreakTime");

  const pomodoroTime = parseInt(pomodoroTimeInput.value);
  const shortBreakTime = parseInt(shortBreakTimeInput.value);
  const longBreakTime = parseInt(longBreakTimeInput.value);

  if (isNaN(pomodoroTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
    alert("Please enter valid numeric values for the timer durations.");
  } else {
    stopTimer();
    timer.pomodoro = pomodoroTime;
    timer.shortBreak = shortBreakTime;
    timer.longBreak = longBreakTime;
    updateClock();
    switchMode('pomodoro');

    }
  }


const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
  const { action } = mainButton.dataset;
  if (action === 'start') {
    startTimer();
  } else {
    stopTimer();
  }
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.textContent = 'start';
  mainButton.classList.remove('active');
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  min.textContent = minutes;
  sec.textContent = seconds;
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document.body.style.backgroundColor = `var(--${mode})`;

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  switchMode('pomodoro');
});

showTodos();