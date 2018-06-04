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
      display += `
        <div class=center>
          <h3>Request Details</h3>
          <h4>Title</h4>
          <span>${request.data.title}</span>
          <h4>Request Id</h4>
          <span>${request.data.request_id}</span>
          <h4>Status</h4>
          <span>${request.data.currentstatus}</span>
          <h4>Details</h4>
          <p>${request.data.details}</p>
          <h4>Created Date</h4>
          <span> ${new Date(request.data.created_at).toLocaleString('en-GB', { hour12: true })} </span>
        </div>
      `;
      document.getElementById('display').innerHTML = display;
    });
});
