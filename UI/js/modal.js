const signUpForm = document.getElementById('signUpForm');
const modal = document.getElementById('signupModal');
const btn = document.getElementById('sign-up');
const signUp = document.getElementById('signUp')
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}
signUp.onclick = () => {
  modal.style.display = "block"
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
signUpForm.onsubmit = (e) => {
  e.preventDefault();
  window.location.href = './index.html';

};