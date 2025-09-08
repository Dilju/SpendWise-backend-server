import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    
    if(!token){
        return res.status(401).json({message: "No Token, authorization denied"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded      //decoded contains user id
        next()
    }
    catch(error){
        res.status(401).json({message: "Invalid Token"})
    }
}