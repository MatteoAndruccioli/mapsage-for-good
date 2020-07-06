import axios from 'axios'
import L from 'leaflet'
import router from '../../router'

export function buildGeoJsonLayer(lng, lat, geoJsonLayer) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:3000/masseurs/masseursByLocation', {
      type: "Point",
      coordinates: [lng, lat]
    }).then(res => {
      if(!res.data.error && res.data.cityBoundaries) {
        var boundariesColor = "#17a2b8"
        var masseursFound = false
        var coordinates = new Array
        coordinates.push(res.data.cityBoundaries)
        if(res.data.masseursLocations) {
          res.data.masseursLocations.forEach(location => coordinates.push(location));
          masseursFound = true
        } else {
          alert("Sorry! No masseurs in the specified city")
          boundariesColor = "#FF2249"
          masseursFound = false
        }
        const geoJson = L.geoJSON({
          type: "FeatureCollection",
          features: coordinates
        }, {
          onEachFeature: function(feature, layer) {
            if (feature.geometry.type == "MultiPolygon" && !masseursFound) {
              layer.bindPopup("There are no masseurs here, look elsewhere!", { closeButton: false });
            } else if (feature.geometry.type == "Point") {
              layer.bindPopup(buildMarkerPopup(feature.properties), { closeButton: false });
            }
          },
          style: function() {
            return {
              color: boundariesColor,
              weight: 0.8
            }
          }
        });
        geoJsonLayer.addLayer(geoJson)
        resolve()
      } else {
        reject("Not supported city")
      }
    }).catch(err => {
      reject(err.response.data.error)
    })
  })
}

function buildMarkerPopup(masseurProperties) {
  const div1 = L.DomUtil.create('div', 'card');
  div1.setAttribute('style', 'width: 18em; background-color: #f5f5f5;')
  const img = L.DomUtil.create('img', 'card-img-top', div1);
  img.src = masseurProperties.profile_picture;
  img.setAttribute('alt', 'Profile image');
  const div2 = L.DomUtil.create('div', 'card-body', div1);
  const h5 = L.DomUtil.create('h6', 'card-title', div2);
  h5.setAttribute('style', 'color: #7B7B7B;')
  h5.textContent = masseurProperties.brand_name;

  const button = L.DomUtil.create('a', 'btn btn-outline-info', div2);
  button.textContent = 'View profile';
  L.DomEvent.on(button, 'click', () => {
    router.push("/masseurProfile/" + masseurProperties.masseur_id);
  })
  return div1;
}
