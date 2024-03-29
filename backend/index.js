var path = require('path');
var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var cookieParser = require("cookie-parser")
var port = process.env.PORT || 3000
var chatUtil = require('./utils/chatUtil')
var notificationUtil = require('./utils/notificationUtil')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var http = require('http').Server(app);
var io = require('socket.io')(http);

process.env.SERVER_LOCATION = 'http://localhost:' + port;
process.env.SECRET_KEY = 'EWl9Lcrav8'; // secret for JWT
app.use(cookieParser('ztVX2HQJP0')); // secret for cokieParser
app.use(bodyParser.json({limit: '50mb', extended: true},))
app.use(cors({ origin: 'http://localhost:8080', credentials: true }))
app.use(bodyParser.urlencoded({ extended: false }))

const mongoURI = 'mongodb://localhost:27017/mapsage'
mongoose
    .connect(
      mongoURI, 
      {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
    ).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

// APIs registration
var usersRoutes = require("./routes/usersRoutes")
var customersRoutes = require("./routes/customersRoutes")
var masseursRoutes = require("./routes/masseursRoutes")
var chatsRoutes = require("./routes/chatsRoutes")
var followersRoutes = require("./routes/followersRoutes")
var notificationsRoutes = require("./routes/notificationsRoutes")
usersRoutes(app)
customersRoutes(app)
masseursRoutes(app)
chatsRoutes(app)
followersRoutes(app)
notificationsRoutes(app)

//Real time functionalities
io.on('connection', function(socket) {
  console.log('user connected');
  //disconnection management
  socket.on('disconnect', function() {
      console.log('user disconnected');
  });
  //istant messaging management
  socket.on("message", (msg) => {
    const receiver_id = msg.receiver_id
    chatUtil.addNewMsg(msg.chat_id, msg.sender, msg.receiver, msg.payload)
      .then(insertion => {
        if(!insertion.error){
    			io.emit("message_"+msg.sender, msg)
    			io.emit("message_"+msg.receiver, msg)
        } else {
    			io.emit("message_"+msg.sender, { error: insertion.error })
    		}
      }).catch(err => {
        io.emit("message_"+msg.sender, { error: "error adding new message" })
      })
  })
  //advertisement and notification management
  socket.on("advertisement", (msg) => {
    notificationUtil.addAdvertisement(msg.advertisement_title, msg.advertisement_body, msg.masseur_id)
      .then(promise => {
        if(!promise.error){
          io.emit("new_advertisement_" + msg.masseur_id, {
            title: msg.advertisement_title,
            body: msg.advertisement_body
          })
          if(promise.notifications.length > 0){
            var i;
            for (i = 0; i < promise.notifications.length; i++) {
              io.emit("notification_" + promise.notifications[i].follower_id, {
                masseur_id: promise.notifications[i].newNotification.masseur_id,
                masseur_brand: promise.notifications[i].newNotification.masseur_brand,
                advertisement_title: promise.notifications[i].newNotification.advertisement_title,
                visualized: false,
                notification_id: promise.notifications[i].newNotification._id,
              })
            }
          }
        } else {
    			io.emit("new_advertisement_" + msg.masseur_id, { error: promise.error })
    		}
      }).catch(err => {
        io.emit("new_advertisement_" + msg.masseur_id, { error: err })
      })
  })
});

app.use('/static', express.static(__dirname + '/public'));
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + " not found"})
});
http.listen(port, function () {
    console.log("Server is running on port: " + port)
})
