import authRoutes from './auth.js';
import userRoutes from './users.js';
import eventRoutes from './event.js';
import searchRoutes from './search.js';
import busRoutes from './business.js';

const constructorMethod = (app) => {
    app.use('/', authRoutes);       // signup registration, login
    app.use('/user', userRoutes);       // profile, user event register form
    app.use('/event', eventRoutes);     // event management, create event, edit event, event page
    app.use('/search', searchRoutes);   // search results
    app.use('/business', busRoutes);    // business profiles

    // --- Consider ---
    // Should we use a redirect to the homepage if something isn't found?
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not Found'});
    });

}

export default constructorMethod;