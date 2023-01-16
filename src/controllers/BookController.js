const Book = require('../models/Book')
const mongoose = require('mongoose');

exports.books = async (req, res) => {

    const books = await Book.find({});

    return res.status(200).json(books);

}

exports.registerBook = async (req, res) => {

    const titulo = req.body.titulo;
    const autor = req.body.autor;


    if (!titulo || !autor) { return res.status(400).json({ error: "title-author-required" }) }
    if (titulo.length < 2) { return res.status(400).json({ error: "title-min-2" }) }
    if (autor.length < 2) { return res.status(400).json({ error: "autor-min-2" }) }

    const book = await Book.findOne({ titulo: titulo });

    if (book) { return res.status(400).json({ error: "book-already-exists" }) }

    Book.create({ titulo: titulo, autor: autor, disponivel: "sim", dataReserva: null, dataEntrega: null }).then(() => {
        return res.status(200).json({ success: "book-created" })
    }).catch((err) => {
        return res.status(500).json({ error: "failed-create-book" })
    })

}

exports.deleteBook = async (req, res) => {

    const id = req.body.id;

    if (!id) { return res.status(400).json({ error: "id-undefined" }) };

    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ error: "id-invalid" }) }
    const book = await Book.findOne({ _id: id })
    if (!book) { return res.status(400).json({ error: "book-not-exists" }) }
    Book.findByIdAndDelete({ _id: id }).then(() => {
        return res.status(200).json({ success: "book-excluded" })
    }).catch((err) => {
        return res.status(500).json({ error: "failed-delete-book" })
    })

}

exports.updateBook = async (req, res) => {

    const id = req.body.id;
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const disponivel = req.body.disponivel;
    const dataReserva = req.body.dataReserva;
    const dataEntrega = req.body.dataEntrega;


    if (!titulo || !autor || !id) { return res.status(400).json({ error: "title-author-id-required" }) }
    if (!disponivel || !dataReserva || !dataEntrega) { return res.status(400).json({ error: "available-reservationdate-deliverydate-required" }) }
    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ error: "id-invalid" }) }
    const book = await Book.findOne({ _id: id })
    if (!book) { return res.status(400).json({ error: "book-not-exists" }) }

    Book.findByIdAndUpdate(id, {
        titulo: titulo,
        autor: autor,
        disponivel: disponivel,
        dataReserva: dataReserva,
        dataEntrega: dataEntrega
    }).then(() => {
        return res.status(200).json({ success: "book-updated-success" })
    }).catch((err) => {
        return res.status(400).json({ error: "fail-create-book" })
    })

}       