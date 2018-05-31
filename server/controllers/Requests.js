import validate from 'uuid-validate';
import pool from '../models/database';


/**
 * @description: Contoller for users request
 *
 * @class a request controller
 *
 */
class Requests {
  /**
   * @static method to get All Requests
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   *
  */

  static getAllRequest(req, res) {
    const query = {
      text: 'SELECT * FROM requests WHERE user_id = $1',
      values: [req.decode.id],
    };
    pool.query(query, (err, result) => {
      if (result.rows.length > 0) {
        return res.status(200).json({
          data: result.rows,
          message: 'Requests successfully retrieved from the database',
          status: 'success',
        });
      }
      return res.status(200).json({
        message: 'No request for this user',
        status: 'success',
      });
    });
  }
  /**
   * @static method to get requests by Id
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   *
  */
  static getRequestById(req, res) {
    const { requestId } = req.params;
    if (validate(requestId) === false) {
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'fail',
      });
    }
    const query = {
      text: 'SELECT * FROM requests WHERE request_id = $1 AND user_id = $2',
      values: [requestId, req.decode.id],
    };
    pool.query(query, (err, result) => {
      if (result.rows[0]) {
        return res.status(200).json({
          data: result.rows[0],
          message: 'One request successfully retrieved from the database',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'You can\'t get a request that does not belong to you',
        status: 'fail',
      });
    });
    return null;
  }
  /**
   *@static: Create a new request
   *
   * @param {object} req request object
   * @param {object} res response object
   */
  static createRequest(req, res) {
    const { title, details } = req.body;
    const query = {
      text: 'INSERT INTO requests(title, details, user_id) VALUES ($1, $2, $3) RETURNING *',
      values: [title, details, req.decode.id],
    };
    pool.query(query, (err, response) => {
      if (err) {
        return res.status(500).json({
          data: { err },
          message: 'Request not created',
          status: 'error',
        });
      } return res.status(201).json({
        data: {
          request: {
            request_id: response.rows[0].request_id,
            userId: req.decode.id,
            status: response.rows[0].currentStatus,
            title,
            details,
          },
        },
        message: 'Request created successfully',
        status: 'success',
      });
    });
  }
  /**
   * @static editRequest method
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} res
   *
  */
  static editRequest(req, res) {
    const { requestId } = req.params;

    const existingRequest = {
      text: 'SELECT * FROM requests WHERE request_id= $1 AND user_id = $2',
      values: [requestId, req.decode.id],
    };

    pool.query(existingRequest, (err, response) => {
      if (!response) {
        return res.status(400).json({
          message: 'This request Id does not exist',
          status: 'fail',
        });
      }

      const updateRequest = { ...response.rows[0], ...req.body };
      const {
        title,
        details,
      } = updateRequest;
      const update = {
        text: 'UPDATE requests SET title = $1, details = $2 WHERE request_id = $3 AND user_id = $4 RETURNING *',
        values: [title, details, requestId, req.decode.id],
      };
      pool.query(update, (error, result) => {
        if (result) {
          return res.status(200).json({
            data: result.rows[0],
            message: 'Request successfully updated',
            status: 'success',
          });
        }
        return res.status(404).json({
          message: 'Request not found in the database',
          status: 'fail',
        });
      });
      return null;
    });
  }
}

export default Requests;
