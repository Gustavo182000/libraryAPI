const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    disponivel: String,
    dataReserva: String,
    dataEntrega: String
});

module.exports = mongoose.model('Book',BookSchema);