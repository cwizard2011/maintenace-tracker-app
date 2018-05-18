/**
 * Validator for validating request passed into body or params
 * @class Validator class
 */

class Validator {
  /**
   * Checks for request Id parameter
   * @static method to validate request Id
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   * @return {Object} response containing the status of validation
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
   * @static method to validate users request body
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   * @return {Object} response containing the status of validation
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
   * @static method to validate users request body
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   * @return {Object} response containing the status of validation
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
   * @static method to validate users request body
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next callback function
   * @return {Object} response containing the status of validation
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
}
export default Validator;
