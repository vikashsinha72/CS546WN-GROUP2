import express from 'express';
import eventsData from '../data/events.js';
import eventsRegistrationData from '../data/eventRegistration.js';
import { users, events } from '../config/mongoCollections.js';
const router = express.Router();

router.route('/')
  .get(async(req, res) => {
    try{

      // check if logged in user
      if (!req.session.user) {
          res.redirect('/auth')
      }
    
      // currently gets all user events
      const getUser = req.session.user.username;
      const userCollection = await users();
      let userId = await userCollection.findOne({username: getUser});
      // if user doesn't go through reroute?
      const events = await eventsData.getEventList();
      // console.log("events from route: ", events)
      res.render('eventRegistration', { title: 'Event Registration', events, user: req.session.user })   
    } 
    catch (e) {
      console.log(e)
      res.status(500).json({error: e });
    }   
}) 
//Used XSS to clean and verify string inputs
  .post(async (req, res) => {

      eventId = xss(req.body.eventId);
      userName = xss(req.body.userName);
      phoneNumber = xss(req.body.phoneNumber);
      bestStartDate = xss(req.body.bestStartDate);
      bestEndDate = xss(req.body.bestEndDate);
      emailId = xss(req.body.emailId);

    try {
    const newEventRegistration = await eventsRegistrationData.userEventRegistration(
      eventId,
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate
    );
      return newEventRegistration;
    }
  catch (e) {
    res.status(400).json({ error: e });
  }  
  return res.redirect('/event/home');   
  })

export default router;
  