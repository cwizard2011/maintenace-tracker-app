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
  const postTitle = document.getElementById('post-title');
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
      if (request.status === 'success') {
        window.location.href = './dashboard.html';
      } else if (request.message === 'This request has already been logged, Please log a new request') {
        postTitle.innerHTML = request.message;
        setTimeout(() => {
          postTitle.innerHTML = '';
        }, 2000);
      } else if (request.message.errors.details) {
        postError.innerHTML = request.message.errors.details;
        setTimeout(() => {
          postError.innerHTML = '';
        }, 2000);
      } else if (request.message.errors.title) {
        postTitle.innerHTML = request.message.errors.title;
        setTimeout(() => {
          postTitle.innerHTML = '';
        }, 2000);
      }
    }).catch(() => {
      postError.innerHTML = 'Couldn\'t fetch request from the database at the moment, please check your internet connection and reload the page';
      setTimeout(() => {
        postError.innerHTML = '';
      }, 2000);
    });
};
