/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */

const requestUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const token = localStorage.getItem('authToken');
const requestError = document.getElementById('noRequest');
let requestsArray;
let currentPage = 1;
const btnPrevious = document.getElementById('previous-btn');
const btnNext = document.getElementById('next-btn');
const getRequests = (page = 1) => {
  fetch(`${requestUrl}/users/requests?page=${page}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${token}`,
    },
  })
    .then(res => res.json())
    .then((requests) => {
      if (requests.status === 'fail') {
        requestError.innerHTML = requests.message;
        window.location.href = '../index.html';
      }
      requestsArray = requests.data;
      if (requestsArray.length === undefined) {
        document.getElementById('request-no').innerHTML = `No requests on page ${page}`;
        requestError.innerHTML = `No requests on page ${page}`;
      } else {
        requestError.innerHTML = '';
        document.getElementById('request-no').innerHTML = `${requestsArray.length} Requests`;
      }
      if (requests.data === undefined) {
        requestError.innerHTML = 'You haven\'t create any request, click on new request to send a new request';
      } else {
        let output = '';
        document.getElementById('page-no').innerHTML = page;
        if (page === 1 && requestsArray.length >= 10) {
          btnPrevious.style.visibility = 'hidden';
          btnNext.style.visibility = 'visible';
        } else if (page === 1 && requestsArray.length < 10) {
          btnPrevious.style.visibility = 'hidden';
          btnNext.style.visibility = 'hidden';
        } else if (currentPage > 1 && requestsArray.length < 10) {
          btnPrevious.style.visibility = 'visible';
          btnNext.style.visibility = 'hidden';
        } else if (requestsArray.length < 10) {
          btnNext.style.visibility = 'hidden';
        }
        requests.data.forEach((request) => {
          if (request.currentstatus === 'pending') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}&title=${request.title}&details=${request.details}" class="view-btn"><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          } else if (request.currentstatus === 'approved') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}&title=${request.title}&details=${request.details}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          } else if (request.currentstatus === 'rejected') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}&title=${request.title}&details=${request.details}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          } else if (request.currentstatus === 'resolved') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}&title=${request.title}&details=${request.details}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          }
        });
        document.getElementById('output').innerHTML = output;
      }
    });
};

// Implementing pagination
btnNext.addEventListener('click', () => {
  currentPage += 1;
  getRequests(currentPage);
});
btnPrevious.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    getRequests(currentPage);
  } else {
    btnPrevious.style.visibility = 'hidden';
  }
});
// Pagination ends
window.addEventListener('load', getRequests());
window.addEventListener('click', getRequests());
