import UserControllers from '../controllers/User';
import Validator from '../middleware/Validation';
import CheckRequests from '../middleware/CheckRequests';

const userRoutes = (versionLink, app) => {
  app.post(`${versionLink}/auth/signup`, Validator.checkUser, CheckRequests.checkUser, UserControllers.signUp);
};

export default userRoutes;
