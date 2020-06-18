const multer = require('multer')
var fs = require('fs')
const Customer = require("../../models/customersModel")
const Masseur = require("../../models/masseursModel")
/**
 * registerStorage allows to set multer options
 */
const registerStorage = multer.diskStorage({
  // Defines where to store images
	destination: function(req, file, cb){
		// Need to perform "findOne" on both because there is a single login for both customers and masseurs
		Promise.all([
			Customer.findOne({ email: req.body.email }),
			Masseur.findOne({ email: req.body.email })
		]).then(([customer, masseur]) => {
			if (customer == null && masseur == null) {
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

const registerUpload = multer({storage: registerStorage}).single('profile_picture')

exports.registerUpload = registerUpload
