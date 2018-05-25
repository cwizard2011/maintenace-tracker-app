[![Build Status](https://travis-ci.org/cwizard2011/maintenace-tracker-app.svg?branch=develop)](https://travis-ci.org/cwizard2011/maintenace-tracker-app)
[![Coverage Status](https://coveralls.io/repos/github/cwizard2011/maintenace-tracker-app/badge.svg)](https://coveralls.io/github/cwizard2011/maintenace-tracker-app)

# maintenace-tracker-app
Maintenance Tracker App is an application that provides users with the ability to reach out to  operations or repairs department regarding repair or maintenance requests and monitor the  status of their request. 

# Development
The development is broken down into two parts, the server side and the client side. The server side (API/backend) is developed using Express, NodeJs and PostgreSQL for persisting data, Json Web token for authentication. Vanilla Javascript is used for the frontend

## API DOCUMENTATION

# API FEATURE
Maintenance tracker has the following features
work in progress.....

## INSTALLATION
- Clone the repository locally on your desktop using ```git clone https://github.com/cwizard2011/maintenace-tracker-app.git```
- Navigate from your terminal to book-a-meal using ```cd maintenace-tracker-app```
- Pull the development branch using ```git pull origin develop```
- Install the dependencies using ```npm install```
- Create a ```.env``` file at the root of the project following the guide in ```.env.example``` to setup your port
- You can view the app using ```localhost:PORT/```
- Run ```npm run test``` to run all endpoints test

You can also access [maintenance-tracker-app](http://peter-maintenance-app.herokuapp.com/) api on heroku

# TESTING WITH POSTMAN
The API contains different endpoints with their respective payload in the table below

|Endpoints|Functions|Payloads|Requets Method|
|---------|---------|--------|--------------|
|/api/v1/users/requests| Get all requests|No payload|GET|
|/api/v1/users/requests| Post a new requests|userId, requestId, title, status, details| POST|
|/api/v1/users/requests/:requestId| Get request by Id|No payload| GET|
|/api/v1/users/requests/:requestId| Edit a request|No payload| PUT|


# TECHNOLOGIES USED
- [Node-js](https://nodejs.org/en/) Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
- [Javascript-ES6](https://en.wikipedia.org/wiki/ECMAScript) The 6th edition of EcmaScript, officially known as ECMAScript 2015, was finalized in June 2015. This update adds significant new syntax for writing complex applications, including classes and modules, but defines them semantically in the same terms as ECMAScript 5 strict mode
- [Babel](https://babeljs.io/) used for transpiling codes from ES6 to ES5
- [Mocha](https://mochajs.org/) used for setting up tests

....More still loading

# Coding style
- Airbnb is used for style guide to ensure clean code

# Author
Adeoye Peter
