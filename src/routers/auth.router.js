import { Router } from "express";
import jwt from "jsonwebtoken";


const router= Router();

router.post("/login", (req, res)=>{
    console.log(req.body);
    
    const {email,password} = req.body;

    if(email=="elm@gmail.com" && password=="123456"){
        const payload = {email};
        const expiration = {expiresIn: "1h"};
        const token = jwt.sign(payload,process.env.JWT_secret,expiration);
        res.json(token);
    }else{
        res.status(401).send(); //401  no esta autorizado

    }
    
    
    
    
    //res.json(req.body);

})




export default router;

