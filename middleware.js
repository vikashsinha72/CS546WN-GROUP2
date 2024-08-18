// Middleware for different browser methods namely post/put
const rewriteMethods = ((req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});



/**create log for each request */
const logRequest = async (req, res, next) => {
    const authenticated = req.session.user ? req.session.user.firstName + " "  + req.session.user.lastName: 'guest';
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl}:${res.statusCode} (${authenticated})`);
    return next();
} 

const rootRequest = async (req, res, next) => {

    if (req.originalUrl === '/logout') {
        return next();
    }
    
    if (req.session.user) {

        /** ignore role check and forward request as next */
        if (req.originalUrl === '/') {
            console.log(" root Request");
            return res.redirect('/event');
        }

        return next();


    } else {
        if (req.originalUrl === '/') {
            console.log(" root Request");
            return res.redirect('/auth');
        }
    }
        
    return next();
};

//login
const redirectAuthenticatedLogin = async (req, res, next) => {
    if (req.session.user) {
        return next();
    }  else {
        if (req.originalUrl !== '/auth') {
            return res.redirect('/auth');
        }
    }
    return next();
};

//register
const redirectAuthenticatedRegister = async (req, res, next) => {
    if (req.session.user) {
        /** ignore role check and redirect request to user */
        if (req.originalUrl !== '/user') {
            return res.redirect('/user');
        }
        else{
            return next();
        }
     } 
 /*     else {
         if (req.originalUrl !== '/auth') {
             return res.redirect('/auth');
         }
     } */
    
    return next();
};

//event : This may not require
const ensureAuthenticated = async (req, res, next) => {
    if (!req.session.user) {
        if (req.originalUrl !== '/auth') {
            return res.redirect('/auth');
        }
        return next();
    }

    // if (req.originalUrl !== '/event') {
    //     return res.redirect('/event');
    // }
    
    return next();
};


//logout
const ensureLogout = async (req, res, next) => {
    if (!req.session.user) {
        if (req.originalUrl !== '/auth') {
            return res.redirect('/auth');
        }
    }
    return next();
};

export {
    rewriteMethods,
    logRequest,
    rootRequest,
    redirectAuthenticatedLogin,
    redirectAuthenticatedRegister,
    ensureAuthenticated,
    ensureLogout
};
