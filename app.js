const attributes = document.querySelectorAll('[data-attribute]');
const avatar = document.querySelector('[data-avatar]');
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

  console.log(activeAttribute);

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

async function setUser() {
  const user = await getUser();
  localStorage.setItem('random_user', JSON.stringify(user));

  avatar.src = user.picture.large;
  const activeAttribute = getActiveAttribute() ?? 'name';

  setActiveAttribute(activeAttribute);
  setActiveAttributeValue();
}

function activeAttribute(attribute) {
  const currentActiveAttribute = document.querySelector(
    '[data-attribute].active'
  );
  if (currentActiveAttribute) currentActiveAttribute.classList.remove('active');

  attribute.classList.add('active');
}

function handleAttributeMouseOver({ currentTarget }) {
  const { attribute } = currentTarget.dataset;
  activeAttribute(currentTarget);
  setActiveAttribute(attribute);
  setActiveAttributeValue(attribute);
}

attributes.forEach(attribute =>
  attribute.addEventListener('mouseover', handleAttributeMouseOver)
);

setUser();

// cell
// :
// "06-98-11-95-05"
// dob
// :
// {date: '1959-08-02T00:58:35.197Z', age: 64}
// email
// :
// "charline.lemaire@example.com"
// gender
// :
// "female"
// id
// :
// {name: 'INSEE', value: '2590726648865 73'}
// location
// :
// {street: {…}, city: 'Lyon', state: 'Haute-Savoie', country: 'France', postcode: 12654, …}
// login
// :
// {uuid: '28bb4b76-02db-4a9d-a145-2846d53b9707', username: 'goldendog594', password: 'deadpool', salt: 'k1TOJ2Ng', md5: 'bc07d9c03f6a5696e55600a83ae616b4', …}
// name
// :
// {title: 'Ms', first: 'Charline', last: 'Lemaire'}
// nat
// :
// "FR"
// phone
// :
// "02-17-54-04-34"
// picture
// :
// {large: 'https://randomuser.me/api/portraits/women/80.jpg', medium: 'https://randomuser.me/api/portraits/med/women/80.jpg', thumbnail: 'https://randomuser.me/api/portraits/thumb/women/80.jpg'}
// registered
// :
// {date: '2010-04-18T07:51:09.337Z', age: 13}
