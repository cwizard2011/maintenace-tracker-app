/*  global window:true, fetch:true, document:true */
/*  eslint no-undef: "error"  */
const reseturl = 'https://peter-maintenance-app.herokuapp.com/api/v1';

const getPasswordParameter = (theParameter) => {
  const params = window.location.search.substr(1).split('&');
  for (let i = 0; i < params.length; i += 1) {
    const p = params[i].split('=');
    if (p[0] === theParameter) {
      return decodeURIComponent(p[1]);
    }
  }
  return false;
};
document.getElementById('userId').value = getPasswordParameter('i');
document.getElementById('token').value = getPasswordParameter('t');
const resetError = document.getElementById('confirm-password-error');
const passResetForm = document.getElementById('passResetForm');
passResetForm.onsubmit = (e) => {
  e.preventDefault();

  const userId = document.getElementById('userId').value;
  const token = document.getElementById('token').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    resetError.innerHTML = 'Please type your password again, new password and confirm password field are not similar';
  } else {
    const resetBody = {
      id: userId,
      token,
      password: newPassword,
    };
    fetch(`${reseturl}/auth/resetpassword`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetBody),
    })
      .then(res => res.json())
      .then((users) => {
        if (users.status === 'fail') {
          resetError.innerHTML = '';
          resetError.innerHTML = users.message;
        }
        if (users.status === 'success') {
          resetError.innerHTML = 'Congratulations, you have create a new password, please go home and login with your new password';
          setTimeout(() => {
            window.location.href = '../index.html';
          }, 5000);
        }
      });
  }
};
