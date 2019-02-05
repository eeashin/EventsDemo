const request = require('request');
var rp = require('request-promise');

var getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.forecast.io/forecast/108f4a0bc07eac437a8e2aa27962189e/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to Forecast.io server.');
    } else if (response.statusCode === 400) {
      callback('Unable to fetch weather.');
    } else if (response.statusCode === 200) {
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    }
  });
};

async function fetchWeather(locationArray) {
  let promiseArray = [];
  for (var i = 0; i < locationArray.length; i++) {
    let lat = locationArray[i].position.coordinates[1];
    let long = locationArray[i].position.coordinates[0];
    promiseArray.push(rp({
      url: `https://api.forecast.io/forecast/108f4a0bc07eac437a8e2aa27962189e/${lat},${long}`,
      json: true
    }));
  }
  let weatherArray = await Promise.all(promiseArray);
  return weatherArray;
}

module.exports = {
  getWeather: getWeather,
  fetchWeather: fetchWeather
};
