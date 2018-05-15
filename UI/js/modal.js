const signUpForm = document.getElementById('signUpForm');
const loginForm = document.getElementById('loginForm');
const loginModal = document.getElementById('loginModal');
const logBtn = document.getElementById('login')
const modal = document.getElementById('signupModal');
const signBtn = document.getElementById('sign-up');
const signUp = document.getElementById('signUp')
const logIn = document.getElementById('logIn')
const span = document.getElementsByClassName("close")[0];
const loginSpan = document.getElementsByClassName("login-close")[0];

signBtn.onclick = () => {
    modal.style.display = "block";
}
signUp.onclick = () => {
  modal.style.display = "block";
}

span.onclick = () => {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
signUpForm.onsubmit = (e) => {
  e.preventDefault();
  window.location.href = 'pages/dashboard.html';

};

// Login button

logBtn.onclick = () => {
    loginModal.style.display = "block";
}
logIn.onclick = () => {
    loginModal.style.display = "block"
}
loginSpan.onclick = () => {
    loginModal.style.display = "none";
}
window.onclick = (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
}
loginForm.onsubmit = (e) => {
  e.preventDefault();
  window.location.href = 'pages/dashboard.html';

};