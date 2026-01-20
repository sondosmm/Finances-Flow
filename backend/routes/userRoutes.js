const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController');
const auth=require('../middleware/auth');

router.get('/me',auth,userController.getUserInfo);
router.put('/update', auth, userController.updateUserInfo);

module.exports=router;