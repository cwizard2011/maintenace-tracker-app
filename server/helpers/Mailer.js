import transporter from '../../config/transporter';
import pool from '../models/database';

/**
 * @class Mailer controller for sending emails to users
 *
 */
class Mailer {
  static async emailSender(emailAddress, mailSubject, mailBody) {
    const emailOptions = {
      from: 'Maintenance Tracker',
      to: emailAddress,
      subject: mailSubject,
      html: `<h3 style="background: white;padding: .5em;">Maintenance Tracker</h3>
      <div style="padding: .5em;">${mailBody}</div>
      <p style="padding: .5em;"><b>**Note if you didnt subscribe to our service, please reply to this email with your complaint</p>`,
    };

    return transporter.sendMail(emailOptions, (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  }
  /**
   * @static - method for sending welcome mail to new user
   *
   * @param {String} email - email address of the new user
   * @param {String} firstname - firstname of the new user
   */
  static async welcomeMail(email, firstname) {
    const mail = `<p>Dear <b>${firstname}</b></p> <p>You registration on Maintenance tracker website is successful</p>`;
    const subject = 'Welcome to Maintenance tracker';
    Mailer.emailSender(email, subject, mail);
  }
  /**
   * @static - Method to send email when admin change the status of a request
   * @param {String} requestId - Id of the approved, resolved or rejected request
   */
  static async sendRequestStatus(requestId) {
    const request = {
      text: 'SELECT request_id, userlist.firstname, userlist.email, title, currentstatus, requests.created_at, requests.updated_at FROM requests INNER JOIN userlist ON requests.user_id = userlist.id WHERE request_id = $1',
      values: [requestId],
    };
    pool.query(request, (err, result) => {
      const {
        firstname, email, title, currentstatus,
      } = result.rows[0];
      const createdAt = result.rows[0].created_at;
      const updatedAt = result.rows[0].updated_at;
      const id = result.rows[0].request_id;

      const subject = `Request ${currentstatus}`;
      const message = `<p>Dear <b>${firstname}</b>, Your request has been <b>${currentstatus}</b>. The details of your request status is highlighted below
        <p><b>Request Id:</b> <span>${id}</span></p>
        <p><b>Request title:</b><span>${title}</span></p>
        <p><b>Request created on:</b> <span>${createdAt}</span></p>
        <p><b>Updated on:</b> <span>${updatedAt}</span></p>
      `;
      Mailer.emailSender(email, subject, message);
    });
  }
  /**
   * @static - Method to send email to admin when a user create new request
   * @param {String} title - title of a new request
   */
  static async sendNewRequest(title) {
    const request = {
      text: 'SELECT * FROM userlist WHERE user_role = $1',
      values: ['admin'],
    };
    pool.query(request, (err, result) => {
      const {
        firstname, email,
      } = result.rows[0];

      const subject = 'New request has been logged';
      const message = `<p>Dear <b>${firstname}</b>, kindly check your dashboard for a new pending request</p>
        <p><b>Request title:</b> <span>${title}</span></p>
        <p><b>Created on:</b> <span>${new Date()}</span></p>
      `;
      Mailer.emailSender(email, subject, message);
    });
  }
}

export default Mailer;
