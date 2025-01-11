const jwt = require('jsonwebtoken');
const { ROLES } = require('../db');
const SECRET = process.env.ACCESS_TOKEN_SECRET;

function authenticateToken(req, res, next) {
    // console.log(req.headers);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);

    if (!token) {
        return res.status(400).json({ message: "You need To login!" });
    }

    // After Verify it call a callback for checking error
    jwt.verify(token, SECRET, function (err, token_data) {
        if (err) return res.status(400).json({ message: "Forbidden", error: err });

        req.user = token_data.user;
        next();
    });
}

// authRole function is a middleware that returns a function that checks if the user has the role passed as an argument.
function authRole(...allowedRoles) {
    return function (req, res, next) {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Not Allowed" });
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    authRole
}