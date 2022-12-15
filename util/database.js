const Sequelize=require('sequelize');
const sequelize=new Sequelize('expensetracker-project','root','ambika284devi',{
    dialect:'mysql',
    host:'localhost'
})
module.exports=sequelize;