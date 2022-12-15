const express = require("express");
const router = express.Router();
const userMiddleware=require("../middleware/authenticate");
const expenseController = require("../controllers/expense");

router.post("/addexpense",userMiddleware.userAuthenticate, expenseController.postAddExpense);
router.get("/getExpense",userMiddleware.userAuthenticate, expenseController.getAllExpenses);
router.delete("/deleteExpense/:id",userMiddleware.userAuthenticate, expenseController.deleteExpense);

module.exports = router;