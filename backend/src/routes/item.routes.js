const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { authenticate, isAdmin, optionalAuth } = require('../middleware/auth.middleware');
const { downloadLimiter } = require('../middleware/rateLimiter.middleware');

router.get('/', itemController.getItems);
router.get('/featured', itemController.getFeaturedItems);
router.get('/trending', itemController.getTrendingItems);
router.get('/type/:type', itemController.getItemsByType);
router.get('/:slug', itemController.getItemBySlug);

router.post('/', authenticate, isAdmin, itemController.createItem);
router.put('/:id', authenticate, isAdmin, itemController.updateItem);
router.delete('/:id', authenticate, isAdmin, itemController.deleteItem);

module.exports = router;
