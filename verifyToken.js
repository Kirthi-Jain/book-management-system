const {verify} = require("jsonwebtoken");

module.exports = async function (req,res,next){ // Middleware function to be added to route which needs protection, i.e., access denied without token
    const token = req.header('auth_token');
    if (!token) {
        return res.status(401).send("Access Denied!");
    }
    try {
        req.user = await verify(token,process.env.SECRET_TOKEN);
        next();
    } catch (error) {
        res.status(400).send("Invalid Token or Expired!!Login for new Token");
    }
};
