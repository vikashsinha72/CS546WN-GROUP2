import session from 'express-session';

// TODO username must be the same as the session user for create event
// This is to make sure the user is logged into their account to create an event
// Not currently implemented in app.js
export const checkLoginEventCreate = ('/createEvent', async(req, res, next) => {
    if (req.method === 'GET') {
        if (!req.session.user) {
            return res.redirect('/login');
        }
    }
    next();
})