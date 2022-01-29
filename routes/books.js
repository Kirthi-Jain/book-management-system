const router = require("express").Router();
const verify = require("../verifyToken");
const {Book,UpdateBook} = require("../models/book");
const displayError = "Enter valid Search Criteria!";
const notFound = "Book(s) not Found!!";

router.post("/addBook", verify, (req,res)=> { 
    const {body} = req;
    for (const key in body) {
        body[key] = body[key].trim().toLowerCase();
    }
    body.pdf_URL = body.title && "impetus_infotech_books_"+body.title.replace(/\s/g, "");
    new Book(body).save().then(r=> res.send(r)).catch(e=> reEnter(res,500,e.message));
});

const reEnter = (res,code,msg) => res.status(code).send(msg); 

router.get('/',verify ,async(req,res)=>{
    const {query} = req;
    const {title,author,sortBy} = query;
    const len = Object.keys(query).length;
    const find =  async (keyValue) => {
        const book = await Book.find(keyValue);
        if (!book.length) {
            return reEnter(res,404,notFound);
        }
       res.send(book);
    };
    if (!len || (len === 1 && (title || author))){
        return find(query);
    }    
    const sorting =  async (sortQuery) => {
        const books = await Book.find(sortQuery);
        return books.length ? await Book.find(sortQuery).sort({publishedDate:sortBy}).then(r => res.send(r)):reEnter(res,404,notFound); 
    };
    if(len === 1 && (sortBy == 1 || sortBy == -1)) {
    return sorting({});
    }
    if(len ===2 && author && (sortBy == 1 || sortBy == -1)){
        return sorting({author:author});
    }
    reEnter(res,400,displayError);
});

router.put('/update/:pdf_URL', verify, async(req,res)=>{ 
    const {params,body} = req;
    const book = await Book.findOne(params);
    if(!book){
        return reEnter(res,404,notFound);   
    }
    if(!Object.keys(body).length){
        return reEnter(res,400,"Enter details to be updated!!");
    }
    const {error,value} = UpdateBook(body);
    if(error){
        return reEnter(res,400,error.details[0].message);
    }
    for (const keyBook in book) {
        for (const keyValue in value) {
            if ((keyBook == keyValue && book[keyBook] == value[keyValue]) || (keyValue == "title" && await Book.findOne({[keyValue]: value[keyValue]}))) {
                return reEnter(res,400,"Details already present in record. Please enter new details");
            }
        }
    } 
    for (const key in value) {
       value[key] = value[key].trim().toLowerCase();
    }
    value.pdf_URL = value.title? "impetus_infotech_books_"+value.title.replace(/\s/g, "") : book.pdf_URL;
    await Book.updateOne(book,value).then(r=> res.send("Book details updated successfully!")).catch(e=>reEnter(res,500,e.message));
});

router.delete('/delete/:pdf_URL', verify, async(req,res)=>{
    const {params} = req;
    const book = await Book.findOne(params);
    if(!book){
        return reEnter(res,404,notFound);
    }
    Book.deleteOne(book).then(r=>res.send("Book deleted successfully!")).catch(function(e){reEnter(res,500,e.message);});
});

module.exports = router;