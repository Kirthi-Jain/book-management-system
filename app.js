const express = require("express");
const {connect} = require("mongoose");
const {config} = require("dotenv");
const authRoute = require("./routes/auth");
const books = require("./routes/books");
const {isLoggedIn} = require("./models/user");

config();
const app = express();
app.use(express.json());//Middleware

//Route Middlewares so that app is root primary file 
app.use("/api/user", authRoute);
app.use("/api/books" , books);

const {PORT, DB_CONNECT} = process.env;
connect(DB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(r => {
    app.listen(PORT, async ()=> {
    await isLoggedIn.deleteMany();
    console.log(`Listening on port ${PORT}`); 
})}).catch(error=> console.log(error.message));

