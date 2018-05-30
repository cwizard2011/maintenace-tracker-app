/*  global document:true, window:true */
/*  eslint no-undef: "error"  */

const loginModal = document.getElementById('loginModal');
const logBtn = document.getElementById('login');
const loginSpan = document.getElementsByClassName('login-close')[0];

// Login button

logBtn.onclick = () => {
  loginModal.style.display = 'block';
};
loginSpan.onclick = () => {
  loginModal.style.display = 'none';
};
window.onclick = (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }
};
