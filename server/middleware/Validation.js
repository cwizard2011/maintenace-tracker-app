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
      details: 'required|min:10|max:150|regex:/[\\w\\W]*/',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
      code: 400,
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
      details: 'min:10|max:150|regex:/[\\w\\W]*/',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
      code: 400,
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
      username: 'required|min:5|max:15|alpha_num',
      password: 'required|min:8|max:30|alpha_num',
      email: 'required|email',
      firstname: 'required|min:3|max:15|alpha',
      lastname: 'required|min:3|max:15|alpha',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
      code: 400,
    });
  }

  /**
   *@static: Method for checking oldpassword field and newpassword field
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkPasswordUpdate(req, res, next) {
    const validation = new Validator(req.body, {
      oldpassword: 'required',
      newpassword: 'required|min:8|max:30|alpha_num',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
      code: 400,
    });
  }
  /**
   *@static: Method for checking oldpassword field and newpassword field
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkQueries(req, res, next) {
    const { page } = req.query;
    if (page <= 0) {
      return res.status(400).json({
        message: 'Page number can only be positive integer',
        status: 'fail',
        code: 400,
      });
    }
    const validation = new Validator(req.query, {
      page: 'numeric',
      reqStatus: 'alpha',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
      code: 400,
    });
  }
  /**
   *@static: Method for checking password reset field
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkPasswordReset(req, res, next) {
    const validation = new Validator(req.body, {
      id: 'required',
      token: 'required',
      password: 'required|min:8|max:30|alpha_num',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      message: validation.errors,
      status: 'fail',
      code: 400,
    });
  }
  /**
   *@static: Method for checking password reset request field
   *
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {function} next - callback function calling on the next middleware
   */
  static checkPasswordRequest(req, res, next) {
    const { email, username } = req.body;
    if (email === undefined && username === undefined) {
      return res.status(400).json({
        message: 'Username or email is required to to make request for password reset',
        status: 'fail',
        code: 400,
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
    const { username, email, password } = req.body;
    if (username === undefined && email === undefined) {
      return res.status(400).json({
        message: 'Username or email is required to login',
        status: 'fail',
        code: 400,
      });
    } else if (password === undefined) {
      return res.status(400).json({
        message: 'Password is required to login',
        status: 'fail',
        code: 400,
      });
    }
    return next();
  }
}
export default Validators;
