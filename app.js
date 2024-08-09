import express from 'express';
const app = express(); 
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
import { createUser, getUser, getAllUsers } from './data/users.js';

// // JUST TO POPULATE A USER
// let userName = 'alexisbrule';
// let password = 'alexisPassword';
// let email = 'someemail@gmail.com';
// let firstName = 'Alexis';
// let lastName = 'Brule';

// createUser(userName, password, email, firstName, lastName);

// // CONTINUES 


const staticDir = express.static('public');

// Creating the custom config for handlebars
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',      // master template

    // If we need to create java objects as JSON strings for embedding data
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number') return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));      // Parsing req

app.engine('handlebars', handlebarsInstance.engine);    // setting engine to use handlebars and custom engines
app.set('view engine', 'handlebars');

app.use(
    session({
        name: 'AuthState', 
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: false
    })
);

configRoutes(app);

// Set up port
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
