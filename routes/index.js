
import router from './events.js';

const eventRouter = (app) => {
  app.use('/events', router);
  // app.use('/eventRegistration', router);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
}

export default eventRouter
