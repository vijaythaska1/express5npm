const jwt = require('jsonwebtoken');
const UserModel = require('../model/userModel')
require('dotenv').config();
module.exports = {
    asyncMiddleware: async function (req, res, next) {
        try {
            const SECRET_KEY = req.headers['secret_key'];
            const PUBLISH_KEY = req.headers['publish_key'];
            console.log(SECRET_KEY,PUBLISH_KEY);
            
            if (process.env.SECRET_KEY === SECRET_KEY &&
                process.env.PUBLISH_KEY === PUBLISH_KEY) {
                next();
            } else {
                return res.status(404).send({
                    message: "key is not macth"
                });
            }

        } catch (error) {
            console.log(error);
        }
    },

    authenticateToken: async function (req, res, next) {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(' ')[1];
            if (!token) {
                return failedToken(res, "Unauthorized");
            }
            let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const isValidUser = await UserModel.findOne({
                _id: decodedToken.userId
            });
            if (!isValidUser) {
                return failedToken(res, "Invalid token");
            };
            req.user = isValidUser;
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send("Invalid token");
        }
    }
}