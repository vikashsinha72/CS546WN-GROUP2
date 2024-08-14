
// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
import eventData from '../data/events.js';

import validators from '../validators.js';

const router = Router(); 


router.route('/').get(async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    //return res.json({error: `YOU SHOULD NOT BE HERE! ${req.originalUrl}`});
    if (req.session.user) {

        return res.render('eventHome', { title: "Events", user: req.session.user});

    }

    return res.redirect('/auth');    



});
    
router
.route('/create')
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
    const { eventNameInput, eventDateInput, locationInput, categoryInput, descriptionInput, nearByPortInput, eventModeInput, registrationFeeInput, contactPersonInput } = req.body;
    if (!eventNameInput || !eventDateInput || !locationInput || !categoryInput || !descriptionInput || !nearByPortInput || !eventModeInput || !registrationFeeInput || !contactPersonInput) {
        throw 'All fields must be supplied.';
    }

        // Add further validation

        validators.checkStrings(
            [eventNameInput, 'Event Name'],
            [descriptionInput, 'Event Description'],
            [locationInput, 'Event Location'],
            [categoryInput, 'Category'],
            [nearByPortInput, 'Near-By Port'],
            [eventModeInput, 'Event Mode'],
            [contactPersonInput, 'Contact PersonId']

        );
        validators.checkDate(eventDateInput,'Event Date');
        validators.checkPrice(registrationFeeInput,'Registration Fee');

        let eventCreated = await eventData.create(eventNameInput, descriptionInput, eventDateInput, locationInput, categoryInput, nearByPortInput, eventModeInput, registrationFeeInput, contactPersonInput, true);
        
        if(eventCreated._id)
        {      
            return res.redirect('/event');
        }
        else
        {
            return res.status(500).render('event', { title:"Event Creation Error", error: "Internal Server Error"});
    
        }

    } catch (e) {
    return res.status(400).render('event', { title:"event", error: e });
    }

});



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
    const { eventNameInput, eventDateInput, locationInput, registrationFeeInput, contactPersonInput } = req.body;
    if (!eventNameInput && !eventDateInput && !locationInput && !categoryInput  &&!registrationFeeInput ) {
        throw 'All fields must not be empty.';
    }


        if(!eventDateInput)
            validators.checkDate(eventDateInput,'Event Date');

        if(!registrationFeeInput)
        validators.checkPrice(registrationFeeInput,'Registration Fee');

        let eventCreated = await eventData.create(eventNameInput, descriptionInput, eventDateInput, locationInput, categoryInput, nearByPortInput, eventModeInput, registrationFeeInput, contactPersonInput, true);
        
        if(eventCreated._id)
        {      
            return res.redirect('/event');
        }
        else
        {
            return res.status(500).render('event', { title:"Event Creation Error", error: "Internal Server Error"});
    
        }

    } catch (e) {
    return res.status(400).render('event', { title:"event", error: e });
    }

});


export default router;