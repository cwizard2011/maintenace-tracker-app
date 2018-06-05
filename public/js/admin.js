/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */

const adminUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const adminToken = localStorage.getItem('authToken');
const adminError = document.getElementById('noAdminRequest');
window.addEventListener('load', () => {
  fetch(`${adminUrl}/requests`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  })
    .then(res => res.json())
    .then((requests) => {
      if (requests.status === 'fail') {
        window.location.href = '../index.html';
      }
      if (requests.data === undefined) {
        adminError.innerHTML = 'No request in the database for now';
      } else {
        let output = '';
        let pending = '';
        let approved = '';
        let resolved = '';
        let rejected = '';
        requests.data.forEach((request) => {
          if (request.currentstatus === 'pending') {
            output += `
              <div class= content-border>
               <p><span class="ssm-font">${request.title}</span>
               <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
               <span class="ssm-font">Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>
               <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
               </p>
              </div>
          `;
            pending += `
              <div class= content-border>
              <p><span class="ssm-font">${request.title}</span>
              <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
              <span class="ssm-font">Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>
              <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
              </p>
              </div>
            `;
          } else if (request.currentstatus === 'approved') {
            output += `
              <div class= content-border>
              <p><span class="ssm-font">${request.title}</span>
              <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
              <span class="ssm-font">Status: <span class= "label success"><ion-icon name="done all"></ion-icon>${request.currentstatus}</span>
              <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
              </p>
              </div>
          `;
            approved += `
            <div class= content-border>
            <p><span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
            <span class="ssm-font">Status: <span class= "label success"><ion-icon name="done all"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
            </p>
            </div>
            `;
          } else if (request.currentstatus === 'rejected') {
            output += `
              <div class= content-border>
              <p><span class="ssm-font">${request.title}</span>
              <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
              <span class="ssm-font">Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>
              <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
              </p>
              </div>
            `;
            rejected += `
            <div class= content-border>
            <p><span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
            <span class="ssm-font">Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
            </p>
            </div>
          `;
          } else if (request.currentstatus === 'resolved') {
            output += `
              <div class= content-border>
              <p><span class="ssm-font">${request.title}</span>
              <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
              <span class="ssm-font">Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>
              <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
              </p>
            </div>
          `;
            resolved += `
              <div class= content-border>
              <p><span class="ssm-font">${request.title}</span>
              <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span>
              <span class="ssm-font">Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>
              <span class="ssm-font"><a href="#?requestId=${request.request_id}" class="detail-btn"><ion-icon name="create"></ion-icon>Details</a></span>
              </p>
            </div>
            `;
          }
        });
        document.getElementById('all').innerHTML = output;
        document.getElementById('pending').innerHTML = pending;
        document.getElementById('approved').innerHTML = approved;
        document.getElementById('rejected').innerHTML = rejected;
        document.getElementById('resolved').innerHTML = resolved;
      }
    });
});

