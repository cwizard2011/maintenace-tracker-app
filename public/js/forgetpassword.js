/*  global document:true, window:true */
/*  eslint no-undef: "error"  */

const forgetPassword = document.getElementById('forgetPassword');
const passBtn = document.getElementById('forget-password');
const passSpan = document.getElementsByClassName('password-close')[0];

// Login button

passBtn.onclick = () => {
  forgetPassword.style.display = 'block';
};
passSpan.onclick = () => {
  forgetPassword.style.display = 'none';
};
window.onclick = (event) => {
  if (event.target === forgetPassword) {
    forgetPassword.style.display = 'none';
  }
};
