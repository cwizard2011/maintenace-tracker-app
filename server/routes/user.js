import UserControllers from '../controllers/User';
import Validators from '../middleware/Validation';
import ValidateDatabase from '../middleware/ValidateDatabase';

const userRoutes = (versionLink, app) => {
  app.post(
    `${versionLink}/auth/signup`,
    Validators.checkUser,
    ValidateDatabase.checkUser,
    UserControllers.signUp,
  );
  app.post(
    `${versionLink}/auth/login`,
    Validators.checkLogin,
    UserControllers.login,
  );
};

export default userRoutes;
