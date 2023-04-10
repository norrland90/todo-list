// Get elements
const form = document.querySelector('.form');
const itemList = document.querySelector('.item-list');
const itemInput = document.querySelector('.form-input');
const priorityInput = document.querySelector('.priority-input');
const checkbox = document.querySelector('.checkbox');
const clearAll = document.querySelector('.clear');
const filterInput = document.querySelector('#filter-input');
const filterPriority = document.querySelector('#priority-filter');
const boxContainer = document.querySelector('.box-container');
const okBtn = boxContainer.querySelector('#ok-btn');
const falseBtn = boxContainer.querySelector('#false-btn');
const trueBtn = boxContainer.querySelector('#true-btn');
let isEditMode = false;

// Functions
function checkIfItems() {
  const itemsFromStorage = getItemsFromStorage();
  if (itemsFromStorage.length === 0) {
    clearAll.style.display = 'none';
  } else {
    clearAll.style.display = 'inline-block';
  }
}

function resetForm() {
  document.querySelector('.form-input').value = '';
  document.querySelector('.priority-input').value = 0;
}

function displayAllItems() {
  itemList.innerHTML = '';
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((i) => {
    addItemToDOM(i[0], i[1]);
  });
}

function onSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  const newPriority = priorityInput.value;

  if (validateInput(newItem, newPriority) === false) {
    return;
  }

  if (isEditMode) {
    editItem(newItem, newPriority);
    return;
  }

  addItemToDOM(newItem, newPriority);

  addItemToLocalStorage(newItem, newPriority);

  checkIfItems();
  resetForm();
}

function validateInput(item, priority) {
  if (item === '' || priority === '0') {
    boxContainer.classList.add('show');
    boxContainer.firstElementChild.nextElementSibling.classList.add('show');
    okBtn.addEventListener('click', () => {
      boxContainer.classList.remove('show');
      boxContainer.firstElementChild.nextElementSibling.classList.remove(
        'show'
      );
    });
    return false;
  } else {
    return true;
  }
}

function addItemToDOM(newItem, newPriority) {
  const newListItem = document.createElement('li');
  newListItem.classList = 'list-item';

  const newCheckbox = createCheckbox('checkbox', 'fa-solid fa-check fa-sm');
  newListItem.appendChild(newCheckbox);

  const newItemText = createItemText(
    'item-text-wrapper',
    'item-text',
    'priority-text',
    newItem,
    newPriority
  );
  newListItem.appendChild(newItemText);

  const newDeleteButton = createDeleteButton(
    'delete-btn',
    'fa-solid fa-trash-can'
  );
  newListItem.appendChild(newDeleteButton);
  itemList.appendChild(newListItem);
  checkIfItems();
}

function createCheckbox(divClass, iconClass) {
  const div = document.createElement('div');
  div.classList = divClass;

  const icon = document.createElement('i');
  icon.classList = iconClass;

  div.appendChild(icon);

  return div;
}

function createItemText(
  wrapperClass,
  itemTextClass,
  priorityTextClass,
  item,
  priority
) {
  const div = document.createElement('div');
  div.classList = wrapperClass;

  const p = document.createElement('p');
  p.classList = itemTextClass;
  p.textContent = item;

  const span = document.createElement('span');
  span.classList = priorityTextClass;
  span.textContent = `(priority ${priority})`;

  div.appendChild(p);
  div.appendChild(span);

  return div;
}

function createDeleteButton(btnClass, iconClass) {
  const button = document.createElement('button');
  button.classList = btnClass;

  const icon = document.createElement('i');
  icon.classList = iconClass;

  button.appendChild(icon);

  return button;
}

function removeItem(e) {
  if (e.target.classList.contains('delete-btn')) {
    e.target.parentElement.remove();
    removeItemFromStorage(
      e.target.parentElement.querySelector('.item-text').textContent
    );
  } else if (e.target.parentElement.classList.contains('delete-btn')) {
    e.target.parentElement.parentElement.remove();
    removeItemFromStorage(
      e.target.parentElement.parentElement.querySelector('.item-text')
        .textContent
    );
  }
  checkIfItems();
}

function getItemsFromStorage() {
  if (localStorage.getItem('items') === null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem('items'));
  }
}

function addItemToLocalStorage(item, priority) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push([item, priority]);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  let newItemsFromStorage = itemsFromStorage.filter((i) => {
    return i[0] !== item;
  });
  localStorage.setItem('items', JSON.stringify(newItemsFromStorage));
}

function onClearAllClick() {
  boxContainer.classList.add('show');
  boxContainer.firstElementChild.classList.add('show');
  trueBtn.addEventListener('click', () => {
    clearAllItems();
    boxContainer.classList.remove('show');
    boxContainer.firstElementChild.classList.remove('show');
  });
  falseBtn.addEventListener('click', () => {
    boxContainer.classList.remove('show');
    boxContainer.firstElementChild.classList.remove('show');
  });
}

function clearAllItems() {
  itemList.innerHTML = '';
  clearItemsFromStorage();
  checkIfItems();
}

function clearItemsFromStorage() {
  localStorage.setItem('items', JSON.stringify([]));
}

function startEditMode(e) {
  if (e.target.classList.contains('item-text')) {
    isEditMode = true;
    const item = e.target;
    item.parentElement.parentElement.classList.add('edit-mode');
    const text = e.target.textContent;
    itemInput.value = text;
    const addBtn = form.querySelector('.add-btn');
    addBtn.innerHTML = 'Edit';
  }
}

function editItem(newItem, newPriority) {
  const itemToEdit = itemList.querySelector('.edit-mode');
  const itemText =
    itemToEdit.firstElementChild.nextElementSibling.firstElementChild
      .textContent;
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item, index) => {
    if (item[0] === itemText) {
      itemsFromStorage[index][0] = newItem;
      itemsFromStorage[index][1] = newPriority;
    }
  });
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  endEditMode();
  displayAllItems();
  resetForm();
}

function endEditMode() {
  isEditMode = false;
  const addBtn = form.querySelector('.add-btn');
  addBtn.innerHTML = 'Add';
}

function toggleCheckbox(e) {
  if (e.target.classList.contains('checkbox')) {
    e.target.classList.toggle('checked');
  } else if (e.target.parentElement.classList.contains('checkbox')) {
    e.target.parentElement.classList.toggle('checked');
  }
}

function filterByPriority(e) {
  itemList.innerHTML = '';
  const priority = filterPriority.value;
  if (priority === '0') {
    displayAllItems();
  } else {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((i) => {
      if (i[1] === priority) {
        addItemToDOM(i[0], i[1]);
      }
    });
  }
}

function filterByInput(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('.list-item');
  items.forEach((i) => {
    const itemText = i.querySelector('.item-text').textContent.toLowerCase();
    if (itemText.indexOf(text) !== -1) {
      i.style.display = 'flex';
    } else {
      i.style.display = 'none';
    }
  });
}

// Event Listeners
form.addEventListener('submit', onSubmit);
itemList.addEventListener('click', removeItem);
itemList.addEventListener('click', toggleCheckbox);
itemList.addEventListener('dblclick', startEditMode);
clearAll.addEventListener('click', onClearAllClick);
filterPriority.addEventListener('input', filterByPriority);
filterInput.addEventListener('keyup', filterByInput);
checkIfItems();
displayAllItems();
