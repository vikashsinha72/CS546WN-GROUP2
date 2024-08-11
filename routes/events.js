import express from 'express';

const router = express.Router();

router.route('/').get((req, res) => {
    res.render('eventHome', { title: 'Event Management System' });
});

router.route('/createEvent').get((req, res) => {
    res.render('createEvent', { title: 'Create Event' });
});

router.route('/eventRegistration').get((req, res) => {
    res.render('eventRegistration', { title: 'Event Registration' });
});

export default router;
  