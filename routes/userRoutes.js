import express from 'express'
import { registerUser, loginUser, getLoggedInUser, updateUserProfile } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", authMiddleware, getLoggedInUser)
router.put("/me", authMiddleware, updateUserProfile)

export default router