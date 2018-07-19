/**
 * @const - function for checking if a user has admin role
 *
 * @param {object} req -request object
 * @param {object} res - response object
 * @param {function} next - callback function for calling the next middleware
 */
const isAdmin = (req, res, next) => {
  if (req.decode.user_role !== 'admin') {
    return res.status(403).json({
      message: 'You are not authorized to access this resources',
      status: 'fail',
      code: 403,
    });
  }
  return next();
};

export default isAdmin;
