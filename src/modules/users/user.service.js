import { Decrypt, Encrypt } from "../../common/security/encrypt.js"
import { CompareHash, Hash } from "../../common/security/hash.js";
import { create, findOne } from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken"
 import {OAuth2Client} from "google-auth-library"
 const client = new OAuth2Client();


export const signUp =async(req,res,next)=>{
    const {fName ,lName,email,password,age,gender,phone}=req.body

    const emailExists= await findOne({
        model:userModel,
       filter : {email: email.toLowerCase()}
    })

    if(emailExists){
       throw new Error("email already exists",{cause:500})
    }
    
    const   user =await create({
        model:userModel,
        data:{fName ,lName,email, password:await Hash(password),age,gender,phone:Encrypt(phone)}
    })

    return res.status(201).json({message:"done",user},)
}


export const signUpWithGmail =async(req,res,next)=>{
    const {idToken}=req.body 
  


  const ticket = await client.verifyIdToken({
      idToken,
      audience: "801797547169-10fc4u7ru1hcb141vfkgj3qmqjdjrqnf.apps.googleusercontent.com",  
  });
  const {picture,family_name,given_name,email_verified,email} = ticket.getPayload();
   let user= await findOne({
        model:userModel,
        filter:{email: email.toLowerCase()}
    })
    if(!user){
      user= await create({
        model:userModel,
        data:{
            fName:given_name ,
            lName:family_name ,
            email:email,
            profileImage:picture,
            isConfirmed:email_verified,
            provider:"google"  
        }
    })
    }
    const access_token=jwt.sign({id:user._id,email:user.email},"omar",{
        expiresIn:"2 days"
    })

    const refresh_token=jwt.sign({id:user._id,email:user.email},"omar")

    return res.status(200).json({message:"done",tokens:{access_token,refresh_token}})
}


export const signIn =async(req,res,next)=>{

    const {email,password}=req.body

    const user= await findOne({
        model:userModel,
        filter:{email: email.toLowerCase()}
    })
    if(!user){
       throw new Error ("email not exists , signIn first",{cause:500})
    }
    
    if(!await CompareHash(password,user.password)){
          throw new Error ("Invalid password",{cause:500})
    }
    
    const access_token=jwt.sign({id:user._id,email:user.email},"omar",{
        expiresIn:"2 days",
        audience:"http://localhost:4000",
        issuer:"http://localhost:3000",
        noTimestamp:true
    })

    const refresh_token=jwt.sign({id:user._id,email:user.email},"omar")




    return res.status(200).json({message:"done",tokens:{access_token,refresh_token}})
}


export const getProfile =async(req,res,next)=>{

    const {token}=req.body

    if (!token){

        throw new Error("token not exist ",{cause:400})
    }
    const verify =jwt.verify(token,"omar")

    const user= await findOne({
        model:userModel,
        filter:{
            email: verify.email.toLowerCase()
        }
    })
    if(!user){
       throw new Error ("email not exists , signIn first",{cause:500})
    }
    
    
    
    return res.status(200).json({message:"done",user})

}


