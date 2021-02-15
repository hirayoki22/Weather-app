const request = require('postman-request');

getWeatherImages = (isDay, description) => {  
  return isDay === 'no'
    ? {
      bgImage: `assets/img/large/night/${description}.jpg`,
      icon: `assets/img/icons/night/${description}.png`
    } 
    : {
      bgImage: `assets/img/large/${description}.jpg`,
      icon: `assets/img/icons/${description}.png`
    };
}

const getTemperature = (query, units) => {
  const API_KEY = '588f0dac87f15746f26bedac5546b8a3';
  const URL = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${query}&units=${units}`;
  const CLIENT_ERROR = 'Unable to complete the request. Connection failed';
  const REQUEST_ERROR = 'Unable to get weather. Please provide a valid location or latitud/longitud';

  return new Promise((resolve, reject) => {
    request(URL, {json: true}, (err, res, body) => {
      if (err) {
        reject(new Error(CLIENT_ERROR));
      } else if (body.error) {
        reject(new Error(REQUEST_ERROR));
      } else {
        resolve({
          location: `${body.location.name}, ${body.location.region}`,
          temperature: body.current.temperature,
          unit: body.request.unit === 'm' ? 'C' : 'F',
          description: body.current.weather_descriptions,
          ...getWeatherImages(
            body.current.is_day, 
            body.current.weather_descriptions[0].toLowerCase()
          )
        });
      }
    });
  });
}

const weather = (req, res) => {
  getTemperature(req.query.address, req.query.unit ?? 'm')
    .then(temp => res.status(200).end(JSON.stringify(temp, null, 2)))
    .catch(e => res.status(404).end(JSON.stringify({ error: e.message })));
}

module.exports = { weather, getTemperature };
