import axios from 'axios'
import L from 'leaflet'
import router from '../../router'

export function buildGeoJsonLayer(lng, lat, geoJsonLayer) {
  axios.post('http://localhost:3000/masseurs/masseursByLocation', {
    type: "Point",
    coordinates: [lng, lat]
  }).then(res => {
    if(!res.data.error && res.data.cityBoundaries) {
      var coordinates = new Array;
      coordinates.push(res.data.cityBoundaries)
      if(res.data.masseursLocations) {
        res.data.masseursLocations.forEach(location => coordinates.push(location));
      } else {
        console.log("NO MASSEUR IN THE SPECIFIED CITY")
      }
      console.log(coordinates)
      const geoJson = L.geoJSON({
        type: "FeatureCollection",
        features: coordinates
      }, {
        pointToLayer: function(geoJsonPoint, latlng) {
          return L.marker(latlng).bindPopup(buildMarkerPopup(geoJsonPoint.properties));
        }
      });
      geoJsonLayer.addLayer(geoJson)
    } else {
      console.log("CITY NOT SUPPORTED")
    }
  })
}

function buildMarkerPopup(masseurProperties) {
  console.log(masseurProperties);
  const div1 = L.DomUtil.create('div', 'card');
  const img = L.DomUtil.create('img', 'card-img-top', div1);
  img.src = masseurProperties.profile_picture;
  img.setAttribute('alt', 'Profile image');
  const div2 = L.DomUtil.create('div', 'card-body d-flex flex-column', div1);
  const h5 = L.DomUtil.create('h6', 'card-title center', div2);
  h5.textContent = masseurProperties.brand_name;

  const button = L.DomUtil.create('a', 'btn btn-primary text-white', div2);
  button.textContent = 'View profile';
  L.DomEvent.on(button, 'click', () => {
    router.push("/masseurProfile");
  })
  return div1;
}
