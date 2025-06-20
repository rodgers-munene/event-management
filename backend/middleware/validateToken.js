const jwt = require('jsonwebtoken')

const validateToken = async (req, res, next) => {
    try {
        let token;
        const bearerHeader = req.headers.Authorization || req.headers.authorization 

        if(bearerHeader && bearerHeader.startsWith('Bearer')){
            token = bearerHeader.split(" ")[1]

            // verify the token
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err){
                    res.status(401)
                    throw new Error("Invalid Token")
                }

                req.user = decoded.user
                next()
            })
        }

        if(!token){
            res.status(401)
            throw new Error("Missing Token")
        }
    } catch (error) {
        res.status(500);
        throw new Error("Token validation failed!!")
        
    } 

}

module.exports = validateToken