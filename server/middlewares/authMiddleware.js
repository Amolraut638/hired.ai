import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    // Handle both "Bearer <token>" and plain "<token>"
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        req.user = { _id: decoded.userId } // for problemController
        next();
    } catch (error) {  
        return res.status(401).json({message: 'Unauthorized'});
    }
}

export default protect;