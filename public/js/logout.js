/*  global document:true, window:true */
/*  eslint no-undef: "error"  */
const logout = document.querySelector('.logout-client');

logout.onclick = (e) => {
  e.preventDefault();
  window.localStorage.setItem('authToken', '');
  window.location.href = '../index.html';
};
