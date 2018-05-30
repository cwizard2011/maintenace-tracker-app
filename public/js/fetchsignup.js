const url = 'https://peter-maintenance-app.herokuapp.com/api/v1';

/*  global document:true, fetch:true, window:true */
/*  eslint no-undef: "error"  */

const signupForm = document.getElementById('signup-form');
document.getElementById('firstname').value = '';
document.getElementById('lastname').value = '';
document.getElementById('email').value = '';
document.getElementById('username').value = '';
document.getElementById('password').value = '';

signupForm.onsubmit = (e) => {
  e.preventDefault();

  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');
  const newUserReg = {
    firstname,
    lastname,
    email,
    username,
    password,
  };
  fetch(`${url}/auth/signup`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUserReg),
  })
    .then(res => res.json())
    .then((users) => {
      if (users.status === 'fail') {
        message.innerHTML = users.message;
      } else {
        window.location.href = 'pages/congrats.html';
      }
    });
};
