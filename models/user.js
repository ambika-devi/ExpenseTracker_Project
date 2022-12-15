const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        unique:true,
        allowNull:false
    },
    name:{
           type:Sequelize.STRING,
           allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    orderId: {
        type:Sequelize.STRING,
      },
      isPremium:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      }
    }
);   
module.exports=User;