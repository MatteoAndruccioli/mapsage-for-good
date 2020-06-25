const Customer = require("../../models/customersModel")
const Masseur = require("../../models/masseursModel")

//returns user when succedes in order to support both getChatIdByUsersId and getChatInfoByUsersId
//check if there is a user (masseur or customer) with specified id
userWithIdExists = function(userID) {
  return new Promise((resolve, reject) => {
    Masseur.findById(userID, function(err, user) {
      if (err) {
        reject({ succeeded: false, error: err, description: "error in masseur search" })
      } else {
        if (user == null) {
          //user is not a masseur but he could be a customer
          Customer.findById(userID, function(err1, user1) {
            if (err1) {
              reject({ succeeded: false, error: err1, description: "error in customer search"  })
            } else {
              if (user1 == null) {
                //user is not masseur nor customer
                reject({ succeeded: false, description: "user_id doesn't match any entry"  })
              } else {
                //user is a customer
                resolve({ succeeded: true, type: "customer", user: user1 })
              }
            }
          })
        } else {
          //user is a masseur
          resolve({ succeeded: true, type: "masseur", user: user})
        }
      }
    })
  })
}

exports.userWithIdExists = userWithIdExists