const express = require('express');
const bookController = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', bookController.getAllBooks);
router.get('/recent', bookController.getRecentBooks);
router.get('/:id', bookController.getBookById);

module.exports = router;