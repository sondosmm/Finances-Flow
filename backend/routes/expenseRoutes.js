const express =require ('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const auth=require('../middleware/auth');

router.post('/expenses', auth, expenseController.createExpense);
router.get('/expenses/:id', auth, expenseController.getExpense);
router.get('/expenses', auth, expenseController.getExpenses);
router.put('/expenses/:id',auth,expenseController.updateExpense);
router.delete('/expenses/:id',auth,expenseController.deleteExpense);

module.exports=router;
