const multer = require('multer')
var fs = require('fs')

/**
 * registerStorage allows to set multer options
 */
const registerStorage = multer.diskStorage({
  // Defines where to store images
	destination: function(req, file, cb){
    Customer.findOne({ email: req.body.email })
      .then(customer => {
        // check for user presence
        if (customer == null) {
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

const registerUpload = multer({storage: registerStorage}).single('profileImage')

exports.registerUpload = registerUpload
