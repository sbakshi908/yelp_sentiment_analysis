function readFilterData() {

  d3.csv("static/data/Vancouver_pizza.csv", function (data) {
    //console.log(data);
    fetchData(data)
  });
}

function fetchData(data) {
  var businessList = []

  var businessObj = [];

  //console.log('in fetch data')
  for (var i = 0; i < data.length; i++) {

    if (!(businessList.includes(data[i].business_id))) {
      var dObj = {}
      var dataLst = []

      const lat = data[i].latitude;
      const long = data[i].longitude;
      const name = data[i].business_name;
      const id = data[i].business_id;
      const city = data[i].city;
      const rating = data[i].stars


      dataLst.push(lat);
      dataLst.push(long);
      dataLst.push(name);
      dataLst.push(city);
      dataLst.push(rating);

      dObj[id] = dataLst
      businessObj.push(dObj)

      businessList.push(data[i].business_id);
    }

  };
  showMap(businessObj, businessList)

}


function showMap(businessObj, businessList) {
  var bObj = businessObj[0]
  var bID = businessList[0]
  //console.log(bID)
  inr = bObj[bID]
  var cntrLat = parseFloat(inr[0])
  var cntrLong = parseFloat(inr[1])
  console.log(cntrLat + "   " + cntrLong)

  d3.select('map').html("");
  var container = L.DomUtil.get('map');
  if (container != null) {
    container._leaflet_id = null;
  }

  // Create a map object
  var myMap = L.map("map", {
    center: [cntrLat, cntrLong],
    zoom: 12
  });

  // Add a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
 // console.log('In map file')
  //console.log(businessObj)
  for (var i = 0; i < businessObj.length; i++) {
    var bObj = businessObj[i]
    var bID = businessList[i]
    //console.log(bID)
    inrLst = bObj[bID]
    var lat = parseFloat(inrLst[0])
    var long = parseFloat(inrLst[1])
    var bName = inrLst[2]
    var city = inrLst[3]
    var rating = parseFloat(inrLst[4])
    //console.log(lat)
    //console.log(long)
    L.marker([lat, long])
      .bindPopup("<h2>" + bName + "</h2> <hr> <h3> " + city + "</h3> Rating: " + rating + "</h3>")
      .addTo(myMap);
  }
}