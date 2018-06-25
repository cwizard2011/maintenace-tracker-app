import UserControllers from '../controllers/User';
import Validators from '../middleware/Validation';
import ValidateDatabase from '../middleware/ValidateDatabase';
import Authentication from '../helpers/Authentication';
import isAdmin from '../middleware/isAdmin';

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
  app.put(
    `${versionLink}/users/password/update`,
    Authentication.verifyToken,
    Validators.checkPasswordUpdate,
    UserControllers.updatePassword,
  );
  app.post(
    `${versionLink}/auth/passwordreset`,
    Validators.checkPasswordRequest,
    UserControllers.passwordReset,
  );
  app.post(
    `${versionLink}/auth/resetpassword`,
    Validators.checkPasswordReset,
    UserControllers.createNewPassword,
  );
  app.delete(
    `${versionLink}/users/:userId/remove`,
    Authentication.verifyToken,
    isAdmin,
    UserControllers.deleteUser,
  );
};

export default userRoutes;
