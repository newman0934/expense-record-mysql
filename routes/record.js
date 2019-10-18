const express = require("express");
const router = express.Router();
const {
  authenticated
} = require("../config/auth")

const db = require("../models")
const User = db.User
const Record = db.Record


router.get("/", authenticated, (req, res) => {
  return res.redirect("/");
});

// 新增一筆 record 頁面
router.get("/new", authenticated, (req, res) => {
  res.render("new");
});

// 新增一筆  record
router.post('/', authenticated, (req, res) => {
  const { name, date, category, amount, merchant } = req.body

  let errors = []
  if (!name || !date || !category || !amount) {
    errors.push({ message: '＊欄位為必填欄位！' })
  }
  if (isNaN(amount)) {
    errors.push({ message: `金額必須是數字` })
  }

  if (errors.length > 0) {
    res.render('new', {
      errors,
      name,
      date,
      merchant,
      category,
      amount
    })
  } else {
    Record.create({
      name,
      date,
      merchant,
      category,
      amount,
      UserId: req.user.id
    })
      .then((record) => { return res.redirect('/') })
      .catch((error) => { return res.status(422).json(error) })
  }
})

// 修改 record 頁面
router.get("/:id/edit", authenticated, (req, res) => {
  User.findByPk(req.user.id)
  .then((user) => {
    if (!user) throw new Error("user not found")
    return Record.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      }
    })
  })
  .then((record) => { return res.render('edit', { record }) })  
});
// 修改 record
router.put("/:id", authenticated, (req, res) => {
  Record.findOne({
    where: {
      id: req.params.id,
      UserId: req.user.id,
    }
  })
  .then((records) => {
    records.name = req.body.name
    records.date = req.body.date
    records.merchant = req.body.merchant
    records.category = req.body.category
    records.amount = req.body.amount

    return records.save()
  })
  .then((records) => { return res.redirect(`/`)  })
  .catch((error) => { return res.status(422).json(error) })
});
// 刪除 record
router.delete("/:id/delete", authenticated, (req, res) => {
  User.findByPk(req.user.id)
  .then((user) => {
    if (!user) throw new Error("user not found")

    return Record.destroy({
      where: {
        UserId: req.user.id,
        id: req.params.id
      }
    })
  })
  .then((record) => { return res.redirect('/') })
  .catch((error) => { return res.status(422).json(error) })
});

module.exports = router;