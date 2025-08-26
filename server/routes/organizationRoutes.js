const express = require('express');
const router = express.Router();
const { createOrganization } = require('../controllers/organizationController');

router.post('/organizations', createOrganization);

module.exports = router;
