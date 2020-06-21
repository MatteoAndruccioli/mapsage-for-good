const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Masseur = require("../models/masseursModel")
const Municipality = require("../models/municipalitiesModel")
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
    const location = { // GeoJSON
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: JSON.parse(req.body.coordinates)
      },
      properties: {
        brand_name: req.body.brand_name,
  			profile_picture: profileImagePath
      }
    }
		const userData = {
			brand_name: req.body.brand_name,
			email: req.body.email,
			password: req.body.password,
			phone_number: req.body.phone_number,
			expertise: req.body.expertise,
			date: today,
			profile_picture: profileImagePath,
      location: location,
      advertisements: []
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
					Masseur.create(userData)
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

exports.readMasseurByJwt = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      Masseur.findOne({
        _id: decodedPayload._id
      }).then(user => {
        if(user) {
          var userData = {
            brand_name: user.brand_name,
            email: user.email,
						phone_number: user.phone_number,
						expertise: user.expertise,
            profile_picture: user.profile_picture,
            advertisements: user.advertisements,
            location: user.location.geometry.coordinates // GeoJSON
          }
          res.json(userData)
        } else {
          res.json({ error: 'Masseur does not exist' })
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

exports.readMasseurById = function(req, res) {
  // No JWT check because no need for authentication searching a masseur
  Masseur.findById(req.params.id, function(err, user) {
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
      Masseur.find({
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

exports.addAdvertisement = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      var newAdv = {
        title: req.body.advertisementTitle,
        body: req.body.advertisementBody
      }
      Masseur.findOneAndUpdate({_id: decodedPayload._id},
        {$push: {advertisements: newAdv}})
        .catch(err => {
          res.send({ error: err })
        });

      Masseur.findOne({
        _id: decodedPayload._id
      }).then(user => {
        if(user) {
          //console.log(user.advertisements)
          res.json({advertisements: user.advertisements})
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

exports.editMasseurInfo = async function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      var newAdv = {
        title: req.body.advertisementTitle,
        body: req.body.advertisementBody
      }

      Masseur.findOne({ _id: decodedPayload._id })
        .then(user => {
          if(user) {
            if(req.body.edit_brand_name != null && req.body.edit_brand_name != ""){
              user.brand_name = req.body.edit_brand_name
            }
            if(req.body.edit_phone_number != null && req.body.edit_phone_number != ""){
              user.phone_number = req.body.edit_phone_number
            }
            if(req.body.edit_expertise != null && req.body.edit_expertise != ""){
              user.expertise = req.body.edit_expertise
            }
            user.save(function(err,savedObj){
              // some error occurs during save
              if(err){
                res.send({ error: err })
              }
              // for some reason no saved obj return
              else if(!savedObj){
                res.send({ error: 'no user found' })
              }
              else {
                res.json({updatedUser: user})
              }
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

exports.editMasseurLocation = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      if (req.body.new_coordinates == null) {
        res.send({ error: 'no coordinates specified' })
        return;
      }
      Masseur.findOne({ _id: decodedPayload._id })
        .then(user => {
          if (user != null) {
            console.log(req.body.new_coordinates)
            user.location.geometry.coordinates = req.body.new_coordinates
            user.save(function(err, savedObj){
              if(err) { // some error occurs during save
                res.send({ error: err })
              } else if(!savedObj) {
                res.send({ error: 'no user found' })
              } else { // user updated correctly
                res.json({updatedUser: user})
              }
            })
          } else {
            res.send({ error: 'User does not exist' })
          }
        }).catch(err => {
          console.log("DIO SPORCO")
          res.send({ error: err })
        })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
