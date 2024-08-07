import express from 'express';

const router = express.Router();

router.route('/').get((req, res) => {
    res.render('home', { title: 'Event Management System' });
});

router.route('/eventRegistration').get((req, res) => {
    res.render('eventRegistration', { title: 'Event Registration' });
});

export default router;
  