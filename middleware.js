
/**create log for each request */
const logRequest = async (req, res, next) => {
    const authenticated = req.session.user ? 'user' : 'guest';
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${authenticated})`);
    return next();
} 

const rootRequest = async (req, res, next) => {

    if (req.originalUrl === '/logout') {
        return next();
    }
    
    if (req.session.user) {

        /** ignore role check and forward request as next */
        return next();

        /** TODO: This block of code will be ignored */
        if (req.session.user.role === 'admin') {
            if (req.originalUrl === '/user') {
                return next();
            }
            else if (req.originalUrl !== '/admin') {
                return res.redirect('/event');
            }
        } else if (req.session.user.role === 'user') {
            if (req.originalUrl !== '/user') {
                return res.redirect('/user');
            }
        }
        else{
            return res.status(403).json({error: '403: Forbidden'});
        }

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

        /** ignore role check and forward request as next */
        return next();
        /** TODO: This block of code will be ignored */

        if (req.session.user.role === 'admin') {
            if (req.originalUrl !== '/event') {
                return res.redirect('/event');
            }
        } else if (req.session.user.role === 'user') {
            if (req.originalUrl !== '/user') {
                return res.redirect('/user');
            }
        }
        else{
            return res.status(403).json({error: '403: Forbidden'});
        }
    }  else {
        console.log(" processing /auth")
        if (req.originalUrl !== '/auth') {
            return res.redirect('/auth');
        }
    }

    console.log(" processing auth middleware")


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
        /** TODO: This block of code will be ignored */

        if (req.session.user.role === 'admin') {
            if (req.originalUrl !== '/event') {
                return res.redirect('/event');
            }
        } else if (req.session.user.role === 'user') {
            if (req.originalUrl !== '/user') {
                return res.redirect('/user');
            }
        }
        else{
            return res.status(403).json({error: '403: Forbidden'});
        }
    } else {
        if (req.originalUrl !== '/auth') {
            return res.redirect('/auth');
        }
    }
    
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

    if (req.originalUrl !== '/event') {
        return res.redirect('/event');
    }
    
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
    logRequest,
    rootRequest,
    redirectAuthenticatedLogin,
    redirectAuthenticatedRegister,
    ensureAuthenticated,
    ensureLogout
};
