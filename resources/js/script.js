// Get elements
const form = document.querySelector('.form');
const itemList = document.querySelector('.item-list');
const itemInput = document.querySelector('.form-input');
const priorityInput = document.querySelector('.priority-input');
const checkbox = document.querySelector('.checkbox');
const clearAll = document.querySelector('.clear');

// Functions
function displayAllItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((i) => {
    addItemToDOM(i[0], i[1]);
  });
}

function validateInput(item, priority) {
  if (item === '' || priority === '0') {
    alert('You must add and item and priority');
    return false;
  } else {
    return true;
  }
}

function onSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  const newPriority = priorityInput.value;

  if (validateInput(newItem, newPriority) === false) {
    return;
  }

  addItemToDOM(newItem, newPriority);

  addItemToLocalStorage(newItem, newPriority);

  document.querySelector('.form-input').value = '';
  document.querySelector('.priority-input').value = 0;
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
  span.textContent = `priority ${priority}`;

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

function clearAllItems() {
  itemList.innerHTML = '';
  clearItemsFromStorage();
}

function clearItemsFromStorage() {
  localStorage.setItem('items', JSON.stringify([]));
}

function toggleCheckbox() {
  checkbox.classList.toggle('checked');
}

// Event Listeners
form.addEventListener('submit', onSubmit);
itemList.addEventListener('click', removeItem);
clearAll.addEventListener('click', clearAllItems);
checkbox.addEventListener('click', toggleCheckbox);
displayAllItems();
