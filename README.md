# SpendWise – Backend (Express + MongoDB)

This is the backend of **SpendWise – Personal Expense Tracker**, built using **Node.js, Express.js, and MongoDB Atlas**.  
It provides RESTful APIs for user authentication, expense management, reporting, and password reset (via Nodemailer).  

---

## 🚀 Features
- JWT-based user authentication & authorization  
- CRUD operations for managing expenses  
- Secure password hashing using bcrypt  
- Forgot password & email reset with **Nodemailer**  
- MongoDB Atlas integration for cloud database  
- Deployed on **Render**  

---

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB Atlas (Mongoose)**
- **JWT (Authentication)**
- **Nodemailer (Password reset emails)**
- **CORS**

---

## ⚙️ Environment Variables
Create a `.env` file in the root of the `server` folder with the following:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password-or-app-password
FRONTEND_URL=front-end link from vercel


## 📂 Project Setup  
cd server
npm install
node server.js



### Clone the repository  
```bash
git clone https://github.com/Dilju/SpendWise-backend-server
cd spendwise
