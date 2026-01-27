const express =require ('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const auth=require('../middleware/auth');

const validate = require("../middleware/validateMiddleware");
const {
  createExpenseSchema,
  updateExpenseSchema,
  deleteAndGetExpenseSchema,
} = require("../validators/expenseValidator");

router.post(
  "/create",
  auth,
  validate(createExpenseSchema),
  expenseController.createExpense,
);
router.get(
  "/getExpense/:id",
  auth,
  validate(deleteAndGetExpenseSchema),
  expenseController.getExpense,
);
router.get('/getExpenses', auth, expenseController.getExpenses);
router.put('/update/:id',auth,validate(updateExpenseSchema),expenseController.updateExpense);
router.delete(
  "/delete/:id",
  auth,
  validate(deleteAndGetExpenseSchema),
  expenseController.deleteExpense,
);

module.exports=router;
