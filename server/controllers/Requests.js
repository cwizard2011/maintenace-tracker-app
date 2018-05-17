import requests from '../db/data';

/**
 * @class a request controller
 */
class Requests {
  /**
   * @static method to get All Requests
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} return object as response
  */

  static getAllRequest(req, res) {
    try {
      if (requests.length === 0) {
        res.status(404).json({
          status: 'Not Found',
          code: 404,
          msg: 'No request in the database',
        });
      } else {
        res.status(200).json({
          status: 'ok',
          code: 200,
          result: {
            requests,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Internal Server Error',
        code: 500,
        msg: 'Oops! my bad, error from the server',
      });
    }
  }
  /**
   * @static method to get requests by Id
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} return object as response
  */
  static getRequestById(req, res) {
    try {
      const requestId = parseInt(req.params.requestId, 10);
      const result = requests.filter(re => re.requestId === requestId)[0];

      if (!result) {
        res.status(404).json({
          status: 'Not Found',
          code: 404,
          msg: 'This request is not found in the database',
        });
      } else {
        res.status(200).json({
          status: 'ok',
          code: 200,
          result: {
            result,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Internal Server Error',
        code: 500,
        msg: 'Oops! my bad, error from the server',
      });
    }
  }
}

export default Requests;
