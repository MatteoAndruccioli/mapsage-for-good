const jwt = require("jsonwebtoken")
const Masseur = require("../models/masseursModel")
const Municipality = require("../models/municipalitiesModel")

exports.handleRegisterRequest = function(req, res) {
  // TODO
}

exports.handleLoginRequest = function(req, res) {
  // TODO
}

exports.readMasseurByJwt = function(req, res) {
  // TODO
}

exports.readMasseurById = function(req, res) {
  // No JWT check because no need for authentication searching a masseur
  Masseur.findById(req.params.id, function(err, user) {
    if (err) {
      res.send({ error: err })
    } else {
      if (user == null) {
        res.status(404).send({
          error: 'Masseur does not exist'
        })
      } else {
        res.json(user)
      }
    }
  })
}

exports.readMasseursByLocation = function(req, res) {
  // No JWT check because no need for authentication searching a masseur
  const type = req.body.type;
  const coordinates = req.body.coordinates;
  Municipality.findOne({
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: type,
          coordinates: coordinates
        }
      }
    }
  }).then(municipality => {
    if (municipality != null) {
      Masseur.find({
        "location.geometry": {
          $geoWithin: {
            $geometry: municipality.geometry
          }
        }
      }).then(masseursList => {
        if (masseursList != null && masseursList.length > 0) {
          const locations = masseursList.map(masseur => masseur.location);
          res.json({
            cityBoundaries: municipality,
            masseursLocations: locations
          })
        } else {
          res.json({
            cityBoundaries: municipality
          })
        }
      }).catch(err => { res.json({ error: err}) })
    } else {
      res.json({ error: 'No municipalities found' })
    }
  }).catch(err => { res.json({ error: err}) })
}
