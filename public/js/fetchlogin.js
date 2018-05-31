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
  const loginError = document.getElementById('login-error');
  const newLogin = {
    username: loginUser,
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
      if (users.status === 'fail') {
        loginError.innerHTML = users.message;
      }
      if (users.data.role === 'users') {
        window.localStorage.setItem('authToken', users.data.token);
        window.location.href = 'pages/dashboard.html';
      } else if (users.data.role === 'admin') {
        window.localStorage.setItem('authToken', users.data.token);
        window.location.href = 'pages/admindashboard.html';
      }
    });
};
