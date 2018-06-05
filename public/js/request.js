/*  global window:true, document:true */
/*  eslint no-undef: "error"  */
const modal = document.getElementById('reqModal');
const btn = document.getElementById('reqBtn');
const span = document.getElementsByClassName('close')[0];
const reqForm = document.getElementById('reqForm');

btn.onclick = () => {
  modal.style.display = 'block';
};


span.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};
reqForm.onsubmit = (e) => {
  e.preventDefault();
  window.location.href = './dashboard.html';
};
