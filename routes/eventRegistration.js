import express from 'express';
import eventsData from '../data/events.js';
import eventsRegistrationData from '../data/eventRegistration.js';
import { users, events } from '../config/mongoCollections.js';
const router = express.Router();

// router.route('/').get((req, res) => {
//     res.render('homepage', { title: 'Event Management System' });
// })

// router.route('/createEvent').get((req, res) => {
//     res.render('createEvent', { title: 'Create Event' });
// })
//     .post(async (req, res) => {
//       const { userName, 
//         eventName, 
//         date, 
//         location, 
//         category, 
//         description, 
//         nearByPort, 
//         eventMode, 
//         registrationFee,
//         contactPerson} = req.body;
//       try {
//         const newEvent = await eventsData.createEvent(
//           userName, 
//           eventName, 
//           date, 
//           location, 
//           category, 
//           description, 
//           nearByPort, 
//           eventMode, 
//           registrationFee,
//           contactPerson
//          );
//           res.status(200).json(newEvent);
//     }
//     catch (e) {
//       res.status(400).json({ error: e });
//     }
//     })

router.route('/')
  .get(async(req, res) => {
    try{
      // currently gets all user events
      const getUser = req.session.user.username;
      const userCollection = await users();
      let userId = await userCollection.findOne({username: getUser});
      // if user doesn't go through reroute?
      const events = await eventsData.getAllEvents(userId._id.toString());
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
  