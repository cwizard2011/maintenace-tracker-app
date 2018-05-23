/**
 * Validator for validating request passed into body or params
 *
 * @class Validator class
 *
 */

class Validator {
  /**
   * Checks for request Id parameter
   *
   * @static method to validate request Id
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   *
   * @return {Object} response containing the status of validation
   *
   */

  static checkReqId(req, res, next) {
    const { requestId } = req.params;
    if (/^[0-9]+$/.test(requestId) === false) {
      return res.status(400).json({
        data: {},
        message: 'You can only enter integers as requestId',
        status: 'fail',
      });
    }
    return next();
  }
  /**
   * Checks for user request body for title and details
   *
   * @static method to validate users request body
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
        data: {},
        message: 'Title is required to post a request',
        status: 'fail',
      });
    } else if (!Number.isNaN(parseInt(title, 10))) {
      return res.status(400).json({
        data: {},
        message: 'Your title must start with alphabet',
        status: 'fail',
      });
    } else if (title.length > 50) {
      return res.status(400).json({
        data: {},
        message: 'Please enter a shorter title less than 50 characters',
        status: 'fail',
      });
    } else if (details === undefined || details.trim().length === 0) {
      return res.status(400).json({
        data: {},
        message: 'Details of the request is required to post a request',
        status: 'fail',
      });
    } else if (!Number.isNaN(parseInt(details, 10))) {
      return res.status(400).json({
        data: {},
        message: 'Details must start with alphabets',
        status: 'fail',
      });
    } else if (details.length > 70) {
      return res.status(400).json({
        data: {},
        message: 'Please summarise the details to 70 characters',
        status: 'fail',
      });
    }
    return next();
  }
  /**
   * Checks for user request body for userId and requestId
   *
   * @static method to validate users request body
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   *
   * @return {Object} response containing the status of validation
   *
   */
  static checkIds(req, res, next) {
    const {
      userId,
      requestId,
    } = req.body;
    if (userId === undefined) {
      return res.status(400).json({
        data: {},
        message: 'User id is required to post a request',
        status: 'fail',
      });
    } else if (/^[0-9]+$/.test(userId) === false) {
      return res.status(400).json({
        data: {},
        message: 'You can only enter integers as userId',
        status: 'fail',
      });
    } else if (requestId === undefined) {
      return res.status(400).json({
        data: {},
        message: 'Request id is required to post a request',
        status: 'fail',
      });
    } else if (/^[0-9]+$/.test(requestId) === false) {
      return res.status(400).json({
        data: {},
        message: 'You can only enter integers as requestId',
        status: 'fail',
      });
    }
    return next();
  }
  /**
   * Checks for user request body for status
   *
   * @static method to validate users request body
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   *
   * @return {Object} response containing the status of validation
   *
   */
  static checkStatus(req, res, next) {
    const { status } = req.body;
    if (status === undefined || status.trim().length === 0) {
      return res.status(400).json({
        data: {},
        message: 'Status is required to post a request',
        status: 'fail',
      });
    } else if (/^[A-z]+$/.test(status) === false) {
      return res.status(400).json({
        data: {},
        message: 'Status cannot be numbers, please enter string',
        status: 'fail',
      });
    }
    return next();
  }
  /**
   *Checks for users details before signing up a new user
   *
   * @static Checkuser method
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkUser(req, res, next) {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
    } = req.body;
    if (/^[a-zA-Z][a-zA-Z0-9]{3,10}$/.test(username) === false) {
      return res.status(400).json({ message: 'Invalid username, username can only be a min. of 3 and max of 10 alphanumeric characters starting with letters' });
    } else if (username === undefined) {
      return res.status(400).json({ message: 'You must provide a username' });
    } else if (password === undefined) {
      return res.status(400).json({ message: 'Password must be supplied' });
    } else if (
      /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{8,}$/.test(password) === false) {
      return res.status(400).json({
        message: 'Password must be alphanumeric and should contain a minimum of 8 characters',
      });
    } else if (firstName === undefined) {
      return res.status(400).json({ message: 'You must provide your first Name' });
    } else if (lastName === undefined) {
      return res.status(400).json({ message: 'You must provide your last Name' });
    } else if (firstName.length > 20 || lastName.length > 20) {
      return res.status(400).json({ message: 'Name too long, please restrict name to 20 characters including spaces' });
    } else if (/^[A-Za-z]+$/.test(firstName) === false || /^[A-Za-z]+$/.test(lastName) === false) {
      return res.status(400).json({ message: 'Invalid Name, name can only contain alphabets' });
    } else if (email === undefined) {
      return res.status(400).json({ message: 'You must provide an email address' });
    } else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false) {
      return res.status(400).json({ message: 'invalid email, please enter correct email' });
    }
    return next();
  }
  /**
   *Checks if username or password is provided before signing in a user
   *
   * @static Checklogin method
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkLogin(req, res, next) {
    const { username, password } = req.body;
    if (username === undefined) {
      return res.status(400).json({
        data: {},
        message: 'Please provide your username',
        status: 'fail',
      });
    } else if (password === undefined) {
      return res.status(400).json({
        data: {},
        message: 'Please provide your password',
        status: 'fail',
      });
    }
    return next();
  }
}
export default Validator;
