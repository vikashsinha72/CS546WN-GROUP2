// --- Authentication routes
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
import userData from '../data/users.js';
import validators from '../validators.js';

const router = Router(); 

router.route('/').get(async (req, res) => {
    //GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    return res.json({error: 'YOU SHOULD NOT BE HERE!'});
  });
  


router
.route('/auth')
.get(async (req, res) => {
    //code here for GET

    if (req.session.user) {

        return res.redirect('/event');

        if (req.session.user.role === 'admin') {
            return res.redirect('/event');
        }
        else if (req.session.user.role === 'user') {
            return res.redirect('/profile');
        }
        else{
            //return next();
            return res.status(403).json({error: '403: Forbidden, You do not have permission to view this page.'});
        }  
    }

    return res.render('login', { title:"Login" });

})
.post(async (req, res) => {
    //code here for POST
    try {

        const { emailAddressInput, passwordInput } = req.body;

        validators.checkEmail(emailAddressInput, "Email Address");
        validators.checkPassword(passwordInput, "Password");
        const user = await userData.loginUser(emailAddressInput, passwordInput);
        req.session.user = user;

        return res.redirect('/event');


        if (user.role === 'admin') {
            return res.redirect('/event');
        } else if (user.role === 'user') {
            return res.redirect('/profile');
        }
        else{
            return res.status(403).json({error: '403: Forbidden, You do not have permission to view this page.'});
        }
    } catch (e) {
        res.status(400).render('login', { title:"Login", error: e });
    }

});

export default router;