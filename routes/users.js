import { Router } from 'express';
import users, { getUser, changePassword } from '../data/users.js'; 
import bcryptjs from 'bcryptjs';
import xss from 'xss'

const router = Router();

router.route('/').get(async (req, res) => {
      return res.redirect('/auth')
  //return res.json({error: 'YOU SHOULD NOT BE HERE!'});
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

// router
// .route('/allUsers')
// .get(async (req, res) => {
//   const { usernames } = req.body;
//   try {
//     const users = await getUserList(usernames)
//     res.render('allUsers', { users })
//   } catch (error) {
//     console.error()
//     return res.status(400).render('error')
//   }
// })


router
.route('/changePassword/:id') // user/changePassword/:id // route this in the profile page if the user is logged in
.get(async (req, res) => {
  const userId = req.params.id
  if (!userId) return res.status(400).render('error');

  try {
    const user = await getUser(userId)
    return res.render('changePassword', { user })
  } catch (error) {
    return res.status(400).render('error')
  }
})

.patch(async (req, res) => {
  //code here for POST
  const userId = req.params.id
  if (!userId) return res.status(400).render('error')
  
  const password = xss(req.body.passwordInput);
  const newPassword = xss(req.body.newPasswordInput);
  const confirmPassword = xss(req.body.confirmPasswordInput);

  try {
    const user = await getUser(userId)
    if (!user) res.redirect('/eventHome');

    //check if the password is the same as the original password
    const oldPasswordCheck = await bcryptjs.compare(password, user.password)
    if (!oldPasswordCheck) return res.status(400).render('error')


    //check if the passwords match
    if (newPassword !== confirmPassword) return res.status(400)('error');

    //hash the password again for the database
    // const newHashedPassword = await bcryptjs.hash(newPassword, 8)

    await changePassword(userId, newPassword);

    return res.redirect(`/user/profile/${userId}`);
  } catch (error) {
    console.error(error)
    return res.status(400).render('error');
  }
});

router.route('/error').get(async (req, res) => {
    //code here for GET
    return res.status(400).render('error')
  });
  

  export default router;