
// let {courses} = require("../data/courses")

const Course = require("../models/course.model")

const {validationResult} = require("express-validator");

const statustxt = require("../utils/statustxt");
const asyncWarpper = require("../middlewares/asyncWarpper");
const appError = require("../utils/appError");

const getAllCourses = asyncWarpper(async (req, res)=>{
    // use query parameters for pagenation
    // /api/courses?limit=2&page=1
    const query = req.query;

    const limit = query.limit || 15;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get all courses from DB using Course model
    // find({ query filter }, { projection })
    // find({ price: {$gt: 800} }, { "__v": false })
    const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);
    res.json({status: statustxt.SUCCESS, data: {courses}});
});

const getCourse = asyncWarpper( async (req, res, next)=>{

    // const id = +req.params.id;
    // const course = courses.find( (course) => course.id == id );

    const course = await Course.findById(req.params.id);
    
    if(!course){
        appError.create("course not found!", 404, statustxt.FAIL);
        return next(appError);
        // const err = new Error();
        // err.message = "course not found!";
        // err.statusCode = 404;
        // return next(err);
        // return res.status(404).json({status: statustxt.FAIL, data: {course: null}});
    }
    return res.json({status: statustxt.SUCCESS, data: {course}});

    // try {
    // }
    // catch(err){
    //     return res.json({status: statustxt.ERROR, data: null, msg: {error: err}});
    // }
});

const createCourse = asyncWarpper(async (req, res, next) => {

    // if (!req.body.title) {
    //     res.status(400).json({msg: "title not provided"});
    // }
    // if (!req.body.price) {
    //     res.status(400).json({msg: "price not provided"});
    // }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        appError.create(errors.array(), 400, statustxt.FAIL);
        return next(appError);
        // return res.status(400).json({status: statustxt.FAIL, data: errors.array()});
    }

    const newCrs = new Course(req.body);
    // courses.push(newCrs);
    await newCrs.save();
    res.status(201).json({status: statustxt.SUCCESS, data: {course: newCrs}})
});

const updateCourse = asyncWarpper(async (req, res, next) => {

    // const id = +req.params.id;
    // let crs = courses.find( (course) => course.id === id );

    // return object before update
    // const crs = await Course.findByIdAndUpdate(req.params.id, {$set: {...req.body}})
    const oldCourse = await Course.findById(req.params.id);
    if(!oldCourse){
        appError.create("course not found!", 404, statustxt.FAIL);
        return next(appError);
    }

    await Course.updateOne({_id: req.params.id}, {$set: {...req.body}})
    // if(!crs){
    //     return res.status(404).json({msg: "not found"});
    // }
       
    // crs = { ...crs, ...req.body};
    const newCourse = await Course.findById(req.params.id);
    return res.status(200).json({status: statustxt.SUCCESS, data: {newCourse}});

    // try{
    // }
    // catch(err){
    //     return res.json({status: statustxt.ERROR, data: null, msg: {error: err}});

    // }
});

const deleteCourse = asyncWarpper(async (req, res, next) => {
    // const id = +req.params.id;
    
    // courses = courses.filter((course) => course.id !== id);
    const oldCourse = await Course.findById(req.params.id);
    if(!oldCourse){
        appError.create("course not found!", 404, statustxt.FAIL);
        return next(appError);
    }

    await Course.deleteOne({_id: req.params.id});

    res.status(200).json({status: statustxt.SUCCESS, data: null});
})



module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}