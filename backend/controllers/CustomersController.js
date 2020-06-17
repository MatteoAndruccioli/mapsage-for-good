const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Customer = require("../models/customersModel")
const multer = require('multer')
var fs = require('fs')
const multerUtil = require("./utils/multerUtil")

exports.handleRegisterRequest = function(req, res) {
  multerUtil.registerUpload(req, res, function (err) {
    // If a 'profileImage' is specified it is redirected to functions specified in "registerStorage"
    // that make some checks and eventually store the user profile pic. If no 'profileImage' is
		// specified, there won't be any redirection.
		// If an error occurs it will be catched in the following if-else statements.
    if (err instanceof multer.MulterError) {
      res.json({ error: err, type: 'multer upload error' })
      return;
    } else if (err) {
      res.json({ error: err, type: 'unknown upload error' })
      return;
    }

		var profileImagePath;
		if (req.body.profileImage) { // If attribute "profileImage" is still present in req.body, no image was specified by the user
			profileImagePath = process.env.SERVER_LOCATION + "static/uploads/defaultImg.png"
		} else {
			// If attribute "profileImage" is no more present in req.body, it's beacause it has been consumed by multer
			// so an image was specified by the user
			// req.body.folderPath and req.body.imageName are set by "registerStorage"
			profileImagePath = process.env.SERVER_LOCATION + req.body.folderPath + req.body.imageName
		}
    const today = new Date()
    const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      date: today,
      profile_picture: profileImagePath
    }

    Customer.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash
            Customer.create(userData)
              .then(user => {
                const payload = { _id: user._id }
                // JWT generation
                const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 30 * 86400}) //expiresIn expressed in secodns
                const cookieConfig = {
                  httpOnly: true,
                  maxAge: 30 * 86400 * 1000, // 30 days cookie
                  signed: true
                }
                res.cookie('jwt', token, cookieConfig)
                res.send('set cookie')
              }).catch(err => {
                res.json({ error: err })
              })
          })
        } else {
          res.json({ error: 'User already exists' })
        }
      }).catch(err => { res.json({ error: err}) })
  })
}

exports.handleLoginRequest = function(req, res) {
  Customer.findOne({
    email: req.body.email
  }).then(user => {
      if (user) {
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
          res.send('set cookie')
        } else {
          console.log("wrong password")
          res.json({ error: 'Wrong password' })
        }
      } else {
        console.log("User does not exist")
        res.json({ error: 'User does not exist' })
      }
  }).catch(err => {
    res.send('error: ' + err)
  })
}

exports.readCustomerByJwt = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      Customer.findOne({
        _id: decodedPayload._id
      }).then(user => {
        if(user) {
          res.json({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              profile_picture: user.profile_picture
            })
        } else {
          res.send({ error: 'User does not exist' })
        }
      }).catch(err => {
        res.send({ error: err })
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}

exports.readCustomerById = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      jwt.verify(token, process.env.SECRET_KEY);
      Customer.findById(req.params.id, function(err, user) {
        if (err) {
          res.send({ error: err })
        } else {
          if (user == null) {
            res.status(404).send({
              error: 'User does not exist'
            })
          } else {
            res.json(user)
          }
        }
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
