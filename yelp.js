/* References
   -https://developers.google.com/maps/documentation/javascript/examples/marker-remove
   -https://en.wikipedia.org/wiki/Great-circle_distance#:~:text=The%20great%2Dcircle%20distance%2C%20orthodromic,line%20through%20the%20sphere's%20interior).
*/

var myLatLng,radius=0,map;
var markers=[];
function initialize () {
   initMap();
    
}

function sendRequest () {
   deleteMarkers();
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById('search').value);
   if(myLatLng!=undefined && radius!=undefined){
      var req = "proxy.php?term="+query+"&latitude="+myLatLng.lat+"&longitude="+myLatLng.lng+"&radius="+radius+"&limit=10";
      xhr.open("GET", req);
      xhr.setRequestHeader("Accept","application/json");
      xhr.onreadystatechange = function () {  
          if (this.readyState == 4) {
             var json = JSON.parse(this.responseText);
             var HTML = "<table class='ui selectable inverted table'><tr>";
             HTML += "<th class='center aligned'>Result</th><th class='center aligned'>Image</th><th class='center aligned'>Name</th><th class='center aligned'>Rating</th></tr>"
             for (let i=0;i<json.businesses.length;i++){
                if(json.businesses[i]!=undefined){
                  var currentBusiness = json.businesses[i];
                  var location = { lat: currentBusiness.coordinates.latitude, lng: currentBusiness.coordinates.longitude };
                  var title = currentBusiness.name;
                  var pos= (i+1).toString();
                  addMarker(location,title,pos);
                  HTML += '<tr style="text-align:center">';
                  HTML += "<td>"+(i+1).toString()+"</td>";
                  HTML += "<td><img class='ui centered small rounded image'  src='"+currentBusiness.image_url+"' alt='Not available'/> </td>";
                  HTML += "<td><a href='"+currentBusiness.url+"' target='_blank'>"+currentBusiness.name+"</a></td>";
                  HTML += "<td>"+currentBusiness.rating+"</td></tr>";

                }
             }
            HTML+="</table>"
            document.getElementById("output").innerHTML = HTML;
          }
      };
      xhr.send(null);
             
   }

}

function addMarker(location,title,pos) {
   const marker = new google.maps.Marker({
      position: location,
      map,
      title: title,
      label: pos,
    });
   markers.push(marker);
}
function showMarkers() {
   setMapOnAll(map);
 }

function initMap() {
   myLatLng = { lat: 32.75, lng: -97.13 };
   map = new google.maps.Map(document.getElementById("map"), {
     zoom: 16,
     center: myLatLng,
   });
   google.maps.event.addListener(map, 'idle', function(event) {
      var bounds = map.getBounds();
      newCenter = map.getCenter();
      myLatLng = { lat: newCenter.lat(), lng: newCenter.lng() };
      radius = findRadius(bounds);
      sendRequest();

  });
    google.maps.event.addListener(map, 'dragend', function(event) {
      var bounds = map.getBounds();
      newCenter = map.getCenter();
      myLatLng = { lat: newCenter.lat(), lng: newCenter.lng() };
      radius = findRadius(bounds);
      deleteMarkers();

  });
    
    
 }

 function CoordDistance(latitude1,  longitude1,  latitude2,  longitude2)
{
    return 6371 * Math.acos(
        Math.sin(latitude1) * Math.sin(latitude1)
        + Math.cos(latitude1) * Math.cos(latitude1) * Math.cos(longitude2 - longitude1));
}

function findRadius(bounds){ 
   
   var ne = bounds.getNorthEast();
   var sw = bounds.getSouthWest();
   radius = CoordDistance(ne.lat()/57.29577951,ne.lng()/57.29577951,sw.lat()/57.29577951,sw.lng()/57.29577951);
   radius /= 2;
   radius *= 1000;
   return Math.floor(radius);
}

function setMapOnAll(map) {
   for (let i = 0; i < markers.length; i++) {
     markers[i].setMap(map);
   }
 }

 function deleteMarkers() {
   setMapOnAll(null);
   markers = [];
 }