const express = require('express');
const authorController = require('../controllers/authorController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

module.exports = router;