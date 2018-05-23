import Requests from '../controllers/Requests';
import Validator from '../middleware/Validation';
import Authentication from '../helpers/Auth';

const requestRoutes = (versionLink, app) => {
  app.get(`${versionLink}/users/requests`, Authentication.verifyToken, Requests.getAllRequest);
  app.get(`${versionLink}/users/requests/:requestId`, Authentication.verifyToken, Validator.checkReqId, Requests.getRequestById);
  app.post(`${versionLink}/users/requests`, Authentication.verifyToken, Validator.checkBody, Validator.checkIds, Validator.checkStatus, Requests.createRequest);
  app.put(`${versionLink}/users/requests/:requestId`, Authentication.verifyToken, Validator.checkBody, Validator.checkIds, Validator.checkStatus, Requests.editRequest);
};

export default requestRoutes;
