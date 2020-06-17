const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/usersModel")
const Municipality = require("../models/municipalitiesModel")
const multer = require('multer')
var fs = require('fs')

/**
 * registerStorage allows to set multer options
 */
const registerStorage = multer.diskStorage({
  // Defines where to store images
	destination: function(req, file, cb){
    User.findOne({ email: req.body.email })
      .then(customer => {
        // check for user presence
        if (customer == null) {
          let destinationDir = './public/uploads/' + req.body.email + '/'
          // check for destinationDir presence
          if(!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir)
						// Need to save destinationDir value in req.body.folderPath so that
	          // it's possible to take it when the user will be created and set in db
	          req.body.folderPath = 'static/uploads/' + req.body.email + '/'
          } else {
            cb(new Error("User already exists"))
          }

          cb(null, destinationDir) //cb(error?, path where to save images)
      } else {
          cb(new Error("User already exists"))
      }
    }).catch(err => {
      cb(new Error("mongodb error: "+ err))
    })
	},
  // Defines images names
	filename: function(req, file, cb){
    // Need to save file.originalname in req.body.imageName so that it's possible
    // to take it when the user will be created and set in db
    req.body.imageName = file.originalname
		cb(null, file.originalname)
	},
})

const registerUpload = multer({storage: registerStorage}).single('profileImage')

exports.handleRegisterRequest = function(req, res) {
  registerUpload(req, res, function (err) {
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
		if (req.body.profileImage) { // If attribute "profileImage" is still present in req.body, no image was specified by the masseur
			profileImagePath = process.env.SERVER_LOCATION + "static/uploads/defaultImg.png"
		} else {
			// If attribute "profileImage" is no more present in req.body, it's beacause it has been consumed by multer
			// so an image was specified by the user
			// req.body.folderPath and req.body.imageName are set by "registerStorage"
			profileImagePath = process.env.SERVER_LOCATION + req.body.folderPath + req.body.imageName
		}
    const today = new Date()
    var userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      date: today,
      profile_type: req.body.profile_type,
      profile_picture: profileImagePath
    };
    if (req.body.profile_type == "Masseur") {
      userData.location = req.body.location // GeoJSON
      // Aggiungere campi all'occorrenza
    }
    //console.log(userData)

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash
            User.create(userData)
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
                res.send({ profile_type: user.profile_type })
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
  User.findOne({
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
          res.send({ profile_type: user.profile_type })
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

exports.readUserByJwt = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      User.findOne({
        _id: decodedPayload._id
      }).then(user => {
        if(user) {
          var userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_type: user.profile_type,
            profile_picture: user.profile_picture
          };
          if (req.body.profile_type == "Masseur") {
            userData.location = user.location // GeoJSON
            // Aggiungere campi all'occorrenza
          }
          res.json(userData)
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

exports.readUserById = function(req, res) {
  // No JWT check because no need for authentication searching a masseur
  User.findById(req.params.id, function(err, user) {
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

exports.readMasseursByLocation = function(req, res) {
  // No JWT check because no need for authentication searching a masseur
  const type = req.body.type;
  const coordinates = req.body.coordinates;
  Municipality.findOne({
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: type,
          coordinates: coordinates
        }
      }
    }
  }).then(municipality => {
    if (municipality != null) {
      User.find({
        "location.geometry": { // Only masseurs have location.geometry attribute
          $geoWithin: {
            $geometry: municipality.geometry
          }
        }
      }).then(masseursList => {
        if (masseursList != null && masseursList.length > 0) {
          const locations = masseursList.map(masseur => masseur.location);
          res.json({
            cityBoundaries: municipality,
            masseursLocations: locations
          })
        } else {
          res.json({
            cityBoundaries: municipality
          })
        }
      }).catch(err => { res.json({ error: err}) })
    } else {
      res.json({ error: 'No municipalities found' })
    }
  }).catch(err => { res.json({ error: err}) })
}
