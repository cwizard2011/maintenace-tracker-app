import UserControllers from '../controllers/User';
import Validator from '../middleware/Validation';
import ValidateDatabase from '../middleware/ValidateDatabase';

const userRoutes = (versionLink, app) => {
  app.post(
    `${versionLink}/auth/signup`,
    Validator.checkUser,
    ValidateDatabase.checkUser,
    UserControllers.signUp,
  );
  app.post(
    `${versionLink}/auth/login`,
    Validator.checkLogin,
    UserControllers.login,
  );
};

export default userRoutes;
