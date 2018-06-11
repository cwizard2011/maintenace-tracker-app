import UserControllers from '../controllers/User';
import Validators from '../middleware/Validation';
import ValidateDatabase from '../middleware/ValidateDatabase';
import Authentication from '../helpers/Authentication';

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
  app.get(
    `${versionLink}/users/profile`,
    Authentication.verifyToken,
    UserControllers.userProfile,
  );
};

export default userRoutes;
