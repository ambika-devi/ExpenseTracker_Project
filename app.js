const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const razorPayRoute=require('./routes/razorPay')
const premiumRoute=require('./routes/premium');
const User=require('./models/user');
const Expenses=require('./models/expense');
const { send } = require('process');
const sequelize=require('./util/database');
const app=express();
app.use(cors());
app.use(bodyparser.json());
app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/razorPay',razorPayRoute);
app.use('/premiumUser',premiumRoute);
app.use((req,res)=>{
    console.log(req.url);
    res.send("This is my Expense Tracker Project");
})
//ONE TO MANY RELATION
User.hasMany(Expenses);
Expenses.belongsTo(User);
sequelize.sync().then(()=>{
    app.listen(5000);
}).catch((error)=>{
    console.log("sequelize is failed");
    console.log(error);
})