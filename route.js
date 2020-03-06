const router = require('express').Router();
const userController = require('./controller/userController');
 const projectController = require('./controller/projectController');
var jwt = require('jsonwebtoken');
var jwtmiddleware = require ('./utility/tokenManagement.js') 

var authController = require ('./controller/authController.js')
var imageController = require ('./controller/imageController.js')

//router.use('/get', getController);

router.use('/users',jwtmiddleware,userController);
 router.use('/project',jwtmiddleware,projectController);
 router.use('/image',jwtmiddleware,imageController);
 router.use('/auth',authController);

module.exports = router;

