const fetch = require('isomorphic-fetch');
var rp = require('request-promise');

const query = `query Plan($toLatt: Float!, $toLongi: Float!, $fromLatt: Float!, $fromLongi: Float!) {
    plan(from: {lat: $fromLatt, lon: $fromLongi}
         to: {lat: $toLatt, lon: $toLongi }
         numItineraries: 3) {
     itineraries {
       legs {
                 startTime
                 endTime
                 mode
                 duration
                 realTime
                 distance
                 transitLeg
          }
      }
}}`;

var getTransports = (currentLatt, currentLong, destLatt, destLong, callback) => {
  fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { fromLatt: currentLatt, fromLongi: currentLong, toLatt: destLatt, toLongi: destLong},
    })
  })
    .then(r => r.json())
    .then(data => {
      callback(undefined, {
        data
      });
      //output = output + jsonOutput+"}";
      //console.log(output);
    });
};

async function fetchTransport(locationArray,currentLatt, currentLong) {
  let promiseArray = [];
  for (var i = 0; i < locationArray.length; i++) {
    let destLatt = locationArray[i].position.coordinates[1];
    let destLong = locationArray[i].position.coordinates[0];
    promiseArray.push(fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { fromLatt: currentLatt, fromLongi: currentLong, toLatt: destLatt, toLongi: destLong},
      })
    }).then(r => {return r.json();})
  );
}
  let transportArray = await Promise.all(promiseArray);
  return transportArray;
}


module.exports = {
  getTransports: getTransports,
  fetchTransport: fetchTransport
};
