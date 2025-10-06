const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById } = require('../controllers/categoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category browsing
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all active categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category
 *       404:
 *         description: Not found
 */
router.get('/:id', getCategoryById);

module.exports = router;
