const express=require('express');
const router=express.Router();

const validate = require("../middleware/validateMiddleware");
const { updateUserSchema} = require("../validators/userValidator");

const userController=require('../controllers/userController');
const auth=require('../middleware/auth');

router.get('/me',auth,userController.getUserInfo);
router.put('/update', auth,validate(updateUserSchema), userController.updateUserInfo);

module.exports=router;