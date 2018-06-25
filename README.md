[![Build Status](https://travis-ci.org/cwizard2011/maintenace-tracker-app.svg?branch=develop)](https://travis-ci.org/cwizard2011/maintenace-tracker-app)
[![Coverage Status](https://coveralls.io/repos/github/cwizard2011/maintenace-tracker-app/badge.svg)](https://coveralls.io/github/cwizard2011/maintenace-tracker-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/bff176c8393b39668f7e/maintainability)](https://codeclimate.com/github/cwizard2011/maintenace-tracker-app/maintainability)

# maintenace-tracker-app
Maintenance Tracker App is an application that provides users with the ability to reach out to  operations or repairs department regarding repair or maintenance requests and monitor the  status of their request. 

# Development
The development is broken down into two parts, the server side and the client side. The server side (API/backend) is developed using Express, NodeJs and PostgreSQL for persisting data, Json Web token for authentication. Vanilla Javascript is used for the frontend

## API DOCUMENTATION

# API FEATURE
Maintenance tracker has the following features:

# Authentication
- It makes use of jsonwebtoken for authentication
- Users have to supply their token after login to access all route

# Users
- It allows users to register by supplying details like: username, password, email, firstname and lastname
- Upon registration, a new user account will be created
- Registered users can access all the route except for admin routes
- Authenticated users can upload profile image
- Authenticated users can update password
- Registered users can reset forgotten password

# Requests
- Authenticated users can create a request by supplying the title and details of the request
- Authenticated users can also get all requests that belong to them and not other users request
- Authenticated users can get a request by supplying the request Id and also see the current status of the request
- Authenticated users can edit a request for as long as the request status is still pending
- Authenticated users can delete a request for as long as the request status is still pending

# Admin
- Admin can view all users request
- Admin cannot create a request
- Admin can approve and disapprove any pending request
- Admin cannot resolve any rejected or pending request except requests that have been previously approved
- Admin can reset any non pending request status to pending
- Admin can get list of all users and admins
- Admin can update a user role from user to admin or from admin to user
- Admin can delete a users but cann't delete users with admin role


## INSTALLATION
- Clone the repository locally on your desktop using ```git clone https://github.com/cwizard2011/maintenace-tracker-app.git```
- Navigate from your terminal to book-a-meal using ```cd maintenace-tracker-app```
- Pull the development branch using ```git pull origin develop```
- Install the dependencies using ```npm install```
- Create a ```.env``` file at the root of the project following the guide in ```.env.example``` to setup your port
- You can view the app using ```localhost:PORT/```
- Run ```npm run test``` to run all endpoints test

You can also access [maintenance-tracker-app](http://peter-maintenance-app.herokuapp.com/) api on heroku and Maintenance tracker client [Here](https://maintenance-tracker-client.herokuapp.com/)

# TESTING WITH POSTMAN
The API contains different endpoints with their respective payload in the table below

|Endpoints|Functions|Payloads|Requets Method|
|---------|---------|--------|--------------|
|/api/v1/auth/signup| Create a new user|username, password, firstname, lastname, email| POST|
|/api/v1/auth/login| Login a user|username, password| POST|
|/api/v1/users/profile| Get users profile|No payload| GET|
|/api/v1/users/password/update| Update user password|oldpassword, newpassword| PUT|
|/api/v1/auth/passwordreset| Send password reset link to users email with token and id|username or email| POST|
|/api/v1/auth/resetpassword| Create a new password|id, token, password| POST|
|/api/v1/users/requests| Get all requests for a user|No payload|GET|
|/api/v1/users/requests| Post a new user requests|title, details| POST|
|/api/v1/users/requests/:requestId| Get request by Id|No payload| GET|
|/api/v1/users/requests/:requestId| Modify a pending request|title, details| PUT|
|/api/v1/users/requests/:requestId| Delete a request|No payload| DELETE|
|/api/v1/requests| Get all users request|No payload|GET|
|/api/v1/requests/:requestId/approve| Approve a pending request|No payload| PUT|
|/api/v1/requests/:requestId/disapprove| Disapprove a pending request|No payload| PUT|
|/api/v1/requests/:requestId/resolve| Resolve an approved request|No payload| PUT|
|/api/v1/requests/:requestId/reset| Reset non pending request|No payload| PUT|
|/api/v1/users| Get list of all users|No payload|GET|
|/api/v1/users/:userId/remove| Delete a user| No payload| DELETE|
|/api/v1/users/role/:userId/update| Update a user role| No payload| PUT|
|/api/v1/users/profile/image| Upload a profile image| image(file)| PUT|

# TECHNOLOGIES USED
- [Node-js](https://nodejs.org/en/) Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
- [Javascript-ES6](https://en.wikipedia.org/wiki/ECMAScript) The 6th edition of EcmaScript, officially known as ECMAScript 2015, was finalized in June 2015. This update adds significant new syntax for writing complex applications, including classes and modules, but defines them semantically in the same terms as ECMAScript 5 strict mode
- [Babel](https://babeljs.io/) used for transpiling codes from ES6 to ES5
- [Mocha](https://mochajs.org/) used for setting up tests
- [PostgreSQL](https://www.postgresql.org/) used for setting up relational database
- [Vanilla Js](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for frontend design
- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) for frontend design
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) for styling frontend
- [FETCH API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making Ajax call from the client to the API
- [CLOUDINARY](https://cloudinary.com/) for uploading user profile image

The full API documentation can be Viewed [Here](https://maintenancetracker2.docs.apiary.io/#)

# Coding style
- Airbnb is used for style guide to ensure clean code

# Author
Adeoye Peter
