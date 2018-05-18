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
    if (Number.isNaN(parseInt(requestId, 10))) {
      return res.status(400).json({
        data: {},
        message: 'You can only enter integers as requestId',
        status: 'fail',
      });
    }
    return next();
  }
}
export default Validator;
