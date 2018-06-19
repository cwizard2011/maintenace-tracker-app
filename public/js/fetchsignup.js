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
  const errorFirstname = document.getElementById('error-firstname');
  const errorLastname = document.getElementById('error-lastname');
  const errorUsername = document.getElementById('error-username');
  const errorEmail = document.getElementById('error-email');
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
      if (users.status === 'success') {
        message.innerHTML = '';
        message.innerHTML = users.message;
        window.localStorage.setItem('authToken', users.data.token);
        setTimeout(() => {
          window.location.href = 'pages/dashboard.html';
        }, 500);
      } else if (users.message === 'Username or email has already been registered, please change your email or username, or login with your password') {
        message.innerHTML = '';
        errorFirstname.innerHTML = '';
        errorLastname.innerHTML = '';
        errorUsername.innerHTML = '';
        errorEmail.innerHTML = users.message;
      } else if (users.message.errors.firstname) {
        message.innerHTML = '';
        errorFirstname.innerHTML = users.message.errors.firstname;
        errorLastname.innerHTML = '';
        errorUsername.innerHTML = '';
        errorEmail.innerHTML = '';
      } else if (users.message.errors.lastname) {
        message.innerHTML = '';
        errorFirstname.innerHTML = '';
        errorLastname.innerHTML = users.message.errors.lastname;
        errorUsername.innerHTML = '';
        errorEmail.innerHTML = '';
      } else if (users.message.errors.username) {
        message.innerHTML = '';
        errorFirstname.innerHTML = '';
        errorLastname.innerHTML = '';
        errorUsername.innerHTML = users.message.errors.username;
        errorEmail.innerHTML = '';
      } else if (users.message.errors.password) {
        errorFirstname.innerHTML = '';
        errorLastname.innerHTML = '';
        errorUsername.innerHTML = '';
        errorEmail.innerHTML = '';
        message.innerHTML = users.message.errors.password;
      } else if (users.message.errors.email) {
        errorFirstname.innerHTML = '';
        errorLastname.innerHTML = '';
        errorUsername.innerHTML = '';
        errorEmail.innerHTML = users.message.errors.email;
        message.innerHTML = '';
      }
    });
};
