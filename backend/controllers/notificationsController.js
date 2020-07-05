const jwt = require("jsonwebtoken")
const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")
const userUtil = require("./utils/usersUtil")

//set user's notification visualized=true
exports.setVisualized = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      //check user's type (masseur or customer)
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){
          //if user's a masseur query on Masseur otherwise on Customer
          const schema = promise.type == "customer" ? Customer : Masseur
          schema.findOneAndUpdate(
            { "_id": decodedPayload._id, "notifications._id": req.body.notification_id},
            {$set: {"notifications.$.visualized": true}},
            {new: true},
            (err, updatedUser) => {
              if (err) {
                res.json({error: "error setting notification visualized"})
              }
              res.json({ succeeded: true })
            })
        } else {
          res.json({error: "user not found"})
        }
      }).catch(err => {
        res.json({error: "error discovering user's type"})
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}

//get a set of N notification objects
exports.getNotificationSet = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      const nReturnedNotification = 5 //maximum number of notification returned
      const startIndex = 1*req.query.firstElement
      const lastIndex =  1*req.query.firstElement + (nReturnedNotification - 1)
      //check whether user is a masseur or customer
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){
          const schema = promise.type == "customer" ? Customer : Masseur
          schema
            .findOne({ "_id": decodedPayload._id})
              .then(user => {
                if(user != null){
                  const notifications = user.notifications.reverse().slice(startIndex,lastIndex).map(not => {
                    return {
                      notification_id: not._id,
                      masseur_id: not.masseur_id,
                      masseur_brand: not.masseur_brand,
                      advertisement_title: not.advertisement_title,
                      visualized: not.visualized
                    }
                  })
                  res.json({notifications: notifications })
                } else {
                  res.json({error: "errore nel recuperare l'utente per le notifiche"})
                }
              }).catch(err => {
                res.json({error: "errore nel recuperare l'utente per le notifiche"})
              })

        } else {
          res.json({error: "user not found"})
        }
      }).catch(err => {
        res.json({error: "error discovering user's type"})
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
