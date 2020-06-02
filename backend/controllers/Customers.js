const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/Customer")

process.env.SECRET_KEY = 'secret'

//effettua la registrazione del client
exports.handleRegisterRequest = function(req, res) {
  const today = new Date()
  const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today
  }

  User.findOne({
      email: req.body.email
  })
      .then(user => {
          //non ci deve essere un utente con quella mail
          if (!user) {
              console.log("Register - password: ", req.body.password)
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                  //hash contiene la password hashata, la riassegnamo all'oggetto
                  userData.password = hash
                  User.create(userData) //questo lo butta nel db
                      .then(user => {
                          res.json({ status: user.email + ' registered' })
                      })
                      .catch(err => {
                          res.send('error: ' + err)
                      })
              })
          } else {
              res.json({ error: 'User already exists' })
          }
      })
      .catch(err => {
          res.send('error: ' + err)
      })
}

//effettua il login del client
exports.handleLoginRequest = function(req, res) {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
        if (user) {
            console.log("Register - password: ", req.body.password)
            if (bcrypt.compareSync(req.body.password, user.password)) {
                //match trovato => in payload sto tirando su le info dal db
                const payload = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
                //generiamo il token che usiamo nel frontend
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send({accessToken: token})
            } else {
                res.json({ error: 'User does not exist' })
            }
        } else {
            res.json({ error: 'User does not exist' })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
}

//restituisce il client ma non serve perchè avendo il jwt gia lo sai
exports.getClientData = function(req, res) {
  /**
     * decodifica le authorization option che vengono dal frontend
     * 
     * in pratica il frontend mi invia un token e io qua lo decodifico 
     */
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    //vado a tirar su l'utente con quell'id
    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if(user) {
                //invio l'oggetto tirato su al frontend
                res.json(user)
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
}