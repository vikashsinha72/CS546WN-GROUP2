import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
import {
    rewriteMethods,
    logRequest,
    rootRequest,
    redirectAuthenticatedLogin,
    redirectAuthenticatedRegister,
    ensureAuthenticated,
    ensureLogout
  } from './middleware.js';

  
const app = express();
const PORT = process.env.PORT || 3000;

const staticDir = express.static('public');


app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));    // setting engine to use handlebars and custom engines
app.set('view engine', 'handlebars');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));      // Parsing req


app.use(session({
    name: 'AuthState',
    secret: 'UpDown',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1800000} // 1800000 milli seconds
}));

  // Logging middleware

  //This can be handled in routes
  app.use(rewriteMethods);

  // Apply logging middleware to all routes
  app.use(logRequest);
  
  
  // Route middleware
  //for root
  app.use('/',  rootRequest);
  
  //for login
  app.use('/auth',  redirectAuthenticatedLogin);
  
  //for register
  app.use('/register', redirectAuthenticatedRegister);
  
  
  // for event
  app.use('/event',ensureAuthenticated)
  
  //logout
  app.use('/logout', ensureLogout);

configRoutes(app);

// Set up port
app.listen(PORT, () => {
  console.log(`Event Management Server is running on http://localhost:${PORT}`);
});
