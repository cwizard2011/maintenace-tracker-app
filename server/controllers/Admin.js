import validate from 'uuid-validate';
import pool from '../models/database';
import Mailer from '../helpers/Mailer';


/**
 * @description: Contoller for users request
 *
 * @class a request controller
 *
 */
class RequestController {
  /**
   * @static: Method to get all requests in the database
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   *
  */
  static getAllRequest(req, res) {
    pool.query(
      'SELECT user_id, userlist.firstname, userlist.lastname, userlist.email, request_id, title, details, currentstatus, requests.created_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id ORDER BY requests.created_at DESC',
      (err, result) => {
        if (result.rows.length > 0) {
          return res.status(200).json({
            data: result.rows,
            message: 'All requests successfully retrieved',
            status: 'success',
          });
        }
        return res.status(200).json({
          message: 'No request in the database',
          status: 'success',
        });
      },
    );
  }
  /**
   *@static: Method for approving a request
   *
   * @param {object} req - request object
   * @param {object} res - response object
   */
  static approveRequest(req, res) {
    const { requestId } = req.params;
    const updatedAt = new Date();
    if (validate(requestId) === false) {
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'fail',
      });
    }
    const newQuery = {
      text: 'UPDATE requests SET currentstatus = $1, updated_at = $3 WHERE request_id = $2 RETURNING *;',
      values: ['approved', requestId, updatedAt],
    };
    pool.query(newQuery, (err, result) => {
      if (result) {
        Mailer.sendRequestStatus(requestId);
        return res.status(200).json({
          data: result.rows[0],
          message: 'Request has been approved',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'This request has already been taken care of, check the request details for more info',
        status: 'fail',
      });
    });
    return null;
  }
  /**
   *@static: Method for rejecting a request
   *
   * @param {object} req - request object
   * @param {object} res - response object
   */
  static rejectRequest(req, res) {
    const { requestId } = req.params;
    const updatedAt = new Date();
    if (validate(requestId) === false) {
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'fail',
      });
    }
    const newQuery = {
      text: 'UPDATE requests SET currentstatus = $1, updated_at = $3 WHERE request_id = $2 RETURNING *;',
      values: ['rejected', requestId, updatedAt],
    };
    pool.query(newQuery, (err, result) => {
      if (result) {
        Mailer.sendRequestStatus(requestId);
        return res.status(200).json({
          data: result.rows[0],
          message: 'Request has been successfully rejected',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'This request has already been taken care of, check the request details for more info',
        status: 'fail',
      });
    });
    return null;
  }
  /**
   *@static: Method for resolving a request
   *
   * @param {object} req - request object
   * @param {object} res - response object
   */
  static resolveRequest(req, res) {
    const { requestId } = req.params;
    const updatedAt = new Date();
    if (validate(requestId) === false) {
      return res.status(400).json({
        message: 'Invalid Id, please provide a valid uuid',
        status: 'fail',
      });
    }
    const newQuery = {
      text: 'UPDATE requests SET currentstatus = $1, updated_at = $3 WHERE request_id = $2 RETURNING *;',
      values: ['resolved', requestId, updatedAt],
    };
    pool.query(newQuery, (err, result) => {
      if (result) {
        Mailer.sendRequestStatus(requestId);
        return res.status(200).json({
          data: result.rows[0],
          message: 'Request has been successfully resolved',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'This request has already been taken care of, check the request details for more info',
        status: 'fail',
      });
    });
    return null;
  }
}
export default RequestController;
