import express from 'express';
const app = express(); 
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
import { events } from './config/mongoCollections.js';  // middleware
import { ObjectId } from 'mongodb';   // middleware
import {
    logRequest,
    rootRequest,
    redirectAuthenticatedLogin,
    redirectAuthenticatedRegister,
    ensureAuthenticated,
    ensureLogout
  } from './middleware.js';
import helperFuncs from './helpers.js';



const staticDir = express.static('public');

// Middleware for different browser methods namely post/put
const rewriteMethods = ('/edit/:id', (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});

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
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
