// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
const router = Router(); 
import { ObjectId } from 'mongodb';
import path from 'path';
import helperFuncs from '../helpers.js';
import { users, events } from '../config/mongoCollections.js'
import {createEvent, getEvent, getAllEvents, updateEventPatch, deleteEvent} from '../data/events.js';

router
    .route('/')
    .get(async (req, res) => {
        // let currentUser = helperFuncs.checkUserId(req.session.user);
        let currentUser = {
            _id: '66b157fe426ee3fdfea402da',
            username: 'alexisbrule'
        }
        
        if (currentUser._id) {
            let eventRes = await getAllEvents(currentUser._id);
            if (eventRes.length === 0) {
                return res.render(path.resolve('views/eventsList'), ({title: 'Event List:', eventRes: eventRes}));
            }
            else {
                return res.render(path.resolve('views/eventsList'), ({title: 'Event List:', eventRes: eventRes}));
            }
        }
    })

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

        // let user = req.session.user
        // let username = user.username    
        // let userId = await userCollection.findOne({username: username})
        // if (!userId) throw `Can't find user.`;
        // userId = userId._id.toString();
        
        // for testing- DELETE
        let userId = '66b157fe426ee3fdfea402da';
        let username = 'alexisbrule';

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
                return res.redirect(submission);
            }
        }
        catch(e) {
            return res.status(500).render(path.resolve('views/createEvent'), {event: inputs, errors: e, hasErrors: true});
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
                    return res.render(path.resolve('views/eventHome'), ({title: 'Unauthorized', errors: 'Cannot edit a published event.', hasErrors: true}));
                }
                else {
                    eventId._id = eventId._id.toString();
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
            username: 'alexisbrule',
            _id: '66b157fe426ee3fdfea402da'
        }

        // If the event is published you can't edit
        if (currentUser.username === eventId.username) {
            if (eventId.publish !== 'publish') {
                return res.render(path.resolve('views/editEvent'), ({eventId: eventId._id.toString(), title: eventId.eventName}));
            }
            else {
                return res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, errors: 'Cannot edit published events.', hasErrors: true}));
            }
        }
        else {
            return res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, errors: 'Unauthorized to edit event.', hasErrors: true}));
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
            if (requestBody.eventNameEdit) {
                requestBody.eventNameEdit = helperFuncs.checkStringLimited(requestBody.eventNameEdit, 'Edit Event Name');
            }
            if (requestBody.dateEdit) {
                // to do check dates
            }
            if (requestBody.locationEdit) {
                requestBody.locationEdit = helperFuncs.checkStringLimited(requestBody.locationEdit, 'Edit Event Location');
            }
            if (requestBody.categoryEdit) {
                requestBody.categoryEdit = helperFuncs.checkStringLimited(requestBody.categoryEdit, 'Edit Event Location');
            }
            if (requestBody.permEdit) {
                requestBody.permEdit = helperFuncs.checkPermission(requestBody.permEdit);
            }
            if (requestBody.descriptionEdit) {
                requestBody.descriptionEdit = helperFuncs.checkString(requestBody.descriptionEdit, 'Edit Event Description');
            }
            if (requestBody.portEdit) {
                requestBody.portEdit = helperFuncs.checkStringLimited(requestBody.portEdit, 'Edit Event Port');
            }
            if (requestBody.modeEdit) {
                requestBody.modeEdit = helperFuncs.checkEventMode(requestBody.modeEdit);
            }
            if (requestBody.feeEdit) {
                requestBody.feeEdit = helperFuncs.checkStringFee(requestBody.feeEdit);
            }
            if (requestBody.action) {
                requestBody.action = helperFuncs.checkPublishStatus(requestBody.action);
            }
        }
        catch(e) {
           return res.render(path.resolve('views/editEvent'), ({errors: e, hasErrors: true}));
        }

        let updatePost = await updateEventPatch(req.params.id, requestBody);
        if (typeof updatePost === 'string') {
            updatePost = '/event/' + updatePost;
            return res.redirect(updatePost);
        }
        else {
            return res.render(path.resolve('views/editEvent'), ({errors: e, hasErrors: true}));
        }
   })
   .delete(async (req, res) => {
        const requestBody = req.body;
        const requestId = req.params.id;

        // try {
        //     const userCollection = await users(); 
        //     const userId = await userCollection.findOne({
        //         'events._id': requestId
        //     })
        //     if (!userId) throw `Cannot find event attatched to a user.`
        // }
        // catch(e) {
        //     return res.render(path.resolve('views/editEvent'), ({errors: e, hasErrors: true}));
        // }

        try {
            if (requestBody.delete === 'delete') {
                let deletion = await deleteEvent(requestId);
                if (deletion.deleted === true) {
                    res.redirect('/');
                }
                else {
                    throw `Could not delete event.`
                }
            }
        }
        catch(e) {
            return res.render(path.resolve('views/editEvent'), ({errors: e, hasErrors: true}));
        }


   })
export default router;