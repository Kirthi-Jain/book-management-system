const router = require("express").Router();
const bcrypt = require("bcryptjs");
const {sign} = require("jsonwebtoken");
const {Register,Login, isLoggedIn} = require("../models/user");

const sendResp =(res,code,msg) =>res.status(code).send(msg);

router.post("/register", async(req,res)=>{
    const {body} = req;
    const salt = await bcrypt.genSalt(10);
    body.password =  body.password && await bcrypt.hash(body.password,salt);
    body.name = body.name && body.name.trim();
    new Register(body).save().then(r=>res.send(r)).catch(e=>sendResp(res,500,e.message));   
});

router.post("/login", async (req,res)=>{
    const {error,value} = Login(req.body);
    if(error){
        return sendResp(res,400,error.details[0].message);
    }
    const invalid = ()=> sendResp(res,404,"Email or Password is Wrong");
    const emailObj = {email : value.email};
    const user = await Register.findOne(emailObj);
    if(!user){
        return invalid();
    }
    const {password, _id} = user;
    const validPassword = await bcrypt.compare(value.password,password);
    if(!validPassword){
        return invalid();
    }
    const logger = await isLoggedIn.findOne(emailObj);
    if(!logger){
        //Create and assign a token
        const token = await sign({_id: _id}, process.env.SECRET_TOKEN,{expiresIn: "10m"});
        await new isLoggedIn(emailObj).save();
        setTimeout(async ()=>await isLoggedIn.findOneAndDelete(emailObj),600000);
        return res.header("auth_token", token).send(`Logged in!! Check token in header`); 
    }
    sendResp(res,400,"User already Logged In");
});

router.delete("/logout/:email",async (req,res)=> {
    const {params} = req;
    const user = await Register.findOne(params);
    if(user){
        const logger = await isLoggedIn.findOne(params);
        if(!logger){
            return sendResp(res,400,"User Not Logged In");
        }
        await isLoggedIn.findOneAndDelete(params);
        process.env.SECRET_TOKEN = process.env.SECRET_TOKEN.split("").reverse().join("");
        return res.send("Logged out Successfully");
    }
    sendResp(res,400,"Enter valid Email");
});

module.exports = router;
