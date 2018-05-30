/*  global document:true, window:true */
/*  eslint no-undef: "error"  */
const modal = document.getElementById('signupModal');
const signBtn = document.getElementById('sign-up');
const span = document.getElementsByClassName('close')[0];

signBtn.onclick = () => {
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
