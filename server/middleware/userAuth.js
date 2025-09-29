import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Unauthorized, no token"});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode){
            req.userId = tokenDecode.id;
        }else{
            return res.json({success: false, message: "Unauthorized, invalid token"});
        }

        next();
        
    } catch (error) {
        res.json({success: false, message: "Unauthorized, invalid token"});
    }
 }

 export default userAuth;