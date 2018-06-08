import Validator from 'validatorjs';
/**
 * @description: Validator for validating request passed into body or params
 *
 * @class Validator class
 *
 */
class Validators {
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
    const validation = new Validator(req.body, {
      title: 'required|min:5|max:30|regex:/[\\w\\W]*/',
      details: 'required|min:30|max:150|regex:/[\\w\\W]*/',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
    });
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
    const validation = new Validator(req.body, {
      title: 'min:5|max:30|regex:/[\\w\\W]*/',
      details: 'min:30|max:150|regex:/[\\w\\W]*/',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
    });
  }

  /**
   *@static: Method for checking users details before signing up a new user
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkUser(req, res, next) {
    const validation = new Validator(req.body, {
      username: 'required|min:5|max:8|alpha_num',
      password: 'required|min:8|max:30|alpha_num',
      email: 'required|email',
      firstname: 'required|min:3|max:10|alpha',
      lastname: 'required|min:3|max:10|alpha',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
    });
  }
  /**
   *@static: Method for checking if username or password is provided before signing in a user
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkLogin(req, res, next) {
    const { username, email, password } = req.body;
    if (username === undefined && email === undefined) {
      return res.status(400).json({
        message: 'Username or email is required to login',
        status: 'fail',
      });
    } else if (password === undefined) {
      return res.status(400).json({
        message: 'Password is required to login',
        status: 'fail',
      });
    }
    return next();
  }
}
export default Validators;
