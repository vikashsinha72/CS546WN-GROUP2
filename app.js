import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';
import {
  logRequest,
  rootRequest,
  redirectAuthenticatedLogin,
  redirectAuthenticatedRegister,
  ensureAuthenticated,
  ensureLogout
} from './middleware.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

import configRoutes from './routes/index.js';


// Middleware setup

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.use(session({
    name: 'AuthState',
    secret: 'UpDown',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1800000} // 1800000 milli seconds
  }));
  
  
  
  // Logging middleware
  
  // Apply logging middleware to all routes
  app.use( logRequest);
  
  
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
  
  app.listen(PORT, () => {
    console.log(`Event Management Server is running on http://localhost:${PORT}`);
  });
  
  