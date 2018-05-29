/**
 * @description: Validator for validating request passed into body or params
 *
 * @class Validator class
 *
 */
class Validator {
  /**
   * @static method to validate users request body for title and details
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   *
   * @return {Object} response containing the status of validation
   *
   */
  static checkBody(req, res, next) {
    const {
      title,
      details,
    } = req.body;
    if (title === undefined || title.trim().length === 0) {
      return res.status(400).json({
        message: 'Title is required to post a request',
        status: 'fail',
      });
    } else if (!Number.isNaN(parseInt(title, 10))) {
      return res.status(400).json({
        message: 'Your title must start with alphabet',
        status: 'fail',
      });
    } else if (title.length > 30) {
      return res.status(400).json({
        message: 'Please enter a shorter title less than 30 characters',
        status: 'fail',
      });
    } else if (details === undefined || details.trim().length === 0) {
      return res.status(400).json({
        message: 'Details of the request is required to post a request',
        status: 'fail',
      });
    } else if (!Number.isNaN(parseInt(details, 10))) {
      return res.status(400).json({
        message: 'Details must start with alphabets',
        status: 'fail',
      });
    } else if (details.length > 200) {
      return res.status(400).json({
        message: 'Please summarise the details to 200 characters',
        status: 'fail',
      });
    }
    return next();
  }
  /**
   * @static method to validate the data passed in the edit request
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   *
   * @return {Object} response containing the status of validation
   *
   */
  static editReqBody(req, res, next) {
    const {
      title,
      details,
    } = req.body;
    if (!Number.isNaN(parseInt(title, 10))) {
      return res.status(400).json({
        message: 'Your title must start with alphabet',
        status: 'fail',
      });
    }
    if (details.length > 200) {
      return res.status(400).json({
        message: 'Please summarise the details to 200 characters',
        status: 'fail',
      });
    } else if (!Number.isNaN(parseInt(details, 10))) {
      return res.status(400).json({
        message: 'Details must start with alphabets',
        status: 'fail',
      });
    } else if (title.length > 30) {
      return res.status(400).json({
        message: 'Please enter a shorter title less than 30 characters',
        status: 'fail',
      });
    }
    return next();
  }

  /**
   *@static: Method for checking users details before signing up a new user
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkUser(req, res, next) {
    const {
      username,
      password,
      firstname,
      lastname,
      email,
    } = req.body;
    if (/^[a-zA-Z][a-zA-Z0-9]{3,10}$/.test(username) === false) {
      return res.status(400).json({
        message: 'Invalid username, username can only be a min. of 3 and max of 10 alphanumeric characters starting with letters',
        status: 'fail',
      });
    } else if (username === undefined) {
      return res.status(400).json({
        message: 'You must provide a username',
        status: 'fail',
      });
    } else if (password === undefined) {
      return res.status(400).json({
        message: 'Password must be supplied',
        status: 'fail',
      });
    } else if (
      /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{8,}$/.test(password) === false) {
      return res.status(400).json({
        message: 'Password must be alphanumeric and should contain a minimum of 8 characters',
        status: 'fail',
      });
    } else if (firstname === undefined) {
      return res.status(400).json({
        message: 'You must provide your first Name',
        status: 'fail',
      });
    } else if (lastname === undefined) {
      return res.status(400).json({
        message: 'You must provide your last Name',
        status: 'fail',
      });
    } else if (firstname.length > 20 || lastname.length > 20) {
      return res.status(400).json({
        message: 'Name too long, please restrict name to 20 characters including spaces',
        status: 'fail',
      });
    } else if (/^[A-Za-z]+$/.test(firstname) === false || /^[A-Za-z]+$/.test(lastname) === false) {
      return res.status(400).json({
        message: 'Invalid Name, name can only contain alphabets',
        status: 'fail',
      });
    } else if (email === undefined) {
      return res.status(400).json({
        message: 'You must provide an email address',
        status: 'fail',
      });
    } else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false) {
      return res.status(400).json({
        message: 'Invalid email, please enter correct email',
        status: 'fail',
      });
    }
    return next();
  }
  /**
   *@static: Method for checking if username or password is provided before signing in a user
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkLogin(req, res, next) {
    const { username, password } = req.body;
    if (username === undefined) {
      return res.status(400).json({
        message: 'Please provide your username',
        status: 'fail',
      });
    } else if (password === undefined) {
      return res.status(400).json({
        message: 'Please provide your password',
        status: 'fail',
      });
    }
    return next();
  }
}
export default Validator;
