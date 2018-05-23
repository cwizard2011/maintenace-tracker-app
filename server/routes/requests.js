import Requests from '../controllers/Requests';
import Validator from '../middleware/Validation';
import Authentication from '../helpers/Auth';
import ValidateDatabase from '../middleware/ValidateDatabase';

const requestRoutes = (versionLink, app) => {
  app.get(`${versionLink}/users/requests`, Authentication.verifyToken, Requests.getAllRequest);
  app.get(`${versionLink}/users/requests/:requestId`, Authentication.verifyToken, Requests.getRequestById);
  app.post(`${versionLink}/users/requests`, Authentication.verifyToken, Validator.checkBody, ValidateDatabase.checkRequest, Requests.createRequest);
  app.put(`${versionLink}/users/requests/:requestId`, Authentication.verifyToken, Validator.checkBody, Requests.editRequest);
};

export default requestRoutes;
