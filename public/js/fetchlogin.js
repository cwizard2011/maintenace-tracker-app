const loginurl = 'https://peter-maintenance-app.herokuapp.com/api/v1';

/*  global document:true, fetch:true, window:true */
/*  eslint no-undef: "error"  */
document.getElementById('login-user').value = '';
document.getElementById('login-password').value = '';


const loginForm = document.getElementById('loginForm');
loginForm.onsubmit = (e) => {
  e.preventDefault();

  const loginUser = document.getElementById('login-user').value;
  const loginPassword = document.getElementById('login-password').value;
  const userError = document.getElementById('user-error');
  const passwordError = document.getElementById('password-error');
  const newLogin = {
    username: loginUser,
    email: loginUser,
    password: loginPassword,
  };
  fetch(`${loginurl}/auth/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newLogin),
  })
    .then(res => res.json())
    .then((users) => {
      if (users.message === 'Email/username invalid, please provide valid credentials') {
        passwordError.innerHTML = '';
        userError.innerHTML = users.message;
      }
      if (users.message === 'Password incorrect, try again') {
        userError.innerHTML = '';
        passwordError.innerHTML = users.message;
      }
      if (users.data.role === 'users') {
        window.localStorage.setItem('authToken', users.data.token);
        window.location.href = 'pages/dashboard.html';
      } else if (users.data.role === 'admin') {
        window.localStorage.setItem('authToken', users.data.token);
        window.location.href = 'pages/admindashboard.html';
      }
    }).catch(() => {
      passwordError.innerHTML = 'Couldn\'t login at the moment, please check your internet connection and try again';
      setTimeout(() => {
        passwordError.innerHTML = '';
      }, 2000);
    });
};
