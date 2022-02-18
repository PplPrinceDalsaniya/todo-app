// selet elements in DOM

const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");
const clearButton = document.querySelector("#clearBtn");
const filters = document.querySelectorAll(".nav-item");

// create an empty array for tasks(items).
let todoItems = [];

// showing alert when we add item, or errors.
const showAlert = function (message, msgClass) {
  //msgClass = type of message, ie. success, danger, error, etc.
  console.log("msg");
  messageDiv.innerHTML = message;
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show", msgClass);
    messageDiv.classList.add("hide");
  }, 2000);
  return;
};

// filter tab tasks
const getFilteredItems = function (type) {
  let filterItems = [];
  switch (type) {
    case "remaining":
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "finished":
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    default:
      filterItems = todoItems;
  }
  setList(filterItems);
};

//delete item
const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
};

// handle item
const handleItem = function (itemData) {
  //getting all tasks in HTML code.
  //itemData is from JS array. It is an object of text, isdone, addedAt.
  const items = document.querySelectorAll(".list-group-item");

  items.forEach((item) => {
    if (
      item.querySelector(".task").getAttribute("data-time") == itemData.addedAt
    ) {
      // done
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        //changing status of this current task.
        currentItem.isDone = currentItem.isDone ? false : true;

        //adding the updated task at the same index.
        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);

        const newClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currentClass, newClass);
        const filterType = document.querySelector("#filterType").value;
        getFilteredItems(filterType);
      });

      //delete
      item
        .querySelector("[data-delete]")
        .addEventListener("click", function (e) {
          e.preventDefault();
          if (confirm("Are you sure want to delete this Task?")) {
            itemList.removeChild(item);
            removeItem(item);
            setLocalStorage(todoItems);
            showAlert("Item has been deleted.", "alert-success");
            return todoItems.filter((item) => item != itemData);
          }
        });
    }
  });
};

//set list on the page.
const setList = function (todoItems) {
  itemList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";

      itemList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="task" data-time="${item.addedAt}">${item.text}</span> 
          <span>
              <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
          </span>
        </li>`
      );
      handleItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        You don't have any Tasks.
      </li>`
    );
  }
};

// get localstorage from the page
const getFromLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
  }
  setList(todoItems);
};
// set list in local storage
const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

document.addEventListener("DOMContentLoaded", () => {
  // Add Task
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = itemInput.value.trim();

    //checking if task is empty or not.
    if (taskText.length === 0) {
      showAlert("Please enter Task.", "alert-danger");
      return;
    } else {
      // Add new Task
      const taskObj = {
        text: taskText,
        isDone: false,
        addedAt: new Date().getTime(),
      };
      todoItems.push(taskObj);

      // set local storage
      setLocalStorage(todoItems);
      showAlert("New item has been added.", "alert-success");
    }

    setList(todoItems);
    itemInput.value = "";
  });

  // Filters
  filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      document.querySelector("#filterType").value = tabType;
      getFilteredItems(tabType);
    });
  });

  // load items
  getFromLocalStorage();
});
