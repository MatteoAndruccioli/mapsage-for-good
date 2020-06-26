const jwt = require("jsonwebtoken")
const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")
const userUtil = require("./utils/usersUtil")

// current user starts following masseur specified by id
exports.follow = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);


      //prima di tutto devo capire se l'utente è un masseur o un customer
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){

          //if user's a masseur query on Masseur otherwise on Customer
          const schema = promise.type == "customer" ? Customer : Masseur

          Promise.all([
            Masseur.findOneAndUpdate(
              {_id: req.body.masseur_id},
              {$addToSet: {followers: {follower_id: decodedPayload._id, follower_type: promise.type}}},
              {new: true}),

            schema.findOneAndUpdate(
              {_id: decodedPayload._id},
              {$addToSet: {followed: req.body.masseur_id}},
              {new: true})
            ]).then(([masseur, user]) => {
              if (masseur != null && user != null) {
                res.json({ description:"ok" })
              } else {
                res.json({ succeeded: false, error:"follow failed", description: "follow failed" })
              }
            }).catch(err => { res.json({succeeded: false, error: err, description: "error while updating masseur's followers and user's followed"}) })

        } else {
          res.json({succeeded: false, description: "user not found", error: "user not found"})
        }
      }).catch(err => {
        res.json({succeeded: false, description: "error discovering user's type", error: err})
      })

    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}

//current user stops following masseur
exports.unfollow = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);


      //prima di tutto devo capire se l'utente è un masseur o un customer
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){

          //if user's a masseur query on Masseur otherwise on Customer
          const schema = promise.type == "customer" ? Customer : Masseur

          Promise.all([
            Masseur.findOneAndUpdate(
              {_id: req.body.masseur_id},
              {$pull: {followers: {follower_id: decodedPayload._id, follower_type: promise.type}}},
              {new: true}),

            schema.findOneAndUpdate(
              {_id: decodedPayload._id},
              {$pull: {followed: req.body.masseur_id}},
              {new: true})
          ]).then(([masseur, user]) => {
            if (masseur != null && user != null) {
              res.json({ succeeded: true, masseur: masseur, user: user })
            } else {
              res.json({ succeeded: false, description: "unfollow failed",  error: "unfollow failed" })
            }
          }).catch(err => { res.json({succeeded: false, error: err, description: "error while updating masseur's followers and user's followed"}) })


        } else {
          res.json({succeeded: false, description: "user not found", error: "user not found"})
        }
      }).catch(err => {
        res.json({succeeded: false, description: "error discovering user's type", error: err})
      })

    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
