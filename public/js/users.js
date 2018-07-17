/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error" */
/* eslint no-unused-vars: 0 */
const userUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const userToken = localStorage.getItem('authToken');
let usersArray;
let currentUserId;
const userMsg = document.getElementById('noUser');
const confirmDelete = document.getElementById('yesDelete');
const cancelDelete = document.getElementById('noDelete');
const confirmUpdate = document.getElementById('yesUpdate');
const cancelUpdate = document.getElementById('noUpdate');
/**
 * Display the details of each users
 *
 * @param {String} userId - Id of a user
 */
const getUserDetails = (userId) => {
  const data = usersArray.find(user => user.id === userId);
  currentUserId = data.id;
  document.getElementById('user-id').innerHTML = data.id;
  document.getElementById('user-fullname').innerHTML = `${data.firstname} ${data.lastname}`;
  document.getElementById('user-email').innerHTML = data.email;
  document.getElementById('user-role').innerHTML = data.user_role;
  document.getElementById('user-created').innerHTML = new Date(data.created_at).toLocaleString('en-GB', { hour12: true });
  document.getElementById('user-updated').innerHTML = new Date(data.updated_at).toLocaleString('en-GB', { hour12: true });
};

/**
 * Display the details of each users
 *
 * @param {String} userId - Id of a user
 */
const getUserId = (userId) => {
  const data = usersArray.find(user => user.id === userId);
  currentUserId = data.id;
  document.getElementById('del-id').value = data.id;
  document.getElementById('update-id').value = data.id;
};
/**
 * Appends and displays user details on the user table
 *
 * @param {Array} data - A list of requests to be displayed on the Admin table
 */
const userTableBody = (users) => {
  const newTableBody = document.createElement('tbody');
  let counter = 1;
  users.forEach((user) => {
    const newRow = document.createElement('tr');
    const cellNo = newRow.insertCell(0);
    const cellUsername = newRow.insertCell(1);
    const cellEmail = newRow.insertCell(2);
    const cellRole = newRow.insertCell(3);
    const cellDetails = newRow.insertCell(4);
    const cellAction = newRow.insertCell(5);
    cellNo.innerHTML = `<span class=right-text>${counter}</span><span class="hidden" id="user_id">${user.id}</span>`;
    cellUsername.innerHTML = `<span class=right-text>${user.username}<span>`;
    cellEmail.innerHTML = `<span class=right-text>${user.email}<span>`;
    cellRole.innerHTML = `<span class=right-text>${user.user_role}<span>`;
    cellDetails.innerHTML = `<span class=right-text><a href="#user-details" class="detail-btn pending" onclick="getUserDetails('${user.id}')">Details</a><span>`;
    if (user.user_role === 'user') {
      cellAction.innerHTML = `<span class=right-text><a href="#update-user" class="detail-btn pending action-approve" onclick="getUserId('${user.id}')">Update Role</a>
      <a href="#del-user" class="detail-btn danger action-reject" onclick="getUserId('${user.id}')">Delete User</a></span>`;
    } else if (user.user_role === 'admin') {
      cellAction.innerHTML = `<span class=right-text><a href="#update-user" class="detail-btn pending action-approve" onclick="getUserId('${user.id}')">Update Role</a>`;
    }
    newTableBody.append(newRow);
    counter += 1;
  });
  const Table = document.getElementById('user-table');
  Table.removeChild(Table.lastChild);
  return Table.append(newTableBody);
};

const getUsers = () => {
  fetch(`${userUrl}/users`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${userToken}`,
    },
  })
    .then(res => res.json())
    .then((users) => {
      usersArray = users.data;

      if (users.status === 'fail') {
        window.location.href = '../index.html';
      }
      if (users.data === undefined) {
        userMsg.innerHTML = 'Something went wrong, please refresh the page';
      } else {
        userMsg.innerHTML = '';
        document.getElementById('userNo').innerHTML = `${usersArray.length}`;
        userTableBody(users.data);
      }
    });
};

const deleteUser = () => {
  const delId = document.getElementById('del-id').value;
  fetch(`${userUrl}/users/${delId}/remove`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${userToken}`,
    },
  })
    .then(res => res.json())
    .then((deleted) => {
      if (deleted.status === 'fail') {
        userMsg.innerHTML = deleted.message;
        setTimeout(() => {
          userMsg.innerHTML = '';
        }, 2000);
      } else {
        userMsg.innerHTML = deleted.message;
        setTimeout(() => {
          window.location.href = 'users.html';
          userMsg.innerHTML = '';
          getUsers();
        }, 2000);
      }
    });
};

const updateUser = () => {
  const updateId = document.getElementById('update-id').value;
  fetch(`${userUrl}/user/role/${updateId}/update`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${userToken}`,
    },
  })
    .then(res => res.json())
    .then((updated) => {
      if (updated.status === 'fail') {
        userMsg.innerHTML = updated.message;
        setTimeout(() => {
          userMsg.innerHTML = '';
        }, 2000);
      } else {
        userMsg.innerHTML = updated.message;
        setTimeout(() => {
          window.location.href = 'users.html';
          userMsg.innerHTML = '';
          getUsers();
        }, 2000);
      }
    });
};
const noAction = () => {
  setTimeout(() => {
    window.location.replace('users.html');
  }, 500);
};

confirmDelete.addEventListener('click', deleteUser);
confirmUpdate.addEventListener('click', updateUser);
cancelUpdate.addEventListener('click', noAction);
cancelDelete.addEventListener('click', noAction);
window.addEventListener('load', getUsers);
