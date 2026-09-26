const {getAuth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if(!token) {
        return res.status(401).json({message: 'No token provided'});
    }

    try {
        const decoded = await getAuth().verifyIdToken(token);
        req.user = decoded;
        next();
    }
    catch (erorr) {
        return res.status(401).json({message: 'Invalid Token'});
    }
};

module.exports = verifyToken;