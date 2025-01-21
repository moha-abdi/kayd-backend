const Author = require("../models/author");

exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    console.log("authors is:", authors);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
