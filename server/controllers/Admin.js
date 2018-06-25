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
    const { page, reqStatus } = req.query;
    const offSet = page ? (parseInt(page, 10) - 1) * 10 : 0;
    const query = {
      text: RequestController.filterQuery(reqStatus),
      values: [offSet],
    };
    pool.query(query, (err, result) => {
      if (result.rows.length > 0) {
        return res.status(200).json({
          data: result.rows,
          message: 'All requests successfully retrieved',
          status: 'success',
        });
      } else if (result.rows.length === 0) {
        return res.status(200).json({
          data: {},
          message: 'No request on this page',
          status: 'success',
        });
      }
      return res.status(408).json({
        message: 'Something went wrong, request timeout, try again later',
        status: 'fail',
      });
    });
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
  /**
   *@static: Method for resetting the status of a request to pending
   *
   * @param {object} req - request object
   * @param {object} res - response object
   */
  static resetRequest(req, res) {
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
      values: ['pending', requestId, updatedAt],
    };
    pool.query(newQuery, (err, result) => {
      if (result) {
        return res.status(200).json({
          data: result.rows[0],
          message: 'The status of this request has been sucessfully reset',
          status: 'success',
        });
      }
      return res.status(408).json({
        message: 'Something went wrong, request timeout, try again later',
        status: 'fail',
      });
    });
    return null;
  }
  /**
   * @static - Method to retrieve all users from the database
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static getUsers(req, res) {
    const query = {
      text: 'SELECT id, username, email, firstname, lastname, user_role, created_at, updated_at FROM userlist ORDER BY created_at DESC;',
    };
    pool.query(query, (err, response) => {
      if (response.rows.length > 0) {
        return res.status(200).json({
          data: response.rows,
          message: 'Users successfully retrieved from the database',
          status: 'success',
        });
      } else if (response.rows.length === 0) {
        return res.status(200).json({
          message: 'No User in the database',
          status: 'success',
        });
      }
      return res.status(408).json({
        message: 'Something went wrong, request timeout, try again later',
        status: 'fail',
      });
    });
  }
  /**
   * Builds a query string for the get Request route by the status type
   *
   * @param {String} reqStatus - The filter Type to be used
   */
  static filterQuery(reqStatus) {
    let query;
    switch (reqStatus) {
      case 'approve':
      case 'approved':
        query = 'SELECT user_id, userlist.firstname, userlist.lastname, userlist.email, request_id, title, details, currentstatus, requests.created_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id WHERE requests.currentstatus = \'approved\' ORDER BY requests.created_at DESC LIMIT 10 OFFSET $1;';
        break;
      case 'resolve':
      case 'resolved':
        query = 'SELECT user_id, userlist.firstname, userlist.lastname, userlist.email, request_id, title, details, currentstatus, requests.created_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id WHERE requests.currentstatus = \'resolved\' ORDER BY requests.created_at DESC LIMIT 10 OFFSET $1;';
        break;
      case 'pending':
        query = 'SELECT user_id, userlist.firstname, userlist.lastname, userlist.email, request_id, title, details, currentstatus, requests.created_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id WHERE requests.currentstatus = \'pending\' ORDER BY requests.created_at DESC LIMIT 10 OFFSET $1;';
        break;
      case 'reject':
      case 'rejected':
        query = 'SELECT user_id, userlist.firstname, userlist.lastname, userlist.email, request_id, title, details, currentstatus, requests.created_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id WHERE requests.currentstatus = \'approved\' ORDER BY requests.created_at DESC LIMIT 10 OFFSET $1;';
        break;
      default:
        query = 'SELECT user_id, userlist.firstname, userlist.lastname, userlist.email, request_id, title, details, currentstatus, requests.created_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id ORDER BY requests.created_at DESC LIMIT 10 OFFSET $1;';
        break;
    }
    return query;
  }
}
export default RequestController;
