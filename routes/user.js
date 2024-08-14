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

            if (req.session.user.role === 'admin') {
                return res.redirect('/admin');
            }
            else if (req.session.user.role === 'user') {
                return res.redirect('/protected');
            }
            else{
                //return res.status(400).json({error: `User with this role[${req.session.user.role}] doesnot have any authorization`});
                return res.status(403).json({error: '403: Forbidden, You do not have permission to view this page.'});
            }
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



export default router;