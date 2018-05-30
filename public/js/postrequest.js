/*  global document:true, fetch:true, window:true, localStorage:true */
/*  eslint no-undef: "error"  */
const postUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const postToken = localStorage.getItem('authToken');

const requestForm = document.getElementById('reqForm');
document.getElementById('title').value = '';
document.getElementById('details').value = '';

requestForm.onsubmit = (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const details = document.getElementById('details').value;
  const postError = document.getElementById('post-error');
  const newPost = {
    title,
    details,
  };
  fetch(`${postUrl}/users/requests`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${postToken}`,
    },
    body: JSON.stringify(newPost),
  })
    .then(res => res.json())
    .then((request) => {
      if (request.status === 'fail') {
        postError.innerHTML = request.message;
      } else {
        window.location.href = './dashboard.html';
      }
    });
};
