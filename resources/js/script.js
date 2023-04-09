// Get elements
const form = document.querySelector('.form');
const itemList = document.querySelector('.item-list');
const itemInput = document.querySelector('.form-input');
const priorityInput = document.querySelector('.priority-input');
// const deleteButton = document.querySelectorAll('.delete-btn');

// Functions
function validateInput(item, priority) {
  if (item === '' || priority === '0') {
    alert('You must add and item and priority');
    return false;
  } else {
    return true;
  }
}

function addNewItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  const newPriority = priorityInput.value;

  if (validateInput(newItem, newPriority) === false) {
    return;
  }

  const newListItem = document.createElement('li');
  newListItem.classList = 'list-item';

  const newCheckBox = createCheckbox('checkbox', 'fa-solid fa-check fa-sm');
  newListItem.appendChild(newCheckBox);

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

  document.querySelector('.form-input').value = '';
  document.querySelector('.priority-input').value = 0;
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
  console.log(e.target);
  if (e.target.classList.contains('delete-btn')) {
    e.target.parentElement.remove();
  } else if (e.target.parentElement.classList.contains('delete-btn')) {
    e.target.parentElement.parentElement.remove();
  }
}

// Event Listeners
form.addEventListener('submit', addNewItem);
itemList.addEventListener('click', removeItem);
