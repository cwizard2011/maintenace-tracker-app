/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error" */
/* eslint no-unused-vars: 0 */

const adminUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const adminToken = localStorage.getItem('authToken');
const adminError = document.getElementById('noAdminRequest');
const actionMessage = document.getElementById('action-msg');
const approveRequest = (requestId) => {
  fetch(`${adminUrl}/requests/${requestId}/approve`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  })
    .then(res => res.json())
    .then((approved) => {
      if (approved.status === 'fail') {
        actionMessage.innerHTML = approved.message;
      } else {
        window.location.href = './admindashboard.html';
        actionMessage.innerHTML = approved.message;
      }
    });
};
const rejectRequest = (requestId) => {
  fetch(`${adminUrl}/requests/${requestId}/disapprove`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  })
    .then(res => res.json())
    .then((rejected) => {
      if (rejected.status === 'fail') {
        actionMessage.innerHTML = rejected.message;
      } else {
        window.location.href = './admindashboard.html';
        actionMessage.innerHTML = rejected.message;
      }
    });
};
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
               <p>Title: <span class="ssm-font">${request.title}</span>
               <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
               <p><span class="ssm-font">Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>
               <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
               </p>
               <p>Details: <span class="ssm-font">${request.details}</span></p>
               <p><button class="detail-btn pending action-approve" onclick="approveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Approve</button>
               <button class="detail-btn danger action-reject" onclick="rejectRequest('${request.request_id}')"><ion-icon name="close"></ion-icon>Reject</button>
               </p>
              </div>
          `;
            pending += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
            <p><button class="detail-btn pending action-approve" onclick="approveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Approve</button>
            <button class="detail-btn danger action-reject" onclick="rejectRequest('${request.request_id}')"><ion-icon name="close"></ion-icon>Reject</button>
            </p>
           </div>
            `;
          } else if (request.currentstatus === 'approved') {
            output += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
            <p><button class="detail-btn pending action-resolve" onclick="resolveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Resolve</button>
            </p>
           </div>
          `;
            approved += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
            <p><button class="detail-btn pending action-resolve" onclick="resolveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Resolve</button>
            </p>
           </div>
            `;
          } else if (request.currentstatus === 'rejected') {
            output += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
           </div>
            `;
            rejected += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
           </div>
          `;
          } else if (request.currentstatus === 'resolved') {
            output += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
           </div>
          `;
            resolved += `
            <div class= content-border>
            <p>Title: <span class="ssm-font">${request.title}</span>
            <span class="ssm-font">Sender: <span>${request.firstname} ${request.lastname}</span></span></p>
            <p><span class="ssm-font">Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>
            <span class="ssm-font">Created at: <span>${new Date(request.created_at).toLocaleString('en-GB', { hour12: true })}</span></span>
            </p>
            <p>Details: <span class="ssm-font">${request.details}</span></p>
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

