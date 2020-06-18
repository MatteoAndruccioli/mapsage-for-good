const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")

exports.handleLoginRequest = function(req, res) {
  Promise.all([
    Customer.findOne({ email: req.body.email }),
    Masseur.findOne({ email: req.body.email })
  ]).then(([customer, masseur]) => {
    var user;
    var user_type;
    if (customer != null) {
      user = customer
      user_type = "Customer"
    } else if (masseur != null) {
      user = masseur
      user_type = "Masseur"
    }

    if (user != null) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const payload = { _id: user._id }
        // JWT generation
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440})
        const cookieConfig = {
          httpOnly: true,
          maxAge: 30 * 86400 * 1000, // 30 days cookie
          signed: true
        }
        res.cookie('jwt', token, cookieConfig)
        res.json({ profile_type: user_type })
      } else {
        console.log("wrong password")
        res.json({ error: 'Wrong password' })
      }
    } else {
      console.log("User does not exist")
      res.json({ error: 'User does not exist' })
    }
  }).catch(err => {
    res.json({ error: err })
  })
}
