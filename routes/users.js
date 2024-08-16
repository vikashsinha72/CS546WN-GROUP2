import { Router } from 'express';
import { getUserList, getUser, updateUser } from '../data/users.js'; 

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

// router
// .route('/update/:id')
// .get(async (req, res) => {

//   const { userId } = req.params;
//   try {
//     const users = await getUserList(usernames)
//     res.render('allUsers', { users })
//   } catch (error) {
//     console.error()
//     return res.status(400).render('error')
//   }
// })

// router
// .route('/changePassword/:id')
// .get(async (req, res) => {
//   const { usernames } = req.params;
//   try {
//     const users = await getUserList(usernames)
//     res.render('allUsers', { users })
//   } catch (error) {
//     console.error()
//     return res.status(400).render('error')
//   }
// })

router.route('/error').get(async (req, res) => {
    //code here for GET
    res.status(400).render('error')
  });
  

  export default router;