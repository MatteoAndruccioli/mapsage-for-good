const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Masseur = require("../models/masseursModel")
const Municipality = require("../models/municipalitiesModel")
const fs = require('fs')
const base64Util = require('./utils/base64Util')

//masseur register request management
exports.handleRegisterRequest = function(req, res) {
  let profileImagePath;
  if (!req.body.profile_picture) {
    profileImagePath = process.env.SERVER_LOCATION + "/static/uploads/defaultImg.png"
  } else {
    profileImagePath = process.env.SERVER_LOCATION + "/static/uploads/" + req.body.email + "/profile_pic.png"
  }
  const today = new Date()
  const location = { // GeoJSON
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: req.body.coordinates
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
    advertisements: [],
    followers: [],
    notifications: []
  }

  // Need to perform "findOne" on both because there is a single login for both customers and masseurs
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
        Masseur.create(userData)
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
}

//gets logged masseur info
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
            followers: user.followers,
            notifications: user.notifications,
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

//gets info about masseur specified by id 
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
        var userData = {
          brand_name: user.brand_name,
          email: user.email,
          phone_number: user.phone_number,
          expertise: user.expertise,
          profile_picture: user.profile_picture,
          advertisements: user.advertisements,
          followers: user.followers,
          notifications: user.notifications,
          location: user.location.geometry.coordinates // GeoJSON
        }
        res.json(userData)
      }
    }
  })
}

//gets info about masseurs owning a study in a certain location
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
          const locations = masseursList.map(masseur => {
            return {
              geometry: masseur.location.geometry,
              type: masseur.location.type,
              properties: {
                brand_name: masseur.location.properties.brand_name,
                profile_picture: masseur.location.properties.profile_picture,
                masseur_id: masseur._id  // Added - required for masseur profile visualization from search map
              }
            }
          });
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

//updates masseur info
exports.editMasseurInfo = async function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

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

//updates location of masseur's study 
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
          res.send({ error: err })
        })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
