const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas.js');

require ('colors');
require('dotenv').config();

const main = async() => {

    let opcion;
    const busquedas = new Busquedas();
    do {
        opcion = await inquirerMenu();
        switch (opcion) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Buscar lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;
                const lugarSeleccionado = lugares.find(l => l.id === id);
                
                //guardar en db
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                //Clima
                const climaLugar = await busquedas.lugarClima(lugarSeleccionado.lat, lugarSeleccionado.lng);

                console.log(`\nInformacion de la ciudad\n`.green);    
                console.log(`Ciudad: `, lugarSeleccionado.nombre);
                console.log(`Lat: `, lugarSeleccionado.lat);
                console.log(`Lng: `, lugarSeleccionado.lng);
                console.log(`Temperatura: `, climaLugar.temp);
                console.log(`Minima: `, climaLugar.min);
                console.log(`Maxima: `, climaLugar.max);
                console.log('Actual: ', `${climaLugar.desc}`.yellow);
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(idx, lugar);
                })   
            break;
        }

        await pausa();
    } while(opcion !== 0);

}

main();