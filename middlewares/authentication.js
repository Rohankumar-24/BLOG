const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
function checkForAuthenticationCookie(cookieName) {
    return async (req, res, next) => {
        const token = req.cookies?.[cookieName];

        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded._id).lean();
            req.user = user || null;
        } catch (err) {
            console.error("Auth error:", err.message);
            req.user = null;
        }

        next();
    };
}

module.exports = { checkForAuthenticationCookie };
