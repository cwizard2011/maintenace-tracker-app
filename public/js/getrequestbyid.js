/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */

const getByIdUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const idToken = localStorage.getItem('authToken');
const getParameter = (theParameter) => {
  const params = window.location.search.substr(1).split('&');
  for (let i = 0; i < params.length; i += 1) {
    const p = params[i].split('=');
    if (p[0] === theParameter) {
      return decodeURIComponent(p[1]);
    }
  }
  return false;
};
document.getElementById('params').innerHTML = getParameter('requestId');
const requestId = document.getElementById('params').innerHTML;
const getReqError = document.getElementById('getReqErr').innerHTML;
window.addEventListener('load', () => {
  fetch(`${getByIdUrl}/users/requests/${requestId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${idToken}`,
    },
  })
    .then(res => res.json())
    .then((request) => {
      let display = '';
      if (request.status === 'fail') {
        getReqError.innerHTML = request.message;
      }
      if (request.data.currentstatus === 'pending') {
        display += `
        <div class="request-details">
          <h3>Request Details</h3>
          <p class=ssm-font>Title: <span>${request.data.title}</span></p>
          <p>Request Id: <span>${request.data.request_id}</span></p>
          <p>Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.data.currentstatus}</span></p>
          <p>Details: <span>${request.data.details}</span></p>
          <p>Created on: <span> ${new Date(request.data.created_at).toLocaleString('en-GB', { hour12: true })} </span></p>
          <p>Updated on: <span> ${new Date(request.data.updated_at).toLocaleString('en-GB', { hour12: true })} </span></p>
          <p class=center><a href="#modal" class="btn center"><ion-icon name="create"></ion-icon>Edit</a></p>
        </div>
      `;
      } else if (request.data.currentstatus === 'approved') {
        display += `
        <div class="request-details">
          <h3>Request Details</h3>
          <p>Title: <span>${request.data.title}</span></p>
          <p>Request Id: <span>${request.data.request_id}</span></p>
          <p>Status: <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.data.currentstatus}</span></p>
          <p>Details: <span>${request.data.details}</span></p>
          <p>Created on: <span> ${new Date(request.data.created_at).toLocaleString('en-GB', { hour12: true })} </span></p>
          <p>Updated on: <span> ${new Date(request.data.updated_at).toLocaleString('en-GB', { hour12: true })} </span></p>
        </div>
      `;
      } else if (request.data.currentstatus === 'rejected') {
        display += `
        <div class="request-details">
          <h3>Request Details</h3>
          <p>Title: <span>${request.data.title}</span></p>
          <p>Request Id: <span>${request.data.request_id}</span></p>
          <p>Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.data.currentstatus}</span></p>
          <p>Details: <span>${request.data.details}</span></p>
          <p>Created on: <span> ${new Date(request.data.created_at).toLocaleString('en-GB', { hour12: true })} </span></p>
          <p>Updated on: <span> ${new Date(request.data.updated_at).toLocaleString('en-GB', { hour12: true })} </span></p>
        </div>
      `;
      } else if (request.data.currentstatus === 'resolved') {
        display += `
        <div class="request-details">
          <h3>Request Details</h3>
          <p>Title: <span>${request.data.title}</span></p>
          <p>Request Id: <span>${request.data.request_id}</span></p>
          <p>Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.data.currentstatus}</span></p>
          <p>Details: <span>${request.data.details}</span></p>
          <p>Created on: <span> ${new Date(request.data.created_at).toLocaleString('en-GB', { hour12: true })} </span></p>
          <p>Updated on: <span> ${new Date(request.data.updated_at).toLocaleString('en-GB', { hour12: true })} </span></p>
        </div>
      `;
      }
      document.getElementById('display').innerHTML = display;
    }).catch(() => {
      getReqError.innerHTML = 'Couldn\'t fetch request from the database at the moment, please check your internet connection and reload the page';
      setTimeout(() => {
        getReqError.innerHTML = '';
      }, 2000);
    });
});
