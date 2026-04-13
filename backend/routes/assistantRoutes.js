const express =require ('express');
const router=express.Router();
const assistantController=require('../controllers/assistantController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/chat', auth, assistantController.chat);
router.post("/voice", auth,upload.single('audio'), assistantController.voiceChat);

module.exports = router;