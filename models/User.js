import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    lastLogin: {
        type: Date
    },
    monthlyIncome: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("User", userSchema)