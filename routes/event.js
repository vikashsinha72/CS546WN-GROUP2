// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
const router = Router(); 
import { ObjectId } from 'mongodb';
import path from 'path';
import helperFuncs from '../helpers.js';
import { users, events } from '../config/mongoCollections.js'
import {createEvent, getEvent, getAllEvents} from '../data/events.js';
import { request } from 'http';


router
    // This will be the creation page for events
    .route('/createEvent')
    .get(async (req, res) => {
        // Checking if logged in when route is complete
        // if (!req.session.user) {
        //     res.redirect('/userProfile')
        // }
        res.render('createEvent', { title: 'createEvent' })   
        
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
            // Returns id if successful
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

            // redirect to event page
            if (typeof submission === 'string') {
                submission = '/event/' + submission;
                res.redirect(submission);
            }
        }
        catch(e) {
            return res.status(500).render(path.resolve('views/createEvent'), {errors: e, hasErrors: true});
        }
        
    });

    // This will be the route for seeing created events
    router
        .route('/:id')
        .get(async (req,res) => {
            // Getting id 
            let eventUrl = req.path;
            let splitIndex = eventUrl.lastIndexOf('/');
            eventUrl = eventUrl.substring(splitIndex + 1);
            let eventsCollection = await events();
            let eventId = await eventsCollection.findOne(new ObjectId(eventUrl));

            // Only accessing users for first and last name
            let userCollection = await users();
            let userId = await userCollection.findOne({username: eventId.username});

            // Checking access rights

            // UNCOMMENT THIS
            // let currentUser = req.session.user;
            let currentUser = {
                username: 'alexisbrule'
            }
            if (eventId.publish !== 'publish') {
                if (currentUser.username !== eventId.username) {
                    return res.render(path.resolve('views/eventHome'), ({title: 'Unauthorized', hasErrors: true}));
                }
                else {
                    return res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, title: eventId.eventName, hasErrors: false}));
                }
            }
            else {
                res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, title: eventId.eventName, hasErrors: false}));
            }
        });

    // FOR POST OF LOOKING UP A PAGE MAKE SURE TO CHECK:
    // PUBLISHED
    // PERMISSION
    // STATUS
router
    .route('/edit/:id')
    .get(async (req, res) => {
        let eventUrl = req.path;
        let splitIndex = eventUrl.lastIndexOf('/');
        eventUrl = eventUrl.substring(splitIndex + 1);
        let eventsCollection = await events();
        let eventId = await eventsCollection.findOne(new ObjectId(eventUrl));

        // Only accessing users for first and last name
        let userCollection = await users();
        let userId = await userCollection.findOne({username: eventId.username});

        // Check access
        // UNCOMMENT THIS
        // let currentUser = req.session.user;
        let currentUser = {
            username: 'alexisbrule'
        }

        // If the event is published you can't edit
        if (currentUser.username === eventId.username) {
            if (eventId.publish !== 'publish') {
                res.render(path.resolve('views/editEvent'), ({title: eventId.eventName}));
            }
        }
        else {
            res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, hasErrors: false}));
        }
   }) 
   .patch(async (req, res) => {
        const requestBody = req.body; 
        
        // check for content
        if (!requestBody || Object.keys(requestBody).length === 0) {
            return res.status(400).render(path.resolve('views/eventHome'), ({errors: 'There are no fields in request body.', hasErrors: true}))
        }

        try {
            // checking parameters
            req.params.id = helperFuncs.checkEventId(req.params.id);
            if (requestBody.eventName) {
                requestBody.eventName = helperFuncs.checkStringLimited(requestBody.eventName, 'Edit Event Name');
            }
            if (requestBody.date) {
                // to do check dates
            }
            if (requestBody.location) {
                requestBody.location = helperFuncs.checkStringLimited(requestBody.location, 'Edit Event Location');
            }
            if (requestBody.category) {
                requestBody.category = helperFuncs.checkStringLimited(requestBody.category, 'Edit Event Location');
            }
            if (requestBody.permission) {
                requestBody.permission = helperFuncs.checkPermission(requestBody.permission);
            }
            if (requestBody.description) {
                requestBody.description = helperFuncs.checkString(requestBody.description, 'Edit Event Description');
            }
            if (requestBody.nearByPort) {
                requestBody.nearByPort = helperFuncs.checkStringLimited(requestBody.nearByPort, 'Edit Event Port');
            }
            if (requestBody.eventMode) {
                requestBody.eventMode = helperFuncs.checkEventMode(requestBody.eventMode);
            }
            if (requestBody.eventMode) {
                requestBody.registrationFee = helperFuncs.checkStringFee(requestBody.registrationFee);
            }
            if (requestBody.publish) {
                requestBody.publish = helperFuncs.checkPublishStatus(requestBody.publish);
            }
        }
        catch(e) {
           return res.render(path.resolve('views/editEvent'), ({errors: e, hasErrors: true}));
        }

        // NOT COMPLETE TO EDIT

   })
export default router;