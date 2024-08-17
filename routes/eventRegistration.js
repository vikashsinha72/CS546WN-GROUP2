import express from 'express';
import eventsData from '../data/events.js';
import eventsRegistrationData from '../data/eventRegistration.js';
const router = express.Router();

router.route('/')
  .get(async(req, res) => {
    try{
      const events = await eventsData.getEvents();
      // console.log("events from route: ", events)
      res.render('eventRegistration', { title: 'Event Registration', events, user: req.session.user })   
    } 
    catch (e) {
      console.log(e)
      res.status(500).json({error: e });
    }   
}) 
  .post(async (req, res) => {
    const { 
      eventId,
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate} = req.body;
    
    try {
    const newEventRegistration = await eventsRegistrationData.createEventRegisteredUser(
      eventId,
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate
    );
      res.status(200).json(newEventRegistration);
    }
  catch (e) {
    res.status(400).json({ error: e });
  }
  })


export default router;
  