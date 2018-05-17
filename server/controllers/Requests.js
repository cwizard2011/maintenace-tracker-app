import requests from '../db/data';

/**
 *
 * @class a request controller
 */
class Requests {
  /**
   * @static method to get All Requests
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} res
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
          results: {
            requests,
          },
        });
      }
    } catch (error) {
      res.json({
        status: 'Internal Server Error',
        code: 500,
        msg: 'Oops! my bad, error from the server',
      });
    }
  }
}

export default Requests;
