
const express = require("express");
const {body} = require("express-validator");

const router = express.Router();  


const controller = require("../controllers/courses.controller");
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

router.route("/")
    // get all
    .get(controller.getAllCourses)
    // create
    .post(
        verifyToken,
        [
            body("title")
                .notEmpty()
                .withMessage("title is required")
                .isLength({min: 2}),
            
            body("price")
                .notEmpty()
                .withMessage("price is required"),
        ],
        controller.createCourse
    );

    // to get a parameter from url
router.route("/:id")
    // get single
    .get(controller.getCourse)

    // Update 
    .patch(controller.updateCourse)
    
    // Delete
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), controller.deleteCourse);


// put → remove the old object and add the new one 
// patch → only edit the wanted value 




module.exports = router