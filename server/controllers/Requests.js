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
          data: {},
          message: 'No request in the database',
          status: 'fail',
        });
      } else {
        res.status(200).json({
          data: {
            requests,
          },
          message: 'Requests found',
          status: 'success',
        });
      }
    } catch (error) {
      res.status(500).json({
        data: {},
        message: 'Oops! my bad, error from the server',
        status: 'error',
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
          data: {},
          message: 'This request is not found in the database',
          status: 'fail',
        });
      } else {
        res.status(200).json({
          data: {
            result,
          },
          message: 'Request found',
          status: 'success',
        });
      }
    } catch (error) {
      res.status(500).json({
        data: {},
        message: 'Oops! my bad, error from the server',
        status: 'error',
      });
    }
  }
  static createRequest(req, res) {
    try {
      const {
        userId,
        requestId,
        title,
        status,
        details,
      } = req.body;
      const request = {
        userId,
        requestId,
        title,
        status,
        details,
      };
      const filter = requests.filter(check =>
        check.requestId === requestId || check.title === title);
      if (filter.length === 0) {
        requests.push(request);
        res.status(201).json({
          data: {
            request,
          },
          message: 'Request created',
          status: 'success',
        });
      } else {
        res.status(409).send({
          data: {},
          message: 'This request has been logged previously',
          status: 'fail',
        });
      }
    } catch (error) {
      res.status(500).json({
        data: {},
        message: 'Oops! my bad, error from the server',
        status: 'error',
      });
    }
  }
}

export default Requests;
