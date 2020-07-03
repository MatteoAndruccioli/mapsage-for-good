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


      //prima di tutto devo capire se l'utente è un masseur o un customer
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
                res.json({succeeded: false, description: "error setting notification visualized",  error: "error creating notification"})
              }
              res.json({ succeeded: true })
            })


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


//get a set of N notification objects
exports.getNotificationSet = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      const nReturnedNotification = 5
      const startIndex = 1*req.query.firstElement
      const lastIndex =  1*req.query.firstElement + (nReturnedNotification - 1)

      //prima di tutto devo capire se l'utente è un masseur o un customer
      userUtil.userWithIdExists(decodedPayload._id).then(promise => {
        if(promise != null && promise.type != null && ["customer", "masseur"].includes(promise.type)){


          //if user's a masseur query on Masseur otherwise on Customer
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

                  res.json({ succeeded: true, notifications: notifications })
                } else {
                  res.json({ succeeded: false, description: "errore nel recuperare l'utente per le notifiche", error: "errore nel recuperare l'utente per le notifiche"})
                }
              }).catch(err => {
                res.json({ succeeded: false, description: "errore nel recuperare l'utente per le notifiche", error: err})
              })

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
