const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")
const userUtil = require("../controllers/utils/usersUtil")

//notifies follower (userID == follower_id) about advertisement published by masseur (userID == masseur_id)
notifyFollower = function(follower_id, follower_type, advertisement_title, masseur_id, masseur_brand){
  const schema = follower_type == "customer" ? Customer : Masseur
  return new Promise((resolve, reject) => {
    schema.findOneAndUpdate(
      {_id: follower_id},
      {$push: {notifications: {
        masseur_id: masseur_id,
        masseur_brand: masseur_brand,
        advertisement_title: advertisement_title,
        visualized: false
      }}},
      {new: true},
      (err, updatedUser) => {
        if (err) {
          reject({error: "error creating notification"})
        }
        resolve({ newNotification: updatedUser.notifications[updatedUser.notifications.length-1], follower_id: follower_id })
      })
  })
}

//adds an advertisement to db and notifies all follower of masseur who published the advertisement
exports.addAdvertisement = function(advertisement_title, advertisement_body, masseur_id){
  return new Promise((resolve, reject) => {
    var newAdv = {
      title: advertisement_title,
      body: advertisement_body
    }
    Masseur.findOneAndUpdate({_id: masseur_id},
      {$addToSet: {advertisements: newAdv}},
      {new: true},
      (err, updatedUser) => {
        if (err) {
          reject({error: "error handling adding advertisement"})
          return
        }
        if (updatedUser.followers.length > 0){
          //array containing promises of notification jobs
          let notificationPromises = []
          var i;
          for (i = 0; i < updatedUser.followers.length; i++) {
            notificationPromises.push(notifyFollower(
              updatedUser.followers[i].follower_id, 
              updatedUser.followers[i].follower_type, 
              newAdv.title, 
              updatedUser._id, 
              updatedUser.brand_name
            ));
          }
          Promise.allSettled(notificationPromises).then(results => {
            let notificationInfoToRet = []
            results.forEach((result) => {
              if(result.status == "fulfilled"){
                notificationInfoToRet.push(result.value)
              }
            })
            resolve({notifications: notificationInfoToRet})
            return
          }).catch(err => {
            reject({error: "error handling notification promises"})
          })
        } else {
          resolve({notifications: [] })
        }
      })
      .catch(err => {
        reject({error: "error handling adding advertisement"})
      })
  })
}