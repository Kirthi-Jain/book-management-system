const {Schema,model} = require("mongoose");
const Joi = require("Joi");
const RegisterSchema = new Schema({
    name: {
        type: String,
        required: "Name is required!!",
        match: /^[A-Za-z]{3,15}[ ][A-Za-z]{3,15}$/      
    },
    email: {
        type: String,
        required: "Email is required!!", 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String,
        required: "Password is required!!",
        max: 1024 }
}, {timestamps : true});

const LoginSchema = {
    email: Joi.string().email().required(),
    password : Joi.string().required()
};

module.exports.Login = function (body){
    return Joi.validate(body,LoginSchema);
};

module.exports.isLoggedIn = model("Logger", new Schema({email: String},{timestamps:true}));
module.exports.Register = model("User",RegisterSchema);
