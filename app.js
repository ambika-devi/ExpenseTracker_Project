

const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const app=express();
const dotenv=require('dotenv');
dotenv.config();

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const razorPayRoute=require('./routes/razorPay')
const premiumRoute=require('./routes/premium');
const forgotPassRoute=require('./routes/forgotPass');
const User=require('./models/user');
const Expenses=require('./models/expense');
const ResetPass = require("./models/resetPassword");
const FileLink = require("./models/file-link");
const { send } = require('process');
const sequelize=require('./util/database');

app.use(cors());
app.use(bodyparser.json());
app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/razorPay',razorPayRoute);
app.use('/premiumUser',premiumRoute);
app.use('/forgotPass',forgotPassRoute);
app.use((req,res)=>{
    console.log(req.url);
    res.send("This is my Expense Tracker Project");
})
//ONE TO MANY RELATION
User.hasMany(Expenses);
Expenses.belongsTo(User);
//one to many
User.hasMany(ResetPass);
ResetPass.belongsTo(User);
//one to many
User.hasMany(FileLink);
FileLink.belongsTo(User);
sequelize.sync().then(()=>{
    app.listen(5000);
}).catch((error)=>{
    console.log("sequelize is failed");
    console.log(error);
})