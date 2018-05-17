import Requests from '../controllers/Requests';

const requestRoutes = (version, app) => {
  app.get(`${version}/users/requests`, Requests.getAllRequest);
};

export default requestRoutes;
