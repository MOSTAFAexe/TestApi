const express = require("express");
// to upload files and choose destination to upload in it
const multer = require("multer");
// using dest: will not sotre image in best way
// const upload = multer({dest: "uploads/"});

const diskStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads");
    },
    filename: (req, file, cb)=>{
        const ext = file.mimetype.split("/")[1];
        const fileName = `user-${Date.now()}.${ext}`
        cb(null, fileName);
    }
})
const fileFilter = (req, file, cb)=>{
    const imageType = file.mimetype.split("/")[0];
    if(imageType == "image"){
        return cb(null, true);
    }else{
        appError.create("please upload a valid image", 400, statustxt.FAIL);
        return cb(appError, false)
    }
    
}
const upload = multer({storage: diskStorage, fileFilter: fileFilter});

const router = express.Router();  
const verifyToken = require("../middlewares/verifyToken");

const userController = require("../controllers/users.controller");
const appError = require("../utils/appError");
const statustxt = require("../utils/statustxt");

// get all uesrs 
// register
// login

router.route("/")
    .get(verifyToken, userController.getAllUsers);

router.route("/register")
    .post(upload.single("avatar"), userController.register);

router.route("/login")
    .post(userController.login);

module.exports = router;