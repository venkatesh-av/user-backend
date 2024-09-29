const express = require('express');
const {
  registerUser,
  getUserAddresses,
  getUsers,
  updateUserName,
  deleteUser,
} = require('../controllers/userControllers');
const {
  validateRegistration,
  validateUserId,
  validatePagination,
  validateAddress,
  validateName
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.get('/users/:userId/addresses', validateUserId, getUserAddresses);
router.get('/users', validatePagination, getUsers);


router.put('/users/:userId', validateUserId, validateName, updateUserName);
router.delete('/users/:userId', validateUserId, deleteUser);

module.exports = router;