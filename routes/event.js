// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
import xss from 'xss';

const router = Router(); 
import { ObjectId } from 'mongodb';
import path from 'path';
import helperFuncs from '../helpers.js';
import validators from '../validators.js';
import { users, events } from '../config/mongoCollections.js';
import eventData from '../data/events.js';
import reviewData from '../data/reviews.js';

import {createEvent, getEvent, getEventList, getAllEvents, updateEventPatch, deleteEvent} from '../data/events.js';

router
    .route('/home')
    .get(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/auth')
        }

        const eventLister = await getEventList(); 
        if (eventLister.length === 0) {
            return res.render(path.resolve('views/homepage'), ({hasEvents: false, user: req.session.user}));
        }
        else {
            return res.render(path.resolve('views/homepage'), ({event: eventLister, hasEvents: true, user: req.session.user}));
        }
    })

router
    .route('/')
    .get(async (req, res) => {
        // check if logged in user
        if (!req.session.user) {
            res.redirect('/auth')
        }

        let userCollection = await users();
        let currentUser = await userCollection.findOne({username: req.session.user.username});
        if (!currentUser) throw `Cannot find that user.`;

        try {
            if (currentUser) {
                let eventRes = await getAllEvents(currentUser._id);
                if (eventRes.length === 0) {
                    return res.render(path.resolve('views/eventsList'), ({title: 'Event List:', eventRes: eventRes, user: req.session.user}));
                }
                else {
                    return res.render(path.resolve('views/eventsList'), ({title: 'Event List:', eventRes: eventRes, user: req.session.user}));
                }
            }
        }
        catch(e) {
            return res.render(path.resolve('views/eventsList'), ({title: 'Event List:', errors: e, hasErrors: true , user: req.session.user}));
        }
    
    })

router
    // This will be the creation page for events
    .route('/create')
    .get(async (req, res) => {
        // Checking if logged in when route is complete
        if (!req.session.user) {
            res.redirect('/auth/')
        }

        res.render(path.resolve('views/createEvent'), {title: 'Create Event', user: req.session.user});
        
    })
    .post(async (req, res) => {
        const inputs = req.body;
        let errors = [];
        
        // Error checking
        try {
            inputs.eventNameInput = validators.checkString(inputs.eventNameInput, 'POST Event Name');
        }
        catch(e) {
            errors.push(e);
        }

        try {
            inputs.locationInput = validators.checkString(inputs.locationInput, 'POST Event location');
        }
        catch(e) {
            errors.push(e);
        }

        try {
            inputs.categoryInput = validators.checkString(inputs.categoryInput, 'POST Event category');
        }
        catch(e) {
            errors.push(e);
        }

        try {
            inputs.descriptionInput = validators.checkString(inputs.descriptionInput, 'POST Event description');
        }
        catch(e) {
            errors.push(e);
        }

        try {
            inputs.portInput = validators.checkString(inputs.portInput, 'POST Event nearByPort');
        }
        catch(e) {
            errors.push(e);
        }

        try {
            inputs.dateInput = validators.checkDate(inputs.dateInput, 'POST dateInput');
        }
        catch(e) {
            errors.push(e);
        }

        try {
            inputs.modeInput = helperFuncs.checkEventMode(inputs.modeInput);
        }
        catch(e) {
            errors.push(e);
        }

        // Fee
        try {
            inputs.feeInput =  validators.checkPrice(inputs.feeInput, 'POST fee');
        }
        catch(e) {
            errors.push(e);
        }

        // If there are any errors
        if (errors.length > 0) {
            return res.status(500).json({
                success: false,
                error: errors
            });
            //return res.status(400).render(path.resolve('views/createEvent'), {errors: errors, hasErrors: true, user: req.session.user});
        }

        let user = req.session.user
        let username = user.username  
        const userCollection = await users();  
        let userId = await userCollection.findOne({username: username})
        if (!userId) throw `Can't find user.`;
        userId = userId._id.toString();
        

        try {
            // Returns id if successful
            let submission = await createEvent(
                userId,
                inputs.eventNameInput, 
                inputs.dateInput, 
                inputs.locationInput,
                inputs.categoryInput, 
                inputs.descriptionInput, 
                inputs.portInput, 
                inputs.modeInput,
                inputs.feeInput, 
                inputs.pubStat
            );

            // redirect to event page
            // if (typeof submission === 'string') {
            //     submission = '/event/' + submission;
            //     return res.redirect(submission);
            // }
            return res.json({
                success: true, 
                event: submission
            });
        }
        catch(e) {
            // return res.status(500).render(path.resolve('views/createEvent'), {event: inputs, errors: e, hasErrors: true});
            return res.json({
                success: false, 
                event: `Internal Server Error:  ${e}`
            });
        }
        
    });

    // This will be the route for seeing created events
    router
        .route('/:id')
        .get(async (req,res) => {

            // check if logged in user
            if (!req.session.user) {
                res.redirect('/auth/')
            }

            // Getting input id 
            let eventUrl = req.path;
            let splitIndex = eventUrl.lastIndexOf('/');
            eventUrl = eventUrl.substring(splitIndex + 1);
            let eventsCollection = await events();
            let eventId = await eventsCollection.findOne(new ObjectId(eventUrl));

            // Checking access rights
            // Accessing users for first and last name as well
            let userCollection = await users();
            let currentUser = req.session.user.username;
            let userId = await userCollection.findOne({username: currentUser});
            if (!userId) throw `Can't find user.`;
            let formatted = {
                date: helperFuncs.eventDateTimeFormat(eventId.date),
                fee: helperFuncs.eventPriceFormat(eventId.registrationFee)
            };
            
            if (eventId.publish !== 'publish') {    // If event is published
                if (userId._id.toString() !== eventId.userId) {
                    return res.render(path.resolve('views/eventsList'), ({title: 'Unauthorized', errors: 'You do not have access to this event.', hasErrors: true, user: req.session.user}));
                }
                else {
                    return res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, formatted: formatted, title: eventId.eventName, hasErrors: false, user: req.session.user}));
                }
            }
            else {     
                res.render(path.resolve('views/eventHome'), ({eventRes: eventId, userRes: userId, formatted: formatted, title: eventId.eventName, hasErrors: false, user: req.session.user}));
            }
        });

router
    .route('/edit/:id')
    .get(async (req, res) => {
        
        // check if logged in user
        if (!req.session.user) {
            res.redirect('/auth/');
        }

        let eventUrl = req.path;
        let splitIndex = eventUrl.lastIndexOf('/');
        eventUrl = eventUrl.substring(splitIndex + 1);
        let eventsCollection = await events();
        let userCollection = await users();
        let eventId;
        let userIdCheck;

        // if the event cannot be found
        try {
            eventId = await eventsCollection.findOne(new ObjectId(eventUrl));
        }
        catch (e) {
            return res.render(path.resolve('views/eventsList'), ({errors: 'Cannot find event.', hasErrors: true, user: req.session.user}));
        }


        let currentUser = req.session.user.username;
        let userId = await userCollection.findOne({username: currentUser});
        if (!userId) throw `Can't find user.`;
        userId = userId._id.toString();

        // If event.userId does not match current user's id
        try {
            userIdCheck = await userCollection.findOne({"events._id": eventId._id});   
        }
        catch (e) {
            return res.render(path.resolve('views/eventsList'), ({errors: 'Cannot find event attatched to current user', hasErrors: true, user: req.session.user}));
        }

        let formatted = {};
        formatted.date = helperFuncs.eventDateTimeFormat(eventId.date);
        formatted.fee = helperFuncs.eventPriceFormat(eventId.registrationFee);
        // Check access
        // If the event is published you can't edit everything
        if (userId === eventId.userId) {
            if (eventId.publish !== 'publish') {
                return res.render(path.resolve('views/editEvent'), ({event: eventId, title: eventId.eventName, published: false, user: req.session.user}));
            }
            else if (eventId.eventStatus === 'Closed' || eventId.eventStatus === 'Executed'){
                return res.render(path.resolve('views/eventHome'), ({eventRes: eventId, formatted: formatted, errors: 'Cannot edit closed/executed events.', hasErrors: true, user: req.session.user}));
            }
            else {
                return res.render(path.resolve('views/editEvent'), ({eventRes: eventId, formatted: formatted, title: eventId.eventName, published: true, user: req.session.user}));
            }
        }
        else {
            return res.render(path.resolve('views/eventHome'), ({eventRes: eventId, formatted: formatted, errors: 'Unauthorized to edit event.', hasErrors: true, user: req.session.user}));
        }
   }) 
   .patch(async (req, res) => {

        // check if logged in user
        if (!req.session.user) {
            res.redirect('/auth/')
        }

        const requestBody = req.body; 
        let errors = [];
        let formatted = {};
        req.params.id = helperFuncs.checkEventId(req.params.id);
        const eventCollection = await events();
        const reloader = await eventCollection.findOne({_id: new ObjectId(req.params.id)});

        // check for content
        if (!requestBody || Object.keys(requestBody).length === 0) {
            return res.status(400).render(path.resolve('views/editEvent'), ({errors: 'There are no fields in request body.', hasErrors: true, user: req.session.user}));
        }

        // checking parameters
        
        try {
            if (requestBody.eventNameEdit) {
                requestBody.eventNameEdit = validators.checkString(requestBody.eventNameEdit, 'Edit Event Name');
            }
        }
        catch(e) {
            errors.push(e);
        }

        try {
            if (requestBody.dateEdit) {
                requestBody.dateEdit = validators.checkDate(requestBody.dateEdit, 'Edit date');
                formatted.date = helperFuncs.eventDateTimeFormat(requestBody.dateEdit);
            }
            else {
                formatted.date = reloader.date;
            }
        }
        catch(e) {
            errors.push(e);
        }

        try {
            if (requestBody.locationEdit) {
                requestBody.locationEdit = validators.checkString(requestBody.locationEdit, 'Edit Event Location');
            }
        }
        catch(e) {
            errors.push(e);
        }
        try {
            if (requestBody.categoryEdit) {
                requestBody.categoryEdit = validators.checkString(requestBody.categoryEdit, 'Edit Event category');
            }
        }
        catch(e) {
            errors.push(e);
        }

        try {
            if (requestBody.descriptionEdit) {
                requestBody.descriptionEdit = validators.checkString(requestBody.descriptionEdit, 'Edit Event Description');
            }
        }
        catch(e) {
            errors.push(e);
        }

        try{
            if (requestBody.portEdit) {
                requestBody.portEdit = validators.checkString(requestBody.portEdit, 'Edit Event Port');
            }
        }
        catch(e) {
            errors.push(e);
        }

        try{
            if (requestBody.modeEdit) {
                requestBody.modeEdit = helperFuncs.checkEventMode(requestBody.modeEdit);
            }
        }
        catch(e) {
            errors.push(e);
        }

        try {
            if (requestBody.feeEdit) {
                requestBody.feeEdit = validators.checkPrice(Number(requestBody.feeEdit), 'Edit Registration Fee');
                formatted.fee = helperFuncs.eventPriceFormat(requestBody.feeEdit);
            }
            else {
                formatted.fee = helperFuncs.eventPriceFormat(reloader.registrationFee);
            }
        }
        catch(e) {
            errors.push(e);
        }

        try{
            if (requestBody.action) {
                requestBody.action = helperFuncs.checkPublishStatus(requestBody.action);
            
                // If an event is going from saved to published we assign it the new status
                if (requestBody.action === 'publish' && reloader.publish === 'save') {
                    requestBody.statusEdit = 'Published';
                }
            }
        }
        catch(e) {
            errors.push(e);
        }

        try{
            if (requestBody.statusEdit) {
                requestBody.statusEdit = helperFuncs.checkStatus(requestBody.action, requestBody.statusEdit, 'Edit Event Status');
            }
        }
        catch(e) {
            errors.push(e);
        }

        if (errors.length > 0) {
            return res.status(400).render(path.resolve('views/editEvent'), {errors: errors, hasErrors: true, user: req.session.user});
        }

        let updatePost = await updateEventPatch(req.params.id, requestBody);
        if (updatePost) {
            updatePost = '/event/' + updatePost._id.toString();
            return res.redirect(updatePost)
        }
        else {
            return res.render(path.resolve('views/editEvent'), ({errors: errors, hasErrors: true, user: req.session.user}));
        }
   })
   .delete(async (req, res) => {
        
        // check if logged in user
        if (!req.session.user) {
            res.redirect('/auth/')
        }

        const requestBody = req.body;
        const eventCollection = await events();
        let requestId = req.params.id;

        // Not valid user
        try {
            requestId = validators.checkObjectId(requestId, 'Delete ID');
        } catch (e) {
            return res.render(path.resolve('views/login'), ({errors: 'Cannot find event attatched to current user', hasErrors: true, user: req.session.user}));
        }

        // Not valid event or User not authorized to delete the event
        try {
            const userCollection = await users(); 
            const userId = await userCollection.findOne({
                'events._id': new ObjectId(requestId)
            });
            if (!userId) throw `Cannot find event attatched to a user.`
        }
        catch(e) {
            return res.render(path.resolve('views/eventList'), ({errors: e, hasErrors: true, user: req.session.user}));
        }

        try {
            if (requestBody.delete === 'delete') {
                let deletion = await deleteEvent(requestId);
                if (deletion.deleted === true) {
                    return res.redirect('/event/');
                }
                else {
                    throw `Could not delete event.`
                }
            }
        }
        catch(e) {
            return res.render(path.resolve('views/eventList'), ({errors: e, hasErrors: true, user: req.session.user}));
        }


   })



// Added code for review, subscription

router
.route('/search')
.get(async (req, res) => {
    //code here for GET

    if (req.session.user) {

        return res.render('eventHome', { title: "Events", user: req.session.user});

    }

    return res.redirect('/auth');    

})
.post(async (req, res) => {
    //code here for POST
    try {
        const eventNameInput = xss(req.body.eventNameInput);
        const eventDateInput = xss(req.body.eventDateInput);
        const locationInput = xss(req.body.locationInput);
        const categoryInput = xss(req.body.categoryInput);
        const registrationFeeInput = xss(req.body.registrationFeeInput);


        if (!eventNameInput && !eventDateInput && !locationInput && !categoryInput  && !registrationFeeInput ) {
            throw 'All fields must not be empty.';
        }


        if(eventDateInput)
            validators.checkDate(eventDateInput,'Event Date');

        if(registrationFeeInput)
            validators.checkPrice(registrationFeeInput,'Registration Fee');

        let eventSearched = await eventData.searchEvent(eventNameInput, eventDateInput, locationInput, categoryInput, registrationFeeInput);
        
        if(eventSearched)
        {      
            return res.json({
                success: true,
                events: eventSearched
            });
        }
        else
        {
            return res.status(500).json({success: false,  "error": "Internal Server Error" });
    
        }

    } catch (e) {
        return res.status(400).json({success: false,  "error": e });
    };
    

});


router
.route('/subscribe/:id')
.get(async (req, res) => {
    //code here for GET

    if (req.session.user) {

        const eventId = xss(req.params.id);
        const userId = req.session.user.userId;
        if(!eventId || !userId)
        {
            return res.status(500).json({success: false, "error": "Not a valid request. User is not authorized or eventId missing."});

        }
        else{
            try{

                let eventSubscribed = await eventData.addSubscriber(eventId, userId);

                if(eventSubscribed)
                {      
                    return res.json({
                        success: true,
                        event: eventSubscribed
                    });
                }
                else
                {
                    return res.status(500).json({success: false, "error": "Internal Server Error"});
            
                }

            } catch (e) {
                return res.status(400).json({success: false,  "error": e });
            };

        }
        

    }
    return res.redirect('/auth');    
})
.post(async (req, res) => {
    //code here for POST
    let eventId = xss(req.body.id);
    if(!eventId)
        eventId = xss(req.params.id);
    if(!eventId)
        {
            return res.status(500).json({success: false, "error": "Not a valid request, eventId missing."});

        }
        
        res.redirect(`/event/subscribe/${eventId}`);
    
});



//Event Rating:
router
.route('/review/:id')
.get(async (req, res) => {
    //code here for GET

    if (req.session.user) {

        return res.render('eventHome', { title: "Events", user: req.session.user});

    }

    return res.redirect('/auth');    

})
.post(async (req, res) => {
    //code here for POST
    try {
        const eventId = xss(req.params.id);
        const userId = req.session.user.userId;

        const reviewCommentInput = xss(req.body.reviewCommentInput);
        const ratingInput = xss(req.body.ratingInput);

        if (!ratingInput) {
            throw 'Rating must not be empty. Select a rating.';
        }


        let eventReviewed = await reviewData.createReview(eventId,
            userId,
            reviewCommentInput,
            ratingInput );
        
        if(eventReviewed)
        {      
            return res.json({
                success: true,
                updatedEvent: eventReviewed
            });
        }
        else
        {
            return res.status(500).json({success: false,  "error": "Internal Server Error" });
    
        }

    } catch (e) {
        return res.status(400).json({success: false,  "error": e });
    };
    

})




export default router;