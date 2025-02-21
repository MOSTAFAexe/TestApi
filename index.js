// npm i express-validator
// use express-validator to validate

// add mongoose
// npm i mongoose --save

// use dotenv to make process read .env file
require("dotenv").config();

const statustxt = require("./utils/statustxt");

// CORS → cross origin resource sharing 
// the front will block the connection if its not in the same origin
const cors = require("cors"); 

const path = require("path");
const express = require("express");
const app = express();

// for static files like images
// __dirname → current directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoose = require("mongoose");
//                            we could add dbname directly here after / ↓ dbname
const url = process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
    console.log("mongodb server strated");
});

app.use(cors());

app.use(express.json());
// == app.use(bodyParser.json());

const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

app.use("/api/courses", coursesRouter); // /api/courses
app.use("/api/users", usersRouter); // /api/users

// default route
// global middleware for not ffound routes
app.all("*", (req, res, next)=>{
    res.json({status: statustxt.ERROR, msg: "this resource is not availablee"});
});

// global error handler
app.use((err, req, res, next) => {
    
    res.status(err.statusCode || 500)
        .json({status: err.statustxt || statustxt.ERROR, data: null, code: err.statusCode || 500, msg: err.message});
})

app.listen(process.env.PORT || 5000, ()=>{
    console.log("listening on port 5000")
})
