import express from 'express';
import eventsData from '../data/events.js';
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
      const events = await eventsData.getEvents();
      console.log("events from route: ", events)
      res.render('eventRegistration', { title: 'Event Registration', events })   
    } 
    catch (e) {
      console.log(e)
      res.status(500).json({error: e });
    }   
}) 
  .post(async (req, res) => {
    const { 

      username,
      eventName,
      emailId,
      phoneNumber,
      bestTimetoCall} = req.body;
    
    try {
    const newEventRegistration = await eventsData.createEventRegistration(
      username,
      eventName,
      emailId,
      phoneNumber,
      bestTimetoCall
    );
      res.status(200).json(newEventRegistration);
    }
  catch (e) {
    res.status(400).json({ error: e });
  }
  })


export default router;
  