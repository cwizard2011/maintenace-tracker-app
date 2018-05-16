const modal = document.getElementById('reqModal');
const btn = document.getElementById("reqBtn");
const span = document.getElementsByClassName("close")[0];
const reqForm = document.getElementById('reqForm');

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
reqForm.onsubmit = (e) => {
  e.preventDefault();
  window.location.href = './dashboard.html';

};