const isAdmin = (req, res, next) => {
  if (req.decode.user_role !== 'admin') {
    return res.status(403).json({
      message: 'You are not authorized to access this resources',
      status: 'fail',
    });
  }
  return next();
};
export default isAdmin;
