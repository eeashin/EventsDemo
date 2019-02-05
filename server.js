const express = require('express');
const yargs = require('yargs');
const events = require('./events/events');
const location = require('./location/location');
const weather = require('./weather/weather');
const transport = require('./transport/transport');
const request = require('request');
const parseJson = require('parse-json');


var counter = 0;
var jsonOutput;
var currentLatt, currentLong;
var app = express();
var output="";

request({
  url: `http://ip-api.com/json`,
  json: true
}, (error, response, responseBody) => {
  if (error) {
    console.log('Unable to connect to Google servers.');
  } else {
    currentLatt = responseBody.lat;
    currentLong = responseBody.lon;
  }
});

app.get('/eventdetails', (req, res) => {
  let mainOutput = {};
  events.allevents("Helsinki", async (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(results.helsinkievents.length);
    let locationArray = await location.getLocation(results.helsinkievents);
    let weatherArray = await weather.fetchWeather(locationArray);
    let transportArray = await transport.fetchTransport(locationArray,currentLatt,currentLong);


    console.log("Fetching data..");

    for (var i = 0; i < results.helsinkievents.length; i++) {

      output = output+ "{" + "\n \"eventName\": " + JSON.stringify(results.helsinkievents[i].name, undefined, 2) + "," + "\n" + "\"eventDescription\": " + JSON.stringify(results.helsinkievents[i].description, undefined, 2) + "," + "\n" + "\"startTime\": \"" + results.helsinkievents[i].start_time + "\"," + "\n" + "\"endTime\": \"" + results.helsinkievents[i].end_time + "\"," + "\n" + "\"streetAddress\": " + JSON.stringify(locationArray[i].street_address, undefined, 2) + ",\n" + "\"addressLocality\": " + JSON.stringify(locationArray[i].address_locality, undefined, 2) + "," + "\n" + "\"lat\": \"" + locationArray[i].position.coordinates[1] + "\"," + "\n\"lon\": \"" + locationArray[i].position.coordinates[0] + "\"," + "\n\"weather\": " + "{\n" + "\"temeparture\": \"" + JSON.stringify(weatherArray[i].currently.temperature, undefined, 2) + "\",\n\"feelsLike\": \"" + JSON.stringify(weatherArray[i].currently.apparentTemperature, undefined, 2) + "\"\n},\n\"route\": " + JSON.stringify(transportArray[i], undefined, 2)+"\n}";

      if (i < results.helsinkievents.length-1)
      {
      output = output + ",\n";
        }
    }
    res.send("[\n"+ output +"\n]")
  }
});

});

app.listen(5001);
