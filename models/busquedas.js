const axios = require('axios');

class Busquedas {
    historial = "";

    constructor() {

    }

    get paramsMapBox () {
        return  {
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es'
                }
    }

    paramsWheather(lat, lon) {
        return {
            lat,
            lon,
            'appid': process.env.OPENWHEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    async lugarClima(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsWheather(lat, lon)
            });

            const resp = await instance.get();
            return {
                desc: resp.data.weather[0].description,
                temp: resp.data.main.temp,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
            }
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Busquedas;