const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/CustomerModel")

process.env.SECRET_KEY = 'secret'

//effettua la registrazione del client
exports.handleRegisterRequest = function(req, res) {
  const today = new Date()
  const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today,
      profile_picture: req.body.profile_picture
  }

  User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) { //non ci deve essere un utente con quella mail
          bcrypt.hash(req.body.password, 10, (err, hash) => { //hash contiene la password hashata, la riassegnamo all'oggetto
            userData.password = hash
            User.create(userData) //creo un nuovo utente con i dati passati
                .then(user => {
                  const payload = { _id: user._id }
                  //generiamo il token che usiamo nel frontend
                  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 30 * 86400}) //expiresIn expressed in secodns
                  const cookieConfig = {
                    httpOnly: true,
                    maxAge: 30 * 86400 * 1000, // 30 days cookie
                    signed: true
                  }
                  res.cookie('jwt', token, cookieConfig)
                  res.send('set cookie')
                }).catch(err => {
                  res.json({ error: err })
                })
            })
        } else {
            res.json({ error: 'User already exists' })
        }
      }).catch(err => { res.json({ error: err}) })
}

//effettua il login del client
exports.handleLoginRequest = function(req, res) {
  User.findOne({
    email: req.body.email
  }).then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = { _id: user._id }
          //generiamo il token che usiamo nel frontend
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440})
          const cookieConfig = {
            httpOnly: true,
            maxAge: 30 * 86400 * 1000, // 30 days cookie
            signed: true
          }
          res.cookie('jwt', token, cookieConfig)
          res.send('set cookie')
        } else {
          console.log("wrong password")
          res.json({ error: 'Wrong password' })
        }
      } else {
        console.log("User does not exist")
        res.json({ error: 'User does not exist' })
      }
  }).catch(err => {
    res.send('error: ' + err)
  })
}

exports.getCustomer = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      User.findOne({
        _id: decodedPayload._id
      }).then(user => {
        if(user) {
          res.json(user)
        } else {
          res.send({ error: 'User does not exist' })
        }
      }).catch(err => {
        res.send({ error: err })
      })
    } catch (error) {
      // The JWT is not valid - verify method failed
      res.sendStatus(401);
    }
  } else {
    // No JWT specified
    res.sendStatus(401);
  }
}
