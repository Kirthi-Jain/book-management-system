const {Schema,model} = require("mongoose");
const Joi = require("Joi");
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const wordRegex = /^[A-Za-z]{3,15}[ ]?[A-Za-z]{0,15}$/;

const bookSchema = new Schema({
    title: {
        unique: true,
        type: String,
        required: "Title is Required!!",
        match: wordRegex
    },
    author: {
        type: String,
        required: "Author is Required!!",
        match: wordRegex
    },
    publishedDate: {
        type: String,
        required: "Published Date is Required!!",
        match: dateRegex
    },
    category: {
        type: String,
        required: "Category is Required!!",
        match: wordRegex
    },
    pdf_URL: String ,
}, {timestamps : true});

const updateBookSchema = {
    title: Joi.string().min(2).max(30), 
    author: Joi.string().min(2).max(30),
    publishedDate : Joi.string().regex(dateRegex),
    category : Joi.string().min(2).max(30)
};

module.exports.UpdateBook = function (body){
    return Joi.validate(body,updateBookSchema);
};
module.exports.Book = model("Book", bookSchema);