const request = require('request');

var allevents = (district, callback) => {
  request({
    url: `https://api.hel.fi/linkedevents/v1/event/page_size=20&start=2019-02-05&division=${district}`,
    json: true
  }, (error, response, body) => {

    if (error) {
      callback('Unable to connect to Helsinki app servers.');
    }
    else {
      callback(undefined, {
        helsinkievents: body.data
      });
    }
  });
};

module.exports.allevents = allevents;
