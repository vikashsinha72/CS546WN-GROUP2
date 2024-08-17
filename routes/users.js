import { Router } from 'express';
import { getUserList, getUser, changePassword } from '../data/users.js'; 
import pkg from 'bcryptjs';

const {compare, hash} = pkg;
const router = Router();

router.route('/').get(async (req, res) => {
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

// http://localhost:3000/profile/66be191f44efb08153b12d90 -- for local testing
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

router
.route('/allUsers')
.get(async (req, res) => {
  const { usernames } = req.body;
  try {
    const users = await getUserList(usernames)
    res.render('allUsers', { users })
  } catch (error) {
    console.error()
    return res.status(400).render('error')
  }
})

router
.route('/changePassword/:id') // user/changePassword/:id // route this in the profile page if the user is logged in
.get(async (req, res) => {
  const userId = req.session.user._id
  if (!userId) return res.status(400).render('error');

  try {
    const users = await getUser(userId)
    res.render('changePassword', { users })
  } catch (error) {
    console.error()
    return res.status(400).render('error')
  }
})
.post(async (req, res) => {
  //code here for POST
  const userId = req.session.user._id
  if (!userId) res.status(400).render('error')
  
  const password = req.body.passwordInput;
  const newPassword = req.body.newPasswordInput;
  const confirmPassword = req.body.confirmPasswordInput;

  try {
    const user = await getUser(userId)
    if (!user) res.redirect('/eventHome');

    //check if the password is the same as the original password
    const oldPasswordCheck = await bcryptjs.compare(password, user.password)
    if (!oldPasswordCheck) res.status(400).render('error')

    //check if the passwords match
    const newPasswordCheck = await bcryptjs.compare(newPassword, confirmPassword)

    //hash the password again for the database
    const newHashedPassword = bcryptjs.hash(newPasswordCheck, 8)

    await changePassword(userId, password, newHashedPassword);

    res.redirect('profilePage');
  } catch (error) {
    console.error(error)
    res.status(400).render('error');
  }
});

router.route('/error').get(async (req, res) => {
    //code here for GET
    res.status(400).render('error')
  });
  

  export default router;