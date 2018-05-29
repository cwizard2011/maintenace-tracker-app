const url = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const signupForm = document.getElementById('signup-form');

signupForm.onsubmit = (e) => {
  e.preventDefault();

  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message')
  const newUserReg = {firstname, lastname, email, username, password};
  fetch(`${url}/auth/signup`, {
    method: 'POST',
    'mode': 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUserReg)
  })
  .then(res => res.json())
  .then(users => {
    if (users.status === 'fail') {
      return message.innerHTML = users.message
    } else {
      window.location.href = 'pages/congrats.html';
    }
  })
  newUserReg.value = '';
}

