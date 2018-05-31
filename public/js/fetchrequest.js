/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error"  */

const requestUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const token = localStorage.getItem('authToken');
const requestError = document.getElementById('noRequest');
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
      if (requests.status === 'fail') {
        requestError.innerHTML = requests.message;
        window.location.href = '../index.html';
      }
      if (requests.data === undefined) {
        requestError.innerHTML = 'You haven\'t create any request, click on new request to send a new request';
      } else {
        let output = '';
        requests.data.forEach((request) => {
          if (request.currentstatus === 'pending') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label pending"><ion-icon name="pause"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}&title=${request.title}&details=${request.details}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          } else if (request.currentstatus === 'approved') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label success"><ion-icon name="done-all"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          } else if (request.currentstatus === 'rejected') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label danger"><ion-icon name="close"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          } else if (request.currentstatus === 'resolved') {
            output += `
            <div>
              <div class= curved-border>
                <h3>${request.title}</h3>
                <p>Status: <span class= "label success"><ion-icon name="build"></ion-icon>${request.currentstatus}</span>
                <span class="icon"><a href="./getrequestbyid.html?requestId=${request.request_id}" class="view-btn" id=${request.request_id}><ion-icon name="create"></ion-icon>Details</a></span></p>
          </div>
        </div>
          `;
          }
        });
        document.getElementById('output').innerHTML = output;
      }
    });
});

