import express from 'express';
const router = express.Router();

router.route('/').get((req, res) => {
    res.render('eventHome', { title: 'Event Management System' });
})

