const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const saltrounds=10;
const User = require("../models/user");
//generate token 
const generateToken=(obj)=>{
  return jwt.sign(obj,'secretkey');
}

//signup
exports.postSignUp = (req, res) => {
  const { name, email, password } = req.body;
  if (name == "" || email == "" || password == "") {
    return res
      .status(400)
      .send({ msg: "Bad parameters. Enter all the input fields" });
  }
  bcrypt.hash(password, saltrounds, async (err, hash) => {
    // Store hash in your password DB.
    if (err) {
      console.log("bcrypt error :", err);
      return res.status(500).send({ msg: "Internal server error" });
    }
    try {
      const newUser = await User.create({
        name,
        email,
        password: hash,
      });
      res.status(200).send({ msg: "successfully  user registered" });
    } catch (error) {
      res.status(400).send({msg: "User already exits with this email"});
    }
  });
};
//login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == "") {
    return res.status(400) .send({ msg: "Bad parameters. Enter all the input fields" });
  }
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    console.log(user);
    if (!user) {
      return res.status(404).send({ msg: "user not found" });
    }else{
      bcrypt.compare(password,user.password,(err,result)=>{
        if(err){
          return res.status(500).send({msg:"Internal servser error"})
        }
        if(result==true){
          return res.status(200).send({msg:"login successfully",token:generateToken({
            userId:user.id,
            name:user.name
          })})
        }
        else{
          return res.status(401).send({msg:"Incorrect password"})
        }
      });
    } 
    
      }catch (error) {
    //console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
  }