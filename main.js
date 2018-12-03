
var map, db, currentInfoWindow;

function addSocial(url, prefix, icon, title) {
  if (!url)
    return ""

  return '<a href="'+prefix+url+'" target="_blank"><i class="fa fa-'+icon+'" title="'+title+'" aria-hidden="true"></i></a>'
}

function addCore(active, icon, title) {
  if (typeof active === 'string') {
    return '<a href="'+active+'" target="_blank"><i class="fa fa-'+icon+'" title="'+title+'" aria-hidden="true"></i></a>'

  } else if (active) {
    return '<i class="fa fa-'+icon+'" title="'+title+'" aria-hidden="true"></i>'

  } else {
    return '<i class="fa fa-'+icon+' inactive" title="'+title+'" aria-hidden="true"></i>'
  }
}

function addProp(prop, title) {
  if (prop) {
    return '<li>'+title+': '+prop+'</li>'
  } else {
    return ''
  }
}

function initMarker(col) {
  var location =  col.geoLocation.split(',')
  var lat = parseFloat(location[0])
  var lng = parseFloat(location[1])

  return new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: map,
    title: col.name
  });
}

function initInfoWindow(col) {
  infoTxt = "<div>"

  // name
  infoTxt += "<h2>"+col.name+"</h2>"

  infoTxt += "<ul class='info'>"
  if (col.address) {infoTxt += '<li>'+col.address+'</li>'}
  if (col.established) {infoTxt += '<li>Established: '+col.established+'</li>'}
  infoTxt += "</ul>"

  if (col.games) {
    infoTxt += "<ul class='games'>"
    col.games.forEach(game => infoTxt += '<li>'+game+'</li>')
    infoTxt += "</ul>"
  }

  // cores
  infoTxt += "<p>"
  infoTxt += addCore(col.coworking, 'desktop', "Offers co-working")
  infoTxt += addCore(col.events, 'calendar', "Offers open events")
  infoTxt += ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '

  // social
  infoTxt += addSocial(col.website, '', 'globe', 'Website')
  infoTxt += addSocial(col.facebook, 'http://facebook.com/', 'facebook', 'Facebook')
  infoTxt += addSocial(col.twitter, 'http://twitter.com/', 'twitter', 'Twitter')
  infoTxt += addSocial(col.instagram, 'http://instagram.com/', 'instagram', 'Instagram')
  infoTxt += addSocial(col.email, 'mailto:', 'envelope', 'E-mail collective')
  infoTxt += "</p>"

  infoTxt += "</div>"

  return new google.maps.InfoWindow({content: infoTxt});
}

function initMap() {
  var mapOptions = {
    center: {lat: 52.50369, lng: 13.41956},
    zoom: 3,
    minZoom: 2,
    maxZoom: 20,
    // https://snazzymaps.com/style/1/pale-dawn
    styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}],
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  jQuery.get('db.yaml', function(data) {
    db = jsyaml.load(data);

    db.forEach(col => {
      if (!col.geoLocation)
        return;

      var marker = initMarker(col);

      marker.addListener('click', function() {
        if (currentInfoWindow) {currentInfoWindow.close()}

        var infowindow = initInfoWindow(col);
        currentInfoWindow = infowindow;
        infowindow.open(map, marker);
      });

      lines = [
        `<tr>`,
        `<td class=name><a href=${col.website}>${col.name}</a></td>`,
        `<td>${col.coworking ? "yes" : ""}</td>`,
        `<td>${col.established ? col.established : ""}</td>`,

        `<td>${addSocial(col.website, '', 'globe', 'Website')}</td>`,
        `<td>${addSocial(col.facebook, 'http://facebook.com/', 'facebook', 'Facebook')}</td>`,
        `<td>${addSocial(col.twitter, 'http://twitter.com/', 'twitter', 'Twitter')}</td>`,
        `<td>${addSocial(col.instagram, 'http://instagram.com/', 'instagram', 'Instagram')}</td>`,

        `</tr>`
      ]
      
      $("table").append(lines.join())
    })
  });

  map.addListener('click', function() {
    if (currentInfoWindow) {currentInfoWindow.close()}
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
    });
  }

}
