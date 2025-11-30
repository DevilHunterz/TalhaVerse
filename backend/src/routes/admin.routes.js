const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.get('/items', adminController.getAllItems);
router.post('/items/bulk-delete', adminController.bulkDeleteItems);
router.put('/items/:id/featured', adminController.toggleFeatured);

module.exports = router;
