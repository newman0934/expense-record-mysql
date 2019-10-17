const express = require("express");
const router = express.Router();
const Record = require("../models/record");
const categoryList = require("../models/recordList").results;

const { authenticated } = require("../config/auth");

router.get("/", authenticated, (req, res) => {
  const filterMonth = req.query.filterMonth || "";
  const filterCategory = req.query.filterCategory || "";

  const categoryChinese =
    categoryList[filterCategory] === undefined
      ? ""
      : categoryList[filterCategory]["chineseName"];

  // console.log(Record)
  // let sql = ''

  // if (filterMonth === '' && filterCategory === '') {
  //   sql = [{
  //     "$project": {
  //       "name": 1,
  //       "category": 1,
  //       "amount": 1,
  //       "date": 1,
  //       "merchant": 1,
  //       "userId": 1
  //     }
  //   }, {
  //     "$match": {
  //       userId: req.user._id
  //     }
  //   }]

  // } else if (filterMonth === '') {
  //   sql = [{
  //     "$project": {
  //       "name": 1,
  //       "category": 1,
  //       "amount": 1,
  //       "date": 1,
  //       "merchant": 1,
  //       "userId": 1
  //     }
  //   }, {
  //     "$match": {
  //       userId: req.user._id,
  //       category: filterCategory
  //     }
  //   }]

  // } else if (filterCategory === '') {
  //   sql = [{
  //     "$project": {
  //       "m": {
  //         "$month": "$date"
  //       },
  //       "name": 1,
  //       "category": 1,
  //       "amount": 1,
  //       "date": 1,
  //       "merchant": 1,
  //       "userId": 1
  //     }
  //   }, {
  //     "$match": {
  //       "m": Number(filterMonth),
  //       userId: req.user._id
  //     }
  //   }]

  // } else {
  //   sql = [{
  //     "$project": {
  //       "m": {
  //         "$month": "$date"
  //       },
  //       "name": 1,
  //       "category": 1,
  //       "amount": 1,
  //       "date": 1,
  //       "merchant": 1,
  //       "userId": 1
  //     }
  //   }, {
  //     "$match": {
  //       "m": Number(filterMonth),
  //       userId: req.user._id,
  //       category: filterCategory
  //     }
  //   }]
  // }

  // Record.aggregate(sql).exec((err, records) => {
  //   if (err) return console.error(err);
  //   let totalAmount = 0;
  //   records.map(record => {
  //     totalAmount += record.amount;
  //   });
  //   res.render("index", {
  //     records,
  //     totalAmount,
  //     filterCategory,
  //     filterMonth,
  //     categoryChinese
  //   });
  // });

  let userId = req.user._id;
  let querySelect = { userId };

  if (filterMonth === "" && filterCategory !== "") {
    querySelect = { userId, category: filterCategory };
  } else if (filterCategory === "" && filterMonth !== "") {
    querySelect = {
      userId,
      date: {
        $gte: new Date(`2019-${filterMonth}-01`),
        $lte: new Date(`2019-${filterMonth}-31`)
      }
    };
  } else if (filterCategory !== "" && filterMonth !== "") {
    querySelect = {
      userId,
      date: {
        $gte: new Date(`2019-${filterMonth}-01`),
        $lte: new Date(`2019-${filterMonth}-31`)
      },
      category: filterCategory
    };
  }

  Record.find(querySelect, (err, records) => {
    if (err) return console.error(err);

    let totalAmount = 0;
    records.map(record => {
      totalAmount += record.amount;
    });
    res.render("index", {
      records,
      totalAmount,
      filterCategory,
      filterMonth,
      categoryChinese
    });
  });
});

module.exports = router;
