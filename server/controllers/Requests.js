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
    const { page } = req.query;
    const offSet = page ? (parseInt(page, 10) - 1) * 10 : 0;
    const query = {
      text: 'SELECT * FROM requests WHERE user_id = $1  ORDER BY created_at DESC LIMIT 10 OFFSET $2;',
      values: [req.decode.id, offSet],
    };
    pool.query(query, (err, result) => {
      if (result.rows.length > 0) {
        return res.status(200).json({
          data: result.rows,
          message: 'Requests successfully retrieved from the database',
          status: 'success',
          code: 200,
        });
      }
      return res.status(200).json({
        data: {},
        message: 'No request on this page',
        status: 'success',
        code: 200,
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
        code: 400,
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
          code: 200,
        });
      }
      return res.status(404).json({
        message: 'You can\'t get a request that does not belong to you',
        status: 'fail',
        code: 404,
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
          code: 500,
        });
      }
      return res.status(201).json({
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
        code: 201,
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
          code: 400,
        });
      }

      const updateRequest = { ...response.rows[0], ...req.body };
      const {
        title,
        details,
      } = updateRequest;
      const updatedAt = new Date();
      const update = {
        text: 'UPDATE requests SET title = $1, details = $2, updated_at = $5 WHERE request_id = $3 AND user_id = $4 RETURNING *',
        values: [title, details, requestId, req.decode.id, updatedAt],
      };
      pool.query(update, (error, result) => {
        if (result) {
          return res.status(200).json({
            data: result.rows[0],
            message: 'Request successfully updated',
            status: 'success',
            code: 200,
          });
        }
        return res.status(404).json({
          message: 'Request not found in the database',
          status: 'fail',
          code: 404,
        });
      });
      return null;
    });
  }
  /**
   * @static - Method to delete a pending request
   *
   * @param {Object} req - Request Object
   * @param {Object} res - Response Object
   */
  static deleteRequest(req, res) {
    const { requestId } = req.params;

    const query = {
      text: 'DELETE FROM requests WHERE request_id = $1 AND user_id = $2 RETURNING *;',
      values: [requestId, req.decode.id],
    };
    pool.query(query, (err, result) => {
      if (result.rows[0]) {
        return res.status(200).json({
          data: result.rows[0],
          message: 'Request successfully deleted',
          status: 'success',
          code: 200,
        });
      }
      return res.status(404).json({
        message: 'Request not found in the database',
        status: 'fail',
        code: 404,
      });
    });
  }
}

export default Requests;
