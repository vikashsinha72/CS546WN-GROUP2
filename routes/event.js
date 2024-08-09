// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
const router = Router(); 
import path from 'path';
import helperFuncs from '../helpers.js';
import { users } from '../config/mongoCollections.js'
import {createEvent, getEvent, getAllEvents} from '../data/events.js';


router
    // This will be the creation page for events
    .route('/create')
    .get(async (req, res) => {
        // Checking if logged in when route is complete
        // if (!req.session.user) {
        //     res.redirect('/userProfile')
        // }

        res.render(path.resolve('views/createEvent'), {title: 'Create Event'});
        
    })
    .post(async (req, res) => {
        const inputs = req.body;
        let errors = [];
        
        // Error checking
        // Event Name
        try {
            inputs.eventNameInput = helperFuncs.checkStringLimited(inputs.eventNameInput, 'POST eventNameInput');
        }
        catch(e) {
            errors.push(e);
        }

        // TODO -- check date validity --
        // try {
        //     inputs.dateInput = helperFuncs.checkStringLimited(inputs.dateInput, 'POST locationInput');
        // }
        // catch(e) {
        //     errors.push(e);
        // }

        // Location
        try {
            inputs.locationInput = helperFuncs.checkStringLimited(inputs.locationInput, 'POST locationInput');
        }
        catch(e) {
            errors.push(e);
        }

        // Description
        try {
            inputs.descriptionInput = helperFuncs.checkString(inputs.descriptionInput, 'POST descriptionInput');
        }
        catch(e) {
            errors.push(e);
        }

        // Mode
        try {
            inputs.modeInput = helperFuncs.checkEventMode(inputs.modeInput);
        }
        catch(e) {
            errors.push(e);
        }

        // Fee
        try {
            inputs.feeInput = helperFuncs.checkStringFee(inputs.feeInput, 'POST feeInput');
        }
        catch(e) {
            errors.push(e);
        }

        // Permissions
        try {
            inputs.permInput = helperFuncs.checkPermission(inputs.permInput);
        }
        catch(e) {
            errors.push(e);
        }

        // Category
        try {
            inputs.categoryInput = helperFuncs.checkStringLimited(inputs.categoryInput, 'Event categoryInput');
        }
        catch(e) {
            errors.push(e);
        }

        // Near By Port
        try {
            inputs.portInput = helperFuncs.checkStringLimited(inputs.portInput, 'Event portInput');
        }
        catch(e) {
            errors.push(e);
        }

        // If there are any errors
        if (errors.length > 0) {
            return res.status(400).render(path.resolve('views/createEvent'), {errors: errors, hasErrors: true});
        }

        let user = req.session.user
        let username = user.username    
        let userId = await userCollection.findOne({username: username})
        if (!userId) throw `Can't find user.`;
        userId = userId._id.toString();

        try {
            let submission = await createEvent(
                userId, 
                username, 
                inputs.eventNameInput, 
                inputs.dateInput, 
                inputs.locationInput,
                inputs.categoryInput, 
                inputs.permInput, 
                inputs.descriptionInput, 
                inputs.portInput, 
                inputs.modeInput,
                inputs.feeInput, 
                inputs.action
            );
            // if (typeof submission === 'string') {
            //     submission = '/event/' + submission;
            //     res.redirect(submission);
            // }
        }
        catch(e) {
            return res.status(500).render(path.resolve('views/createEvent'), {errors: e, hasErrors: true});
        }
        
    });

    // This will be the route for seeing created events
    router
        .route('/edit/:id')
        .get(async (req,res) => {
            
        })

    // FOR POST OF LOOKING UP A PAGE MAKE SURE TO CHECK:
    // PUBLISHED
    // PERMISSION
    // STATUS
export default router;