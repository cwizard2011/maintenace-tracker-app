import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

/**
 * Contoller for users request
 *
 * @class a request controller
 *
 */

class RequestController {
  /**
   * Method to get all requests in the database
   *
   * @static method to get All Requests
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   *
  */

  static getAllRequest(req, res) {
    const client = new Client(connectionString);
    client.connect();
    client.query(
      'SELECT * FROM requests',
      (err, result) => {
        client.end();
        if (err) {
          return winston.log(err.stack);
        } else if (result.rows.length > 0) {
          return res.status(200).json({
            data: result.rows,
            message: 'Requests found',
            status: 'success',
          });
        }
        return res.status(404).json({
          message: 'No request in the database',
          status: 'fail',
        });
      },
    );
  }
  static approveRequest(req, res) {
    const { requestId } = req.params;
    const newQuery = {
      text: 'UPDATE requests SET currentstatus = $1 WHERE id = $2;',
      values: ['approved', requestId],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (err) {
        return winston.log(err.stack);
      } else if (result) {
        return res.status(200).json({
          message: 'Request approved',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'This request has already been taken care of, check the request details for more info',
        status: 'fail',
      });
    });
  }
  static rejectRequest(req, res) {
    const { requestId } = req.params;
    const newQuery = {
      text: 'UPDATE requests SET currentstatus = $1 WHERE id = $2;',
      values: ['pend', requestId],
    };
    const client = new Client(connectionString);
    client.connect();
    client.query(newQuery, (err, result) => {
      client.end();
      if (err) {
        return winston.log(err.stack);
      } else if (result) {
        return res.status(200).json({
          message: 'Request approved',
          status: 'success',
        });
      }
      return res.status(404).json({
        message: 'This request has already been taken care of, check the request details for more info',
        status: 'fail',
      });
    });
  }
}
export default RequestController;
