import UserControllers from '../controllers/User';
import Validator from '../middleware/Validation';
import CheckRequests from '../middleware/CheckRequests';

const userRoutes = (versionLink, app) => {
  app.post(`${versionLink}/auth/signup`, Validator.checkUser, CheckRequests.checkUser, UserControllers.signUp);
  app.post(`${versionLink}/auth/login`, Validator.checkLogin, UserControllers.login);
};

export default userRoutes;
