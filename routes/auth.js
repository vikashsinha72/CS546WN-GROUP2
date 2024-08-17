// --- Authentication routes
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
import { loginUser, registerUser } from '../data/users.js'

const router = Router(); 

router.route('/').get(async (req, res) => {
    //GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    return res.json({error: 'YOU SHOULD NOT BE HERE!'});
  });
  
  router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    res.render('register');
  })
  .post(async (req, res) => {
    //code here for POST
    const username = req.body.usernameInput;
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const emailAddress = req.body.emailAddressInput;
    const password = req.body.passwordInput;
    const confirmPassword = req.body.confirmPasswordInput;

    if(password == confirmPassword) {
      try {
        const newUser = await registerUser(username, firstName, lastName, emailAddress, password);
        if (newUser.userInserted) res.redirect('/auth');
      } catch (error) {
        res.status(400).render('error') //status 400 code
      }
    }
  });

  router
  .route('/auth')
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
      res.redirect('/event/home');
    } catch (error) {
      console.error(error)
      res.status(400).render('error');
    }
});


router
.route('/logout')
.get(async (req, res) => {
    //code here for GET

    if (req.session.user) {
        req.session.user = null;
        return res.redirect('/auth');
    }
    return res.render('login', { title:"Login" });

})
.post(async (req, res) => {
    //code here for POST
    // After processing the POST request, redirect to a GET route
    return  res.redirect('/logout');
});

router.route('/error').get(async (req, res) => {
    //code here for GET
    res.status(400).render('error')
  });

export default router;