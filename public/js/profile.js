/*  global window:true, fetch:true, document:true, localStorage:true */
/*  eslint no-undef: "error" */
/* eslint no-unused-vars: 0 */

const profileUrl = 'https://peter-maintenance-app.herokuapp.com/api/v1';
const profileToken = localStorage.getItem('authToken');

// Get user profile details

const fullName = document.getElementById('fullName');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const memberSince = document.getElementById('memberSince');
const userRole = document.getElementById('userRole');
const uploadedImage = document.getElementById('uploadedImage');
const profileError = document.getElementById('profileError');

const getProfile = () => {
  fetch(`${profileUrl}/users/profile`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token: `${profileToken}`,
    },
  }).then(res => res.json())
    .then((userProfile) => {
      if (userProfile.message === 'Please login with your username and password') {
        profileError.innerHTML = userProfile.message;
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000);
      } else if (userProfile.status === 'fail') {
        profileError.innerHTML = userProfile.message;
        setTimeout(() => {
          profileError.innerHTML = 'Please check your internet connection and reload this page';
        }, 2000);
      }
      fullName.innerHTML = `${userProfile.data.firstname} ${userProfile.data.lastname}`;
      userName.innerHTML = userProfile.data.username;
      userEmail.innerHTML = userProfile.data.email;
      userRole.innerHTML = userProfile.data.userRole;
      memberSince.innerHTML = `${new Date(userProfile.data.memberSince).toLocaleString('en-GB', { hour12: true })}`;
      if (userProfile.data.profilePics === null) {
        uploadedImage.innerHTML = '<h1 class="no-image">Upload Image</h1>';
      } else {
        uploadedImage.innerHTML = `<img src=${userProfile.data.profilePics} height=200px width=200px>`;
      }
    });
};

// Get user profile details end

window.addEventListener('load', getProfile);
