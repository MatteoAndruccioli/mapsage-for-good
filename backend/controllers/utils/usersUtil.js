const Customer = require("../../models/customersModel")
const Masseur = require("../../models/masseursModel")

//check if there is a user (masseur or customer) with specified id, on success returns user
userWithIdExists = function(userID) {
  return new Promise((resolve, reject) => {
    //check if user is a masseur
    Masseur.findById(userID, function(err, user) {
      if (err) {
        reject({error: "error in masseur search"})
      } else {
        if (user == null) {
          //user is not a masseur, check if user is a customer
          Customer.findById(userID, function(err1, user1) {
            if (err1) {
              reject({error: "error in customer search"})
            } else {
              if (user1 == null) {
                reject({error: "user_id doesn't match any entry"})
              } else {
                resolve({type: "customer", user: user1})
              }
            }
          })
        } else {
          resolve({type: "masseur", user: user})
        }
      }
    })
  })
}

exports.userWithIdExists = userWithIdExists