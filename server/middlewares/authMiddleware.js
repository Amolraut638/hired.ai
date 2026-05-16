import jwt from 'jsonwebtoken';


const protect = async (req, res, next) => {
    const token  = req.headers.authorization; //whenever the user is logged in we send the headers and in headers we send the authorization property where we will add the token 
    if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId // we extract the userId from the decoded and it will added in the request
        next();  // execute our controller function
    } catch (error) {  
        return res.status(401).json({message: 'Unauthorized'});
    }
}

export default protect 