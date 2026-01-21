const express =require ('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const auth=require('../middleware/auth');

router.post('/create', auth, expenseController.createExpense);
router.get('/getExpense/:id', auth, expenseController.getExpense);
router.get('/getExpenses', auth, expenseController.getExpenses);
router.put('/update/:id',auth,expenseController.updateExpense);
router.delete('/delete/:id',auth,expenseController.deleteExpense);

module.exports=router;
