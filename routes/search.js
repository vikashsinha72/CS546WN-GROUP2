// --- Basic router skeleton, feel free to add any routes, change your route names, etc
// --- Remember res.render will require a {title: ?} and {stylesheet: ?} argument for ALL calls rendering an html

import {Router} from 'express';
const router = Router(); 

router
    .route('/auth')
    .get(async (req, res) => {
        // --- insert get request here ---
    })
    .post(async (req, res) => {
        // --- insert post request here ---
    });

export default router;