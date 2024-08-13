import { Router } from 'express';
import { loginUser, registerUser, getAllUsers, getUser } from '../data/users.js'; 

const router = Router();

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
        if (newUser.userInserted) res.render('login');
      } catch (error) {
        res.render('error') //status 400 code
      }
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