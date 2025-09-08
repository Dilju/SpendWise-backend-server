import express from 'express'

import { addExpense, getExpenses, updateExpense, deleteExpense, getMonthlySummary, getExpensesByCategory } from '../controllers/expenseController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'


const router = express.Router()

router.post("/", authMiddleware, addExpense)
router.get("/", authMiddleware, getExpenses)
router.put("/:expenseId", authMiddleware, updateExpense)
router.delete("/:expenseId", authMiddleware, deleteExpense)

router.get("/summary", authMiddleware, getMonthlySummary)
router.get("/category/:category", authMiddleware, getExpensesByCategory)

export default router