const jwt = require("jsonwebtoken")
const Masseur = require("../models/masseursModel")
const userUtil = require("./utils/usersUtil")

//logged user starts following masseur specified by id
exports.follow = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      //check user with specified id exists and follow him
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){
          Masseur.findOneAndUpdate(
            {_id: req.body.masseur_id},
            {$addToSet: {followers: {follower_id: decodedPayload._id, follower_type: promise.type}}},
            {new: true},   
            function(err, user) {
              if (err) {
                res.status(500).json({error: "error in customer search"  })
              } else {
                if (user == null) {
                  res.status(404).json({error:"follow failed user not found"})
                } else {
                  res.sendStatus(204)
                }
              }
            }) 
        } else {
          res.status(404).json({error: "user not found"})
        }
      }).catch(err => {
        res.status(500).json({error: "error discovering user's type"})
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}

//logged user stops following masseur specified by id
exports.unfollow = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      //check user with specified id exists and unfollow him
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){
          Masseur.findOneAndUpdate(
            {_id: req.body.masseur_id},
            {$pull: {followers: {follower_id: decodedPayload._id, follower_type: promise.type}}},
            {new: true},
            function(err, user) {
              if (err) {
                res.status(500).json({error: "error in customer search"})
              } else {
                if (user == null) {
                  res.status(404).json({error: "unfollow failed user not found" })
                } else {
                  res.sendStatus(204)
                }
              }
            }
          )
        } else {
          res.status(404).json({error: "user not found"})
        }
      }).catch(err => {
        res.status(500).json({error: "error discovering user's type"})
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
