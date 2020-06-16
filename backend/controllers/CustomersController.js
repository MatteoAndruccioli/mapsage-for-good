const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/CustomerModel")

process.env.SECRET_KEY = 'secret'

const multer = require('multer')
var fs = require('fs');

//-------------------------------------------------------------
/**
 * registerStorage permette di settare le opzioni di multer
 * - destination  => determina dove verranno memorizzate le immagini
 * - filename     => determina il nome delle immagini    
 */
const registerStorage = multer.diskStorage({
	//dice dove andrai a memorizzare i file
	destination: function(req, file, cb){
    //devo controllare se già esiste l'utente, nel caso non posso procedere
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) { //non esiste un utente con quella mail => posso procedere
       
        //rotta univoca poichè email univoca
        let dir = './uploads/'+req.body.email+'/'
        //salvo il valore di tale percorso in folderPath così che 
        //possa esser recuperato in fase di creazione dell'utente e impostato nel db
        req.body.folderPath = dir
        
        //dal momento che non esiste un utente con quel nome non 
        //dovrebbe nemmeno esistere una cartella a suo nome ma se 
        //esistesse devo tirare errore
        if(!fs.existsSync(dir)) {
          //se la cartella non esisteva tutto ok continuo
          fs.mkdirSync(dir)
        } else {
          //la cartella non avrebbe dovuto esistere ma esisteva 
          //comunico l'errore
          //questa situazione non si dovrebbe mai verificare 
          cb(new Error("Non esistono utenti con quel nome ma esiste una cartella con quel nome => name indicato non disponibile"))
        }
        
        //funzione di callback: cb(errore, path dove devono essere salvati i file) 
        //tutto bene: non do nessun errore
        cb(null, dir)
      } else {
          //l'utente esiste quindi non devo salvarmi il file scateno un errore
          cb(new Error("L'utente esiste già"))
      }
    }).catch(err => { 
      cb(new Error("Errore nell'interrogazione del di Mongodb User: "+ err))
    })
	},

	filename: function(req, file, cb){
    //imposto il nome dell'immagine in modo da poterlo recuperare
    //se non avrò errori
    req.body.imageName = file.originalname
		cb(null, file.originalname)
	},
})

const registerUpload = multer({storage: registerStorage}).single('profileImage')

exports.registerUpload = registerUpload

//--------------------------------------------------------------

//effettua la registrazione del client
exports.handleRegisterRequest = function(req, res) {
  //chiamo il middleware per il salvataggio dell'immagine 
  //chiamandolo da qua dentro posso gestire gli errori
  registerUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("errore interno di multer")
      res.json({ error: err, type: 'errore di multer' })
      return
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("errore creato da me " + err )
      res.json({ error: ""+err, type: 'creato da me' })
      return
    } 
    //è andato tutto bene 

  const today = new Date()
  const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today,
      //req.body.folderPath + req.body.imageName vengono settati da registerStorage
      profile_picture_path: req.body.folderPath + req.body.imageName
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
     
    })
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
          res.json({user: setPropicFields(user)}) //controlla se funziona!!!
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

//prende un oggetto json utente contenente un campo profile_picture_path
//restituisce lo stesso oggetto json con due valori (folderToRet, imgToRet)
//che permettono di raggiungere piu facilmente l'immagine profilo
setPropicFields = function(user){
  let path = user.profile_picture_path
  if(path != null && path!=""){
    //arr = Array('.', 'uploads', 'mail', 'fotoprofilo')
    let arr = user.profile_picture_path.split("/")
    user.folderToRet = arr[2]
    user.imgToRet = arr[3]

    console.log("dovrebbe stampare cartella-nomeimmagine: " 
      + user.folderToRet + " " + user.imgToRet)
  }
  return {
    first_name: user.first_name, 
    last_name: user.last_name, 
    email: user.email,
    folder: user.folderToRet,
    imgName: user.imgToRet
  }
} 
