/*  global document:true, fetch:true, window:true */
/*  eslint no-undef: "error"  */
const resetUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';

const resetForm = document.getElementById('password-reset-form');
document.getElementById('reset-password').value = '';

resetForm.onsubmit = (e) => {
  e.preventDefault();

  const userField = document.getElementById('reset-password').value;
  const fieldError = document.getElementById('field-error');
  const resetParams = {
    username: userField,
    email: userField,
  };
  fetch(`${resetUrl}/auth/passwordreset`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetParams),
  })
    .then(res => res.json())
    .then((users) => {
      if (users.status === 'fail') {
        fieldError.innerHTML = '';
        fieldError.innerHTML = users.message;
      }
      if (users.status === 'success') {
        fieldError.innerHTML = 'Congratulations, a password reset link has been sent to your email, kindly check your inbox or spam folder';
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 5000);
      }
    });
};
