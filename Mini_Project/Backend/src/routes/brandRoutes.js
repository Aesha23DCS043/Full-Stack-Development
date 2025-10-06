const express = require('express');
const router = express.Router();
const { getBrands, getBrandById, getFeaturedBrands } = require('../controllers/brandController');

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand browsing
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: List all active brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/', getBrands);

/**
 * @swagger
 * /api/brands/featured:
 *   get:
 *     summary: List featured brands
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Featured brands
 */
router.get('/featured', getFeaturedBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get brand by id
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand
 *       404:
 *         description: Not found
 */
router.get('/:id', getBrandById);

module.exports = router;
