import Expense  from "../models/Expense.js";

//add expense
export const addExpense = async (req, res) => {
    try {
        const {title, amount, category, date, notes} = req.body
        const expense = new Expense({
            title,
            amount,
            category,
            date,
            notes,
            userId: req.user.id     //come from JWT middlewares
        })
        await expense.save()
        res.status(201).json({message: "Expense added successfully", expenseId: expense._id})
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

//Get all expenses (user-specific)
export const getExpenses = async (req, res) => {
    try{
        const expenses= await Expense.find({userId: req.user.id})
        res.json({ expenses})      
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

//Update Expense
export const updateExpense =  async(req, res) => {
    try {
        const {expenseId} = req.params
        const updated = await Expense.findOneAndUpdate({_id: expenseId, userId: req.user.id}, req.body, {new: true})

        if(!updated){
            return res.status(404).json({message: "Expense not found"})
        }
        res.json({message: "Expense updated successfully"})
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}


//Delete expense
export const deleteExpense = async (req, res) => {
    try{
        const {expenseId} = req.params
        const deleted = await Expense.findOneAndDelete({_id: expenseId, userId: req.user.id})

        if(!deleted){
            return res.status(404).json({message: "Expense not found"})
        }
        res.json({message: "Expense deleted successfully"})
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}



//Get monthly summary
export const getMonthlySummary = async (req, res) => {
    try{
        const { month, year} = req.query

        if(!month || !year){
            return res.status(400).json({message: "Month and Year is required"})
        }

        //creating a date range for that month
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0, 23, 59, 59)

        const expenses = await Expense.find({
            userId: req.user.id,
            date: {$gte: startDate, $lte: endDate}
        })

        if(!expenses.length){
            return res.json({ totalSpent: 0, byCategory: []})
        }

        //calculate total expenses
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)

        const byCategory = expenses.reduce((acc, exp) => {
            const found = acc.find(item => item.category === exp.category)
            if(found){
                found.total += exp.amount
            }
            else{
                acc.push({ category: exp.category, total: exp.amount})
            }
            return acc
        }, [])
        res.json({totalSpent, byCategory})
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}



//Get expenses by category
export const getExpensesByCategory = async(req, res) => {
    try{
        const { category} = req.params

        if(!category) {
            return res.status(400).json({message: "Category is required"})
        }

        const expenses = await Expense.find({
            userId: req.user.id,
            category: category
        })

        res.json({expenses})
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}