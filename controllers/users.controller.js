
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model")
const statustxt = require("../utils/statustxt");
const asyncWarpper = require("../middlewares/asyncWarpper");
const appError = require("../utils/appError");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWarpper(async (req, res)=>{
    // to access headers → req.headers
    query = req.query;

    const limit = query.limit || 15;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, {"__v": false, "password": 0}).limit(limit).skip(skip);
    res.json({status: statustxt.SUCCESS, data: {users}});
});

const register = asyncWarpper(async (req, res, next)=>{
    const {firstName, lastName, email, password, role} = req.body;

    const user = await User.findOne({email: email});
    if(user){
        appError.create("this email is already exists", 400, statustxt.FAIL);
        return next(appError);
    }

    // password hashing 
    // bcrypt.hash(string, salt)
    const hashedPassword = await bcrypt.hash(password, 5)

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    });

    // generate JWT token
    // jwt.sign(payload, secret)
    // to generate random secret write in cmd →
    // 1) node
    // 2) require('crypto').randomBytes(32).toString('hex');

    newUser.token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
    await newUser.save();

    res.status(201).json({status: statustxt.SUCCESS, data: {user: newUser}})
})

const login = asyncWarpper( async (req, res, next)=>{
    const {email, password} = req.body;
    
    if(!email || !password){
        appError.create("email and password are required", 400, statustxt.FAIL)
        next(appError);
    }

    const user = await User.findOne({email: email});
    if(!user){
        appError.create("your email might be wrong", 400, statustxt.FAIL);
        return next(appError);
    }
    
    // bcrypt.compare(pass, hashed)
    const isMatched = await bcrypt.compare(password, user.password);

    if(user && isMatched){
        // logged in successfully
        const token = await generateJWT({email: user.email, id: user._id, role: user.role});

        res.json({status: statustxt.Success,  data: {token}})
    }else{
        appError.create("your email or password might be wrong", 400, statustxt.FAIL);
        return next(appError);
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}