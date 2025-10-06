const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { adminExists, adminStatus } = require('../controllers/adminController');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin utilities
 */

/**
 * @swagger
 * /api/admin/exists:
 *   get:
 *     summary: Check if an admin user exists in the database
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin existence status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 email:
 *                   type: string
 */
// Public: check if an admin exists in DB
router.get('/exists', adminExists);

/**
 * @swagger
 * /api/admin/status:
 *   get:
 *     summary: Verify current token is admin and return basic user info
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin user info
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access only
 */
// Protected + admin-only: confirm current token has admin role
router.get('/status', protect, isAdmin, adminStatus);

module.exports = router;
