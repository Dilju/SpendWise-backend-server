import crypto from 'crypto'
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        //check if user is already exist or not
        const existingUser = await User.findOne({ email})
        if(existingUser){
            return res.status(400).json({message: "User aleready exists"})
        }

        //hash the password
        const hashedPassword =  await bcrypt.hash(password, 10);

        //create new user
        const newUser = await User.create({name, email, password: hashedPassword})

        //generate token for the user
        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id, 
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
            },
            token
        })
    }
    catch(error){
        res.status(500).json({message: "Server error", error})
    }
}



// controllers/userController.js
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Update last login in DB
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getLoggedInUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.json(user)

    } catch (error){
        res.status(500).json({message: "Server error", error})
    } 
}

export const updateUserProfile = async (req, res) => {
    try{
        const {name, monthlyIncome} = req.body
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        // update only if provided
        if (name) user.name = name
        if (monthlyIncome) user.monthlyIncome = monthlyIncome

        await user.save()

        res.json({
            message: "Profile updated successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                monthlyIncome: user.monthlyIncome
            }
        })
    } catch(error){
        res.status(500).json({message: "Server error", error})
    }
}

// forgot password (Generate reset token)
export const forgotPassword = async(req, res) => {
    try{
        const {email} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({message: "User not found with this email"})
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex")

        // hash and save to DB
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000 //15mins
        await user.save()

        // reset url (goes to front end reset-url page)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        // nodeMailer transport
        const transporter = nodemailer.createTransport({
            // host: process.env.EMAIL_HOST,
            // port: process.env.EMAIL_PORT,
            service: "gmail",
            // secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        //email options
        const mailOptions = {
            from: `"SpendWise App" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <p>Hello ${user.name || "User"},</p>
                <p>You requested to reset your password. Click the link below:</p>
                <a href="${resetUrl} target="_blank">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
            `,
        } 

        // send email
        await transporter.sendMail(mailOptions)

        // todo: send resetUrl via email service (nodemailer)
        res.json({
            message: "Password Reset link sent to your email",
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error", error})
    }
}


// Reset password
export const resetPassword = async(req, res) => {
    try{
        const {token} = req.params
        const {password} = req.body

        // hash incoming token and match with DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {$gt:Date.now()}
        })

        if(!user){
            return res.status(404).json({message: "Invalid or expired token"})
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // save new password and clear reset fields
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        res.json({message: "Password reset successfull. You can log in now."})
    }
    catch(error){
        res.status(500).json({message: "Server error", error})
    }
}

