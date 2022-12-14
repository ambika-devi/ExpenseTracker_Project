const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const  AWS=require('aws-sdk');
const Expense = require("../models/expense");
const FileLink = require("../models/file-link");
//const NUMBER_OF_EXPENSES_PER_PAGE=10;

const uploadToS3 = (fileData, fileName) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: "expensetrackerbucket", // bucket name
    Key: fileName, // file name
    Body: fileData, //file content
    ACL: "public-read", //who can access
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (S3Err, S3Result) => {
      if (S3Err) {
        reject(S3Err);
      }
      // console.log(`File uploaded successfully at ${S3Result.Location}`);
      resolve(S3Result.Location);
    });
  });
};

exports.getIsPremium = async (req, res) => {
  try {
    const response = req.user.isPremium;
    // console.log(response);
    res.status(200).send({ isPremium: response });
  } catch (error) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  const page=+req.query.page;
  const NUMBER_OF_EXPENSES_PER_PAGE = +req.query.paginate || 5;
  // console.log("userId>>>>>", userId);
  try {
    const { count, rows: expense } = await Expense.findAndCountAll({
      
      attributes: ["amount", "description", "category"],
      where: { userId: { [Op.ne]: userId } },
      limit: NUMBER_OF_EXPENSES_PER_PAGE,
      offset: (page - 1) * NUMBER_OF_EXPENSES_PER_PAGE,
    });
    const pagination = {
      currentPage: page,
      hasNextPage: count - page * NUMBER_OF_EXPENSES_PER_PAGE > 0,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / NUMBER_OF_EXPENSES_PER_PAGE),
    };

    res.status(200).send({ expenses: expense, pagination, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
}
exports.getGenerateReport = async (req, res) => {
  if (!req.user.isPremium) {
    return res.status(400).send({ msg: "Only for Premiumm users" });
  }
  try {
    const expenses = await req.user.getExpenses();
    // console.log(expenses);
    const fileData = JSON.stringify(expenses); //always stringify the data to add to file
    const fileName = `expense${req.user.id}/${new Date()}.txt`;
    const S3Result = await uploadToS3(fileData, fileName);
    //only works when there is promise involved, not on function
    // console.log(S3Result);//gives the file url
    await req.user.createFileLink({ fileURL: S3Result });
    res
      .status(200)
      .send({ reportLink: S3Result, msg: "file upload successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};