const request = require('request');
var rp = require('request-promise');


var addLocations = (helevents, callback) => {
  var arrayLength = helevents.length;
  for (var i = 0; i < arrayLength; i++) {
    loc = helevents[i].location["@id"];
    request({
      url: `${loc}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        callback('Unable to connect to Helsinki app servers.');
        console.log(error);
      }
      else {
        callback(undefined, {
          locationevents: body
        });
      }
    });
  }
}


async function getLocation(helevents) {
  var arrayLength = helevents.length;
  let promiseArray = [];
  for (var i = 0; i < arrayLength; i++) {
    loc = helevents[i].location["@id"];
    promiseArray.push(rp({
      url: `${loc}`,
      json: true
    }));
  }

  let locationArray = await Promise.all(promiseArray);
  return locationArray;
}

module.exports = {
  getLocation: getLocation,
  addLocations: addLocations
};

// module.exports.addLocations = addLocations;
