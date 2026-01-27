const express = require('express');
const router = express.Router();

const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const authController=require('../controllers/authController');
const auth=require('../middleware/auth');

router.post('/register', validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post('/logout',auth,authController.logout);

module.exports=router;