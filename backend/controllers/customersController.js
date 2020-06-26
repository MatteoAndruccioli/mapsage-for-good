const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Customer = require("../models/customersModel")
const multer = require('multer')
var fs = require('fs')
const multerUtil = require("./utils/multerUtil")

exports.handleRegisterRequest = function(req, res) {
  multerUtil.registerUpload(req, res, function (err) {
		// If a 'profile_picture' is specified it is redirected to functions specified in "registerStorage"
    // that make some checks and eventually store the user profile pic. If no 'profile_picture' is
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
		if (req.body.profile_picture) { // If attribute "profile_picture" is still present in req.body, no image was specified by the masseur
			profileImagePath = process.env.SERVER_LOCATION + "static/uploads/defaultImg.png"
		} else {
			// If attribute "profile_picture" is no more present in req.body, it's beacause it has been consumed by multer
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
      profile_picture: profileImagePath,
      followed: [],
      notifications: []
    }
    //console.log(userData)

    // Need to perform "findOne" on both because there is a single login for both customers and masseurs
    Promise.all([
			Customer.findOne({ email: req.body.email }),
			Masseur.findOne({ email: req.body.email })
		]).then(([customer, masseur]) => {
      if (customer == null && masseur == null) {
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
    }).catch(err => { res.json({ error: err}) })
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
          var userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_picture: user.profile_picture,
            followed: user.followed,
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

exports.readCustomerById = function(req, res) {
  // No JWT check because no need for authentication searching a masseur
  Customer.findById(req.params.id, function(err, user) {
    if (err) {
      res.send({ error: err })
    } else {
      if (user == null) {
        res.status(404).send({
          error: 'Masseur does not exist'
        })
      } else {
        res.json(user)
      }
    }
  })
}
