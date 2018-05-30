/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */

const requestUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const token = localStorage.getItem('authToken');

window.addEventListener('load', () => {
  fetch(`${requestUrl}/users/requests`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${token}`,
    },
  })
    .then(res => res.json())
    .then((requests) => {
      let output = '';
      requests.data.forEach((request) => {
        console.log(request);
        output += `
          <div>
            <div class= curved-border>
              <h4>${request.title}</h4>
              <h6>Request id: <span>${request.request_id}</span></h6>
              <div class="wrap-collabsible">
  <input id=${request.request_id} class="toggle" type="checkbox">
  <label for=${request.request_id} class="lbl-toggle">Details</label>
  <div class="collapsible-content">
    <div class="content-inner">
      <p>Date: <span>${request.created_at}</span></p>
      <p>Status: <span class= "label pending"><ion-icon name="pricetag"></ion-icon>${request.currentstatus}</span></p>
      <h5>Details: </h5>
      <span>${request.details}</span>
    </div>
  </div>
</div>
      </div>
      </div>
        `;
      });
      document.getElementById('output').innerHTML = output;
    });
});
