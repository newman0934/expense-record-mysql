const express = require("express");
const router = express.Router();
const categoryList = require("../models/recordList").results;
const Sequelize = require("sequelize");
const db = require("../models");
const User = db.User;
const Record = db.Record;
const Op = Sequelize.Op;
const { authenticated } = require("../config/auth");

router.get("/", authenticated, (req, res) => {
  const filterMonth = req.query.filterMonth || "";
  const filterCategory = req.query.filterCategory || "";

  const categoryChinese =
    categoryList[filterCategory] === undefined
      ? ""
      : categoryList[filterCategory]["chineseName"];

  let userId = req.user.id;
  let querySelect = { where: { userId } };

  if (filterMonth === "" && filterCategory !== "") {
    querySelect = {
      where: {
        userId,
        [Op.like]: filterCategory
      }
    };
  } else if (filterCategory === "" && filterMonth !== "") {
    querySelect = {
      where: {
        userId,
        date: {
          [Op.gte]: new Date(`2019-${filterMonth}-01`),
          [Op.lte]: new Date(`2019-${filterMonth}-31`)
        }
      }
    };
  } else if (filterCategory !== "" && filterMonth !== "") {
    querySelect = {
      where: {
        userId,
        [Op.like]: filterCategory,
        date: {
          [Op.gte]: new Date(`2019-${filterMonth}-01`),
          [Op.lte]: new Date(`2019-${filterMonth}-31`)
        }
      }
    };
  }

  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("user not found");
      return Record.findAll(querySelect);
    })
    .then(records => {
      let totalAmount = 0;
      records.map(record => {
        totalAmount += record.amount;
      });

      return res.render("index", {
        records,
        totalAmount,
        filterCategory,
        filterMonth,
        categoryChinese
      });
    });
});

module.exports = router;
