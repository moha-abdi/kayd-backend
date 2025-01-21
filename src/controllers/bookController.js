const Book = require("../models/book");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("authors");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    console.info("Id is:", req.param.id);
    const book = await Book.findById(req.params.id).populate("authors");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRecentBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("authors");
    console.log("Books are:", books);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
