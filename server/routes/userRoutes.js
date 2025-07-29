const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUserList, signupUser } = require('../controllers/userController');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/list', getUserList);

module.exports = router;
