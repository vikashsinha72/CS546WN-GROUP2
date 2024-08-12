import express from 'express';
import * as eventsData from "../data/events.js";
const router = express.Router();

router.route('/').get((req, res) => {
    res.render('eventHome', { title: 'Event Management System' });
})

router.route('/createEvent').get((req, res) => {
    res.render('createEvent', { title: 'Create Event' });
})
    .post(async (req, res) => {
      const { userName, 
        eventName, 
        date, 
        location, 
        category, 
        description, 
        nearByPort, 
        eventMode, 
        registrationFee,
        contactPerson} = req.body;
      try {
        const newEvent = await eventsData.createEvent(
          userName, 
          eventName, 
          date, 
          location, 
          category, 
          description, 
          nearByPort, 
          eventMode, 
          registrationFee,
          contactPerson
         );
          res.status(200).json(newEvent);
    }
    catch (e) {
      res.status(400).json({ error: e });
    }
    })

router.route('/eventRegistration')
  .get((req, res) => {
    res.render('eventRegistration', { title: 'Event Registration' })
}) 


// router.route('/eventRegistration/:eventId')
      // .get(async (req, res) => {
      //   try {
      //     const reviewList = await eventData.getAllEventRegistrations(req.params.productId);
      //     res.status(200).json(reviewList);
      //   } catch (e) {
      //     if (e === 'Product not found' || e === 'No reviews found for this product') {
      //       res.status(404).json({ error: e });
      //     } else {
      //       res.status(500).json({ error: e });
      //     }
      //   }
      // })
    //   .post(async (req, res) => {
    //     try {
    //       const newEventRegistration = await eventsData.createEventRegistration (
    //         username, 
    //         eventName, 
    //         emailId, 
    //         phoneNumber, 
    //         bestTimetoCall 
    //       );
    //         res.status(200).json(newEventRegistration);
    //     }
    //   catch (e) {
    //     res.status(400).json({ error: e });
    //   }
    // })



export default router;
  