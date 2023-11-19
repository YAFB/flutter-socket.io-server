const { io } = require("../index");

const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band("Bad Bunny"));
bands.addBand(new Band("One direction"));
bands.addBand(new Band("Five seconds of summer"));
bands.addBand(new Band("BTS"));
bands.addBand(new Band("Black pink"));
bands.addBand(new Band("Moderato"));
bands.addBand(new Band("Arcangel"));
bands.addBand(new Band("Eladio carreon"));
bands.addBand(new Band("Quevedo"));
bands.addBand(new Band("Feid"));

console.log(bands);

// Mensaje de sockets
io.on('connection', client => {
    // client.on('event', data => { /* … */ });
    console.log("Cliente conectado");

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log("Cliente desconectado"); });

    client.on('mensaje', (payload) => {
        console.log("MENSAJE!!", payload.nombre);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('emitir-mensaje', (payload) => {
        console.log(payload);
        // io.emit('nuevo-mensaje', payload); // EMITE A TODOS
        client.broadcast.emit('nuevo-mensaje', payload); // Emite a todos menos al que lo emitio
    })

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })

    client.on('add-band', (payload) => {
        console.log(payload);
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    })

    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })

});