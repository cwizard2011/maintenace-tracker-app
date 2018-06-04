/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */
const editUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const editToken = localStorage.getItem('authToken');
const getParameters = (theParameter) => {
  const params = window.location.search.substr(1).split('&');
  for (let i = 0; i < params.length; i += 1) {
    const p = params[i].split('=');
    if (p[0] === theParameter) {
      return decodeURIComponent(p[1]);
    }
  }
  return false;
};
document.getElementById('param').innerHTML = getParameters('requestId');
document.getElementById('title').value = getParameters('title');
document.getElementById('details').innerHTML = getParameters('details');
const editId = document.getElementById('param').innerHTML;
const editError = document.getElementById('edit-error');

const updateForm = document.getElementById('updateForm');
updateForm.onsubmit = (e) => {
  const title = document.getElementById('title').value;
  const details = document.getElementById('details').value;
  e.preventDefault();
  fetch(`${editUrl}/users/requests/${editId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${editToken}`,
    },
    body: JSON.stringify({ title, details }),
  })
    .then(res => res.json())
    .then((requests) => {
      if (requests.status === 'success') {
        window.location.href = './dashboard.html';
      } else if (requests.message === 'Admin has already looked into this request, Please check the current status of the request') {
        editError.innerHTML = '';
        editError.innerHTML = requests.message;
      } else if (requests.message.errors.details) {
        editError.innerHTML = '';
        editError.innerHTML = requests.message.errors.details;
      } else if (requests.message.errors.title) {
        editError.innerHTML = '';
        editError.innerHTML = requests.message.errors.title;
      }
    });
};
