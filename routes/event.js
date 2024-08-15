
// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
import xss from 'xss';

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
    const eventNameInput = xss(req.body.eventNameInput);
    const eventDateInput = xss(req.body.eventDateInput);
    const locationInput = xss(req.body.locationInput);
    const categoryInput = xss(req.body.categoryInput);
    const descriptionInput = xss(req.body.descriptionInput);
    const nearByPortInput = xss(req.body.nearByPortInput);
    const eventModeInput = xss(req.body.eventModeInput);
    const registrationFeeInput = xss(req.body.registrationFeeInput);
    const contactPersonInput = xss(req.body.contactPersonInput);

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
        const userId = req.user.userId;
        if(!eventId || !userId)
        {
            return res.status(500).json({success: false, "error": "Not a valid request. User is not authorized or eventId missing."});

        }
        else{
            try{

                let eventSubscribed = await eventData.addSubscriber(eventNameInput, eventDateInput, locationInput, categoryInput, registrationFeeInput);

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
    const eventId = xss(req.body.id);
    req.redirect(`/event/subscribe/${eventId}`);
    
});


export default router;