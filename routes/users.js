import { Router } from 'express';
import { loginUser, registerUser, getUser } from '../data/users.js'; 

const router = Router();

router.route('/').get(async (req, res) => {
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

// router
//   .route('/register')
//   .get(async (req, res) => {
//     //code here for GET
//     res.render('register');
//   })
//   .post(async (req, res) => {
//     //code here for POST
//     const username = req.body.usernameInput;
//     const firstName = req.body.firstNameInput;
//     const lastName = req.body.lastNameInput;
//     const emailAddress = req.body.emailAddressInput;
//     const password = req.body.passwordInput;
//     const confirmPassword = req.body.confirmPasswordInput;

//     if(password == confirmPassword) {
//       try {
//         const newUser = await registerUser(username, firstName, lastName, emailAddress, password);
//         if (newUser.userInserted) res.redirect('login');
//       } catch (error) {
//         res.status(400).render('error') //status 400 code
//       }
//     }
//   });

// http://localhost:3000/profile/66be191f44efb08153b12d90
router
.route('/profile/:userId')
.get(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUser(userId)
    res.render('profilePage', { user })
  } catch (error) {
    console.error()
    return res.status(400).render('error')
  }
})

router.route('/error').get(async (req, res) => {
    //code here for GET
    res.status(400).render('error')
  });
  

  export default router;