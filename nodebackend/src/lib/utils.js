import jwt from 'jsonwebtoken';
export const generateToken = (userId , res)=>{

    const token = jwt.sign({userId} , process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    res.cookie("jwt" , token,{
        httpOnly: true,
        sameSite:'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    })
    console.log("Token generated and cookie set:", token);

    return token;
}