/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error" */
/* eslint no-unused-vars: 0 */

const adminUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const adminToken = localStorage.getItem('authToken');
const adminError = document.getElementById('noAdminRequest');
const actionMessage = document.getElementById('action-msg');
let requestsArray;
let currentRequestId;
let currentPage = 1;
let requestStatus;
const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');

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
/**
 * Appends and displays requests on the admin table
 *
 * @param {Array} data - A list of requests to be displayed on the Admin table
 */
const createTableBody = (data) => {
  const newTableBody = document.createElement('tbody');
  let counter = 1;
  data.forEach((request) => {
    const newRow = document.createElement('tr');
    const cellNo = newRow.insertCell(0);
    const cellTitle = newRow.insertCell(1);
    const cellStatus = newRow.insertCell(2);
    const cellSender = newRow.insertCell(3);
    const cellDetails = newRow.insertCell(4);
    const cellAction = newRow.insertCell(5);
    cellNo.innerHTML = `<span class=right-text>${counter}</span>`;
    cellTitle.innerHTML = `<span class=right-text>${request.title}</span>`;
    cellSender.innerHTML = `<span class=right-text>${request.firstname} ${request.lastname}<span>`;
    cellDetails.innerHTML = `<span class=right-text><a href="#confirm" class="detail-btn pending" onclick="getRequestDetails('${request.request_id}')">Details</a><span>`;
    if (request.currentstatus === 'pending') {
      cellStatus.innerHTML = `<span class= "label pending right-text"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>`;
      cellAction.innerHTML = `<span class=right-text><button class="detail-btn pending action-approve" onclick="approveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Approve</button>
      <button class="detail-btn danger action-reject" onclick="rejectRequest('${request.request_id}')"><ion-icon name="close"></ion-icon>Reject</button></span>`;
    } else if (request.currentstatus === 'approved') {
      cellStatus.innerHTML = `<span class= "label success right-text"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span>`;
      cellAction.innerHTML = `<span class=right-text><button class="detail-btn pending action-approve" onclick="resolveRequest('${request.request_id}')"><ion-icon name="done-all"></ion-icon>Resolve</button>
      <button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span>`;
    } else if (request.currentstatus === 'rejected') {
      cellStatus.innerHTML = `<span class= "label danger right-text"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>`;
      cellAction.innerHTML = `<span class=right-text><button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span>`;
    } else if (request.currentstatus === 'resolved') {
      cellStatus.innerHTML = `<span class= "label success right-text"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>`;
      cellAction.innerHTML = `<span class=right-text><button class="detail-btn pending action-reject" onclick="resetRequest('${request.request_id}')"><ion-icon name="settings"></ion-icon>Reset</button></span>`;
    }
    newTableBody.append(newRow);
    counter += 1;
  });
  const Table = document.getElementById('request-table');
  Table.removeChild(Table.lastChild);
  return Table.append(newTableBody);
};

const fetchRequest = (page = 1, reqStatus) => {
  fetch(`${adminUrl}/requests?page=${page}&reqStatus=${reqStatus}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  })
    .then(res => res.json())
    .then((requests) => {
      requestsArray = requests.data;
      if (requests.status === 'fail') {
        window.location.href = '../index.html';
      }
      if (requests.data === undefined) {
        adminError.innerHTML = 'No request in the database for now';
      }
      if (requestsArray.length === undefined) {
        adminError.innerHTML = `No ${reqStatus} requests in the database`;
        document.getElementById('requestNo').innerHTML = `No ${reqStatus}`;
      } else {
        adminError.innerHTML = '';
        document.getElementById('requestNo').innerHTML = `${requestsArray.length}`;
        document.getElementById('pageNo').innerHTML = page;
        createTableBody(requests.data);
      }
      if (page === 1 && requestsArray.length >= 10) {
        previousBtn.style.visibility = 'hidden';
        nextBtn.style.visibility = 'visible';
      } else if (page === 1 && requestsArray.length < 10) {
        previousBtn.style.visibility = 'hidden';
        nextBtn.style.visibility = 'hidden';
      } else if (currentPage > 1 && requestsArray.length < 10) {
        previousBtn.style.visibility = 'visible';
        nextBtn.style.visibility = 'hidden';
      } else if (requestsArray.length < 10) {
        nextBtn.style.visibility = 'hidden';
      }
    }).catch(() => {
      adminError.innerHTML = 'Couldn\'t fetch request from the database at the moment, please check your internet connection and reload the page';
      setTimeout(() => {
        adminError.innerHTML = '';
      }, 10000);
    });
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
          fetchRequest();
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
          fetchRequest();
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
          fetchRequest();
        }, 2000);
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
          fetchRequest();
        }, 2000);
      }
    });
};
// Implementing pagination
nextBtn.addEventListener('click', () => {
  currentPage += 1;
  fetchRequest(currentPage, requestStatus);
});
previousBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    fetchRequest(currentPage, requestStatus);
  } else {
    previousBtn.style.visibility = 'hidden';
  }
});
// Pagination ends

// sorting start
const mySort = () => {
  const getValue = document.getElementById('mySelect').value;
  if (getValue === 'all') {
    requestStatus = 'none';
    fetchRequest(currentPage, requestStatus);
  }
  if (getValue === 'pending') {
    requestStatus = 'pending';
    fetchRequest(currentPage, requestStatus);
  }
  if (getValue === 'approved') {
    requestStatus = 'approved';
    fetchRequest(currentPage, requestStatus);
  }
  if (getValue === 'rejected') {
    requestStatus = 'rejected';
    fetchRequest(currentPage, requestStatus);
  }
  if (getValue === 'resolved') {
    requestStatus = 'resolved';
    fetchRequest(currentPage, requestStatus);
  }
};
// sorting ends
// Get user profile details

const fullName = document.getElementById('fullName');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const memberSince = document.getElementById('memberSince');
const uploadedImage = document.getElementById('uploadedImage');

const getProfile = () => {
  fetch(`${adminUrl}/users/profile`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${adminToken}`,
    },
  }).then(res => res.json())
    .then((userProfile) => {
      fullName.innerHTML = `${userProfile.data.firstname} ${userProfile.data.lastname}`;
    });
};

// Get user profile details end

window.addEventListener('load', fetchRequest());
document.getElementById('mySelect').addEventListener('change', mySort);

