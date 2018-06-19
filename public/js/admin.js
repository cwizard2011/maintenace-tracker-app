/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error" */
/* eslint no-unused-vars: 0 */

const adminUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const adminToken = localStorage.getItem('authToken');
const adminError = document.getElementById('noAdminRequest');
const actionMessage = document.getElementById('action-msg');
let requestsArray;
let currentRequestId;


// Implementing pagination

// Pagination ends

const getRequestDetails = (requestId) => {
  const data = requestsArray.find(request => request.request_id === requestId);
  currentRequestId = data.request_id;
  document.getElementById('id-sender').innerHTML = `${data.firstname} ${data.lastname}`;
  document.getElementById('id-request').innerHTML = data.request_id;
  document.getElementById('id-title').innerHTML = data.title;
  document.getElementById('id-details').innerHTML = data.details;
  document.getElementById('id-email').innerHTML = data.email;
  document.getElementById('id-date').innerHTML = new Date(data.created_at).toLocaleString('en-GB', { hour12: true });
  if (data.currentstatus === 'pending') {
    document.getElementById('id-status').innerHTML = `<span class= "label pending"><ion-icon name="pause"></ion-icon>${data.currentstatus}</span>`;
  } else if (data.currentstatus === 'approved') {
    document.getElementById('id-status').innerHTML = `<span class= "label success"><ion-icon name="done-all"></ion-icon>${data.currentstatus}</span>`;
  } else if (data.currentstatus === 'rejected') {
    document.getElementById('id-status').innerHTML = `<span class= "label danger"><ion-icon name="close"></ion-icon>${data.currentstatus}</span>`;
  } else if (data.currentstatus === 'resolved') {
    document.getElementById('id-status').innerHTML = `<span class= "label success"><ion-icon name="build"></ion-icon>${data.currentstatus}</span>`;
  }
};

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
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 2000);
      } else {
        actionMessage.innerHTML = approved.message;
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 2000);
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
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 2000);
      } else {
        actionMessage.innerHTML = rejected.message;
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 2000);
      }
    });
};
const resolveRequest = (requestId) => {
  fetch(`${adminUrl}/requests/${requestId}/resolve`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  })
    .then(res => res.json())
    .then((resolved) => {
      if (resolved.status === 'fail') {
        actionMessage.innerHTML = resolved.message;
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 2000);
      } else {
        actionMessage.innerHTML = resolved.message;
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 500);
      }
    });
};
const resetRequest = (requestId) => {
  fetch(`${adminUrl}/requests/${requestId}/reset`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  })
    .then(res => res.json())
    .then((reset) => {
      if (reset.status === 'fail') {
        actionMessage.innerHTML = reset.message;
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 2000);
      } else {
        actionMessage.innerHTML = reset.message;
        setTimeout(() => {
          actionMessage.innerHTML = '';
        }, 500);
      }
    });
};
const fetchRequest = () => {
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
        let all = '';
        let pending = '';
        let approved = '';
        let resolved = '';
        let rejected = '';
        requestsArray = requests.data;

        requests.data.forEach((request) => {
          if (request.currentstatus === 'pending') {
            all += `
              <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-approve" onclick="approveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Approve</button>
                <button class="detail-btn danger action-reject" onclick="rejectRequest('${request.request_id}')"><ion-icon name="close"></ion-icon>Reject</button></span></td>
              </tr> 
          `;
            pending += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-approve" onclick="approveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Approve</button>
                <button class="detail-btn danger action-reject" onclick="rejectRequest('${request.request_id}')"><ion-icon name="close"></ion-icon>Reject</button></span></td>
              </tr>
            `;
          } else if (request.currentstatus === 'approved') {
            all += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-approve" onclick="resolveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Resolve</button>
                <button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span>
                </td>
              </tr>
          `;
            approved += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-approve" onclick="resolveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Resolve</button>
                <button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span>
                </td>
              </tr>
            `;
          } else if (request.currentstatus === 'rejected') {
            all += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span></td>
              </tr>
            `;
            rejected += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span></td>
              </tr>
          `;
          } else if (request.currentstatus === 'resolved') {
            all += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span></td>
              </tr>
          `;
            resolved += `
            <tr>
                <td scope=row data-label='S/N'></td>
                <td data-label='Title'>${request.title}</td>
                <td data-label='Status'> <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span></td>
                <td data-label='Sender'><span>${request.firstname} ${request.lastname}</span></td>
                <td data-label='Details'><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a></td>
                <td data-label='Actions'><span><button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span></td>
              </tr>
            `;
          }
        });
        document.getElementById('body-all').innerHTML = all;
        document.getElementById('body-pending').innerHTML = pending;
        document.getElementById('approve-all').innerHTML = approved;
        document.getElementById('reject-all').innerHTML = rejected;
        document.getElementById('resolve-all').innerHTML = resolved;
      }
    }).catch(() => {
      adminError.innerHTML = 'Couldn\'t fetch request from the database at the moment, please check your internet connection and reload the page';
      setTimeout(() => {
        adminError.innerHTML = '';
      }, 10000);
    });
};
window.addEventListener('load', fetchRequest);
window.addEventListener('click', fetchRequest);

