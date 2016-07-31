
var map, db;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 3
  });

  jQuery.get('db.yaml', function(data) {
    db = jsyaml.load(data);

    db.forEach(col => {
      if (col.geoLocation) {
        var location =  col.geoLocation.split(',')
        var lat = parseFloat(location[0])
        var lng = parseFloat(location[1])

        new google.maps.Marker({
          position: {lat: lat, lng: lng},
          map: map,
          title: col.name
        });

        console.log("added "+col.name)
      }
    })
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
    });
  }

}

