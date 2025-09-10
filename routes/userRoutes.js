import express from 'express'
import { registerUser, loginUser, getLoggedInUser, updateUserProfile, forgotPassword, resetPassword } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", authMiddleware, getLoggedInUser)
router.put("/me", authMiddleware, updateUserProfile)

// forgot password routes
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router