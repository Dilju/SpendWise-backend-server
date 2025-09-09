import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'

//load envirnment variables
dotenv.config();

//conncect mongodb
connectDB();

//initialize express
const app = express();

//creating middle wares
const allowedOrigins = [
  "http://localhost:3000", // local frontend
  "http://localhost:5173", // vite dev server
  "https://spend-wise-frontend-client.vercel.app", // production vercel
  /\.vercel\.app$/ // allow all vercel preview URLs
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests without origin
    if (
      allowedOrigins.includes(origin) ||
      (typeof origin === "string" && /\.vercel\.app$/.test(origin))
    ) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation"), false);
  },
  credentials: true
}));

app.use(express.json())     //parse json bodies




//routes
app.use("/auth", userRoutes)
app.use("/api/expenses", expenseRoutes)




//test route
app.get('/', (req, res) => {
    res.send("Expense tracker API is running...")
})

//start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running at the port number ${PORT}`);
    
})