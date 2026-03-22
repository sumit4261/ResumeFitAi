const jwt = require("jsonwebtoken");
// const authRouter = require("../routes/auth.routes");
const tokenblackListModel = require("../models/blacklist.model")

async function authUser(req ,res, next){

    const token = req.cookies.token;

    if(!token){
        console.log("No token provided in cookies");
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlackListed = await tokenblackListModel.findOne({
        token
    })

    if(isTokenBlackListed){
        console.log("Token is blacklisted");
        return res.status(401).json({
            message: "Token is invalid"
        })
    }


    try{
        console.log("Verifying token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified successfully for user:", decoded.id);

        req.user = decoded;

        next();

    }catch(err){
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({
            message: 'Invalid Token'
        })
    }
}

module.exports = {authUser};