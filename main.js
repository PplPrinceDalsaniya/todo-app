// selet elements in DOM
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const messageDiv = document.querySelector("#message");
const clearAllButton = document.querySelector("#clearAllBtn");
const filters = document.querySelectorAll(".nav-item");

// array of taskObj.
let todoItems = [];

// Onload add all Event Listeners.
document.addEventListener("DOMContentLoaded", () => {
    taskForm.addEventListener("submit", handleSubmitForm);
    filters.forEach((tab) => {
            tab.addEventListener("click", handleFilters);
    })
    taskList.addEventListener("click", handleTaskEvents);
    clearAllButton.addEventListener("click", handleClearAllEvent);
    getTasksFromLocalStorage();
    renderToDo(todoItems);
});

/*
        EVENT HANDLERS.
        All functions required for addEventListeners are here.
*/

// adds or updates the task.
function handleSubmitForm(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const currentIndex = document.querySelector("#currentIndex").value;

        if (taskText.length === 0) {
                showAlert("Please Enter some text for Task.", "alert-danger");
                return;
        } else  {
                const taskObj = {
                        text: taskText,
                        isDone: false,
                        addedAt: new Date().getTime()
                };
                //checking if there is an currentIndex set or not. If it is set then it would be edit case.
                if (currentIndex != "") {
                        //adding the updated task at the same index.
                        todoItems.splice(currentIndex, 1, taskObj);
                        showAlert("Task updated.", "alert-success");
                        document.querySelector("#currentIndex").value = "";
                } else {
                        todoItems.push(taskObj);
                        showAlert("New task is added.", "alert-success");
                }
                setTasksToLocalStorage(todoItems);
        }

        // change tab to all tasks when we add any new task from any tab.
        document.querySelector(".active").classList.remove("active");
        document.querySelector(".nav-link").classList.add("active");
        document.querySelector("#filterType").value = "all";
        taskInput.value = "";
        renderFilteredTasks("all");
};

// filters tab navigation.
function handleFilters(e) {
        e.preventDefault();
        const filterType = this.getAttribute("data-type");
        document.querySelectorAll(".nav-link").forEach((nav) => {
                nav.classList.remove("active");
        });
        this.firstElementChild.classList.add("active");
        document.querySelector("#filterType").value = filterType;
        renderFilteredTasks(filterType);
};

// update, done, delete.
function handleTaskEvents(e) {
        e.preventDefault();
        if (e.target.getAttribute("name") == "done")
                taskDone(e);
        else if (e.target.getAttribute("name") == "delete")
                taskDelete(e);
        else if (e.target.getAttribute("name") == "edit")
                taskEdit(e);
};

// clearAllTasks button clear all tasks.
function handleClearAllEvent(e) {
        e.preventDefault();
        todoItems = [];
        setTasksToLocalStorage(todoItems);
        showAlert("Cleared All Tasks.", "alert-success");
        taskInput.focus();

        // change tab to all tasks when we clear all tasks.
        document.querySelector(".active").classList.remove("active");
        document.querySelector(".nav-link").classList.add("active");
        document.querySelector("#filterType").value = "all";
        renderFilteredTasks("all");
}

/*
        UTILITY FUNCTIONS.
        All functions required event handler functions are here.
*/

// fetches todoItems array from the localStorage.
function getTasksFromLocalStorage() {
        const todosFromStorage = localStorage.getItem("todoItems");
        if (todosFromStorage === "undefined" || todosFromStorage === null) {
                todoItems = [];
        } else {
                todoItems = JSON.parse(todosFromStorage);
        }
};

// sets todoItems array to the localStorage.
const setTasksToLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

// shows alert on the page for 2 seconds.
function showAlert(message, msgClass) {
  //msgClass = type of message, ie. success, danger, error, etc.
  messageDiv.innerHTML = message;
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show", msgClass);
    messageDiv.classList.add("hide");
  }, 2000);
  return;
};

// renders todoList after fetching array from the localStorage.
function renderToDo(todoItemsArr) {
        taskList.innerHTML = '';
        getTasksFromLocalStorage();
        if (todoItemsArr.length > 0) {
                todoItemsArr.forEach((task) => {
                        const iconClass = task.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                        const textDecoration = task.isDone ? 'line-through' : 'none';
                        taskList.insertAdjacentHTML(
                          "afterbegin",
                          `<li class="list-group-item d-flex justify-content-between align-items-center">
                                        <span class="task" style="text-decoration:${textDecoration};" date-time="${task.addedAt}">${task.text}</span> 
                                        <span>
                                                <a href="#" data-edit><i name="edit" class="bi bi-pencil-square"></i></a>
                                                <a href="#" data-done><i name="done" class="bi ${iconClass} green"></i></a>
                                                <a href="#" data-delete><i name="delete" class="bi bi-x-circle red"></i></a>
                                        </span>
                                </li>`
                        );
                });
        } else {
                taskList.insertAdjacentHTML(
                        "beforeend",
                        `<li class="list-group-item d-flex justify-content-between align-items-center">
                                You don't have any Tasks.
                        </li>`
                );
        }
};

// updates isDone property of the task which was selected.
function taskDone(e) {
        e.preventDefault();
        /*
                getting actual task element from this taskDone icon. 
                `<li class="list-group-item d-flex justify-content-between align-items-center">
this is taskElemt       <span class="task" date-time="${task.addedAt}">${task.text}</span> 
                        <span>
we are here in 'i' tag -->      <a href="#" data-done><i name="done" class="bi ${iconClass} green"></i></a>   
                                <a href="#" data-delete><i name="delete" class="bi bi-x-circle red"></i></a>
                        </span>
                </li>`
        */
        let taskElement = e.target.parentNode.parentNode.parentNode.firstElementChild;
        let taskDateTime = taskElement.getAttribute("date-time");
        let currentItemIndex = todoItems.findIndex((task) => task.addedAt.toString() === taskDateTime);
        let currentItem = todoItems[currentItemIndex];

        taskElement.style.textDecoration = (taskElement.style.textDecoration == "none") ? 'line-through' : 'none';
        const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
        
        //changing status of this current task.
        currentItem.isDone = !currentItem.isDone;

        //adding the updated task at the same index.
        todoItems.splice(currentItemIndex, 1, currentItem);
        
        //updating status of this task in local storage.
        setTasksToLocalStorage(todoItems);

        const newClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
        e.target.classList.replace(currentClass, newClass);

        // otherwise when we mark it done. It will be in the same place instead of getting removed.
        const filterType = document.querySelector("#filterType").value;
        renderFilteredTasks(filterType);
};

// removes task from todoItems array.
function taskDelete(e) {
        e.preventDefault();
        /*
                getting actual task element from this taskDone icon. 
                `<li class="list-group-item d-flex justify-content-between align-items-center">
this is taskElemt       <span class="task" date-time="${task.addedAt}">${task.text}</span> 
                        <span>
                                <a href="#" data-done><i name="done" class="bi ${iconClass} green"></i></a>   
we are here in 'i' tag -->      <a href="#" data-delete><i name="delete" class="bi bi-x-circle red"></i></a>
                        </span>
                </li>`
        */
        let taskElementParent = e.target.parentNode.parentNode.parentNode;
        let taskElement = taskElementParent.firstElementChild;
        let taskDateTime = taskElement.getAttribute("date-time");
        let currentItemIndex = todoItems.findIndex(task => task.addedAt.toString() === taskDateTime);

        if (confirm("Are you sure want to delete this Task?")) {
                console.log(taskElementParent);
                taskList.removeChild(taskElementParent);
                todoItems.splice(currentItemIndex, 1);
                setTasksToLocalStorage(todoItems);
                showAlert("Item has been deleted.", "alert-success");
        }
};

// sets the currentIndex to the selected card, so in handleSubmitForm, it updates the task.
function taskEdit(e) {
        e.preventDefault();

        let taskElement = e.target.parentNode.parentNode.parentNode.firstElementChild;
        let taskDateTime = taskElement.getAttribute("date-time");
        let currentItemIndex = todoItems.findIndex((task) => task.addedAt.toString() === taskDateTime);
        let currentItem = todoItems[currentItemIndex];

        document.querySelector("#currentIndex").value = currentItemIndex;
        taskInput.value = currentItem.text;
        taskInput.focus();
};

// renders filtered tasks as asked.
function renderFilteredTasks(type) {
        let filteredTasks = [];

        switch(type) {
                case "remaining" :
                        filteredTasks = todoItems.filter((item) => !item.isDone);
                        break;
                case "finished" :
                        filteredTasks = todoItems.filter((item) => item.isDone);
                        break;
                default :
                        filteredTasks = todoItems;
                        break;
        }
        renderToDo(filteredTasks);
};