import express from 'express';
import xss from 'xss';

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
    try{

      const eventId = xss(req.body.eventId);
      const userName = xss(req.body.userName);
      const phoneNumber = xss(req.body.phoneNumber);
      const bestStartDate = xss(req.body.bestStartDate);
      const bestEndDate = xss(req.body.bestEndDate);
      const emailId = xss(req.body.emailId);

    try {
    const newEventRegistration = await eventsRegistrationData.userEventRegistration(
      req.session.user.userId,
      eventId,
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate
    );
      return res.redirect('/event');   
    }
  catch (e) {
    res.status(400).json({ error: e });
  }  

}
catch(e){
  console.log("Error in eventRegistration : " +e)

  return res.redirect('/event');   


}
  })

export default router;
  