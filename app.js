const attributes = document.querySelectorAll('[data-attribute]');
const avatar = document.querySelector('[data-avatar]');
const newUserButton = document.querySelector('[data-new-user-button]');
const activeAttributeValue = document.querySelector(
  '[data-active-attribute-value]'
);
const activeAttributeLabel = document.querySelector(
  '[data-active-attribute-label]'
);

let selectedAttributes = [];

function getFormatedDate(date) {
  return new Intl.DateTimeFormat('us-EN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function getActiveAttributeValue(user) {
  const activeAttribute = getActiveAttribute();
  const label =
    activeAttribute === 'name'
      ? `Hi, my ${activeAttribute} is`
      : `my ${activeAttribute} is`;
  let value = '';

  switch (activeAttribute) {
    case 'name':
      value = `${user.name.first} ${user.name.last}`;
      break;
    case 'email':
      value = user.email;
      break;
    case 'birthday':
      value = getFormatedDate(user.dob.date);
      break;
    case 'address':
      value = `${user.location.street.number} ${user.location.street.name}`;
      break;
    case 'phone':
      value = `${user.phone}`;
      break;
    case 'password':
      value = `${user.login.password}`;
      break;
    default:
      value = `unknown`;
  }

  return { label, value };
}

function setActiveAttribute(activeAttribute) {
  localStorage.setItem('active_attribute', JSON.stringify(activeAttribute));
}

function getActiveAttribute() {
  return JSON.parse(localStorage.getItem('active_attribute'));
}

function setStoragedUser(user) {
  localStorage.setItem('random_user', JSON.stringify(user));
}

function getStoragedUser() {
  return JSON.parse(localStorage.getItem('random_user'));
}

async function fetchUser() {
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  return data.results[0];
}

async function getUser() {
  return getStoragedUser() ?? (await fetchUser());
}

async function setActiveAttributeValue() {
  const user = await getUser();
  const { label, value } = getActiveAttributeValue(user);

  activeAttributeLabel.innerText = label;
  activeAttributeValue.innerText = value;
}

async function setUser(newUser) {
  const user = newUser ?? (await getUser());
  localStorage.setItem('random_user', JSON.stringify(user));

  avatar.src = user.picture.large;
  const activeAttribute = getActiveAttribute() ?? 'name';
  const activeAttributeElement = document.querySelector(
    `[data-attribute="${activeAttribute}"]`
  );

  handleAttributeElement(activeAttributeElement);
}

function activeAttribute(attribute) {
  const currentActiveAttribute = document.querySelector(
    '[data-attribute].active'
  );
  if (currentActiveAttribute) {
    currentActiveAttribute.classList.remove('active');
  }

  attribute.classList.add('active');
}

function handleAttributeElement(attributeElement) {
  const { attribute } = attributeElement.dataset;
  activeAttribute(attributeElement);
  setActiveAttribute(attribute);
  setActiveAttributeValue();
}

function handleAttributeMouseOver({ currentTarget }) {
  handleAttributeElement(currentTarget);
}

async function handleNewUserButton() {
  const newUser = await fetchUser();
  setUser(newUser);
}

newUserButton.addEventListener('click', handleNewUserButton);
attributes.forEach(attribute =>
  attribute.addEventListener('mouseover', handleAttributeMouseOver)
);

setUser(null);
