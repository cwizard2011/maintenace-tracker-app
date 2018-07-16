/*  global window:true, fetch:true, document:true, localStorage:true, FormData:true */
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

// Upload profile image
const uploadForm = document.getElementById('uploadForm');

uploadForm.onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById('userName').innerHTML;
  const formData = new FormData();
  const fileField = document.querySelector("input[type='file']");

  formData.append('username', username);
  formData.append('image', fileField.files[0]);

  const image = document.getElementById('imageUpload');
  const uploadMessage = document.getElementById('uploadMessage');

  fetch(`${profileUrl}/users/profile/image`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      token: `${profileToken}`,
    },
    body: formData,
  })
    .then(res => res.json())
    .then((profileImage) => {
      if (profileImage.status === 'fail') {
        uploadMessage.innerHTML = profileImage.message;
      } else {
        uploadMessage.innerHTML = profileImage.message;
        uploadedImage.innerHTML = `<img src=${profileImage.data.profileImage} height=200px width=200px>`;
        setTimeout(() => {
          uploadMessage.innerHTML = '';
        }, 2000);
      }
    });
};
// Image upload ends here

// Update user password starts here
const passwordUpdate = document.getElementById('passwordUpdate');

passwordUpdate.onsubmit = (e) => {
  e.preventDefault();
  const oldpassword = document.getElementById('oldPass').value;
  const newpassword = document.getElementById('newPass').value;
  const passConfirm = document.getElementById('passConfirm').value;
  const changeMsg = document.getElementById('changeMsg');

  if (newpassword !== passConfirm) {
    changeMsg.innerHTML = 'New password and confirm password must be the same, please try again';
  } else {
    const data = {
      oldpassword,
      newpassword,
    };
    fetch(`${profileUrl}/users/password/update`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        token: `${profileToken}`,
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then((updatedPass) => {
        if (updatedPass.status === 'fail') {
          changeMsg.innerHTML = updatedPass.message;
        } else {
          changeMsg.innerHTML = updatedPass.message;
          setTimeout(() => {
            window.localStorage.setItem('authToken', '');
            window.location.href = '../index.html';
          }, 2000);
        }
      });
  }
};
window.addEventListener('load', getProfile);
