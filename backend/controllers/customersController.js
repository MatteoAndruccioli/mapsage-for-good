const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Customer = require("../models/customersModel")
const fs = require('fs')
const base64Util = require('./utils/base64Util')

//register request management
exports.handleRegisterRequest = function(req, res) {
  let profileImagePath;
  if (!req.body.profile_picture) {
    profileImagePath = process.env.SERVER_LOCATION + "/static/uploads/defaultImg.png"
  } else {
    profileImagePath = process.env.SERVER_LOCATION + "/static/uploads/" + req.body.email + "/profile_pic.png"
  }
  const today = new Date()
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    date: today,
    profile_picture: profileImagePath,
    notifications: []
  }
  //Need to perform "findOne" on both because there is a single login for both customers and masseurs
  Promise.all([
    Customer.findOne({ email: req.body.email }),
    Masseur.findOne({ email: req.body.email })
  ]).then(([customer, masseur]) => {
    if (customer == null && masseur == null) {
      if (req.body.profile_picture) {
        const destinationDir = './public/uploads/' + req.body.email
        const base64Data = base64Util.decodeBase64Image(req.body.profile_picture);
        if(!fs.existsSync(destinationDir)) {
          fs.mkdirSync(destinationDir)
        }
        fs.writeFile(destinationDir + "/profile_pic.png", base64Data.data, (err) => {
          if (err) console.log("error: " + err)
        })
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        userData.password = hash
        Customer.create(userData)
          .then(user => {
            const payload = { _id: user._id }
            // JWT generation
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 30 * 86400}) //expiresIn expressed in seconds
            const cookieConfig = {
              httpOnly: true,
              maxAge: 30 * 86400 * 1000, // 30 days cookie
              signed: true
            }
            res.cookie('jwt', token, cookieConfig)
            res.send({ _id: user._id })
          }).catch(err => {
            res.json({ error: err })
          })
      })
    } else {
      res.json({ error: 'User already exists' })
    }
  }).catch(err => { res.json({ error: "error performing search of user with specified email"}) })
}

//retrieves logged user info
exports.readCustomerByJwt = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      Customer.findOne({
        _id: decodedPayload._id
      }).then(user => {
        if(user) {
          var userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_picture: user.profile_picture,
            notifications: user.notifications
          };
          res.json(userData)
        } else {
          res.json({ error: 'Customer does not exist' })
        }
      }).catch(err => {
        res.json({ error: err })
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
