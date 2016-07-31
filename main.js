
var map, db;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 3
  });

  jQuery.get('db.yaml', function(data) {
    db = jsyaml.load(data);

    db.forEach(col => {
      if (col.latitude) {
        new google.maps.Marker({
          position: {lat: col.latitude, lng: col.longitude},
          map: map,
          title: col.name
        });

        console.log("added "+col.name)
      }
    })
  });

}

