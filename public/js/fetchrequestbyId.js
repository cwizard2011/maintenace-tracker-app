/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */

const requestUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const token = localStorage.getItem('authToken');

window.addEventListener('load', () => {
  fetch(`${requestUrl}/users/requests/${requestId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${token}`,
    },
  })
    .then(res => res.json())
    .then((requests) => {
      console.log(requests.data);
      let output = '<div></div>';
      requests.data.forEach((request) => {
        output += `
            <div class= curved-border>
              <h4><a href=${request.request_id}>Title: ${request.title}</a></h4>
              <h6>Request id: <span>${request.request_id}</span></h6>
              </div>

        `;
      });
      document.getElementById('output').innerHTML = output;
    });
});
