// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
import userData from '../data/users.js';

import validators from '../validators.js';

const router = Router(); 


router.route('/').get(async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    return res.json({error: `YOU SHOULD NOT BE HERE! ${req.originalUrl}`});
    });
    
    router
    .route('/register')
    .get(async (req, res) => {
        //code here for GET
    
        if (req.session.user) {
            return res.redirect('/event');

        }
    
        return res.render('register', { title: "User Registration"});
    
    })
    .post(async (req, res) => {
        //code here for POST
    
        try {
        const { firstNameInput, lastNameInput, emailAddressInput, passwordInput, confirmPasswordInput, roleInput } = req.body;
        if (!firstNameInput || !lastNameInput || !emailAddressInput || !passwordInput || !confirmPasswordInput || !roleInput) {
            throw 'All fields must be supplied.';
        }
    
            // Add further validation
        validators.checkFirstname(firstNameInput);
        validators.checkLastname(lastNameInput);
        validators.checkEmail(emailAddressInput);
        validators.checkPassword(passwordInput);
        validators.checkPassword(confirmPasswordInput);
        validators.checkRole(roleInput);
    
        if (passwordInput !== confirmPasswordInput) {
            throw 'Passwords do not match.';
        }
        let userRegistered = await userData.registerUser(firstNameInput, lastNameInput, emailAddressInput, passwordInput, roleInput);
        
        if(userRegistered.insertedUser)
        {      
            return res.redirect('/auth');
        }
        else
        {
            return res.status(500).render('login', { title:"Login", error: "Internal Server Error"});
    
        }
        //res.render('login', { error: "User Registered succesfully. You may lopin."});
    
        //return res.redirect('/auth');
        } catch (e) {
        return res.status(400).render('login', { title:"Login", error: e });
        }
    
    });

    router
    .route('/login')
    .get(async (req, res) => {
      //code here for GET
      res.render('login')
    })
    .post(async (req, res) => {
      //code here for POST
      const username = req.body.usernameInput;
      const password = req.body.passwordInput;
      try {
        const loggedIn = await loginUser(username, password);
        if (!loggedIn) res.redirect('/register');
        req.session.user = {
          username: loggedIn.username,
          firstName: loggedIn.firstName,
          lastName: loggedIn.lastName,
          emailAddress: loggedIn.emailAddress,
          password: loggedIn.password
        }
        res.redirect('/home');
      } catch (error) {
        console.error(error)
        res.render('error');
      }
  });
  router
  .route('/profile/:userId')
  .get(async (req, res) => {
      const user = req.session.user.userId;
      if (!user) return res.status(400).render('error')
      try {
          const loggedInUser = await getUser(userId)
          res.render('profilePage')
      } catch (error) {
          return res.status(400).render('error')
      }
  })
  router.route('/error').get(async (req, res) => {
      //code here for GET
      res.render('error')
    });
    
    router.route('/logout').get(async (req, res) => {
      //code here for GET
      req.session.destroy(err => {
        res.render('logout')
      })
    });

export default router;