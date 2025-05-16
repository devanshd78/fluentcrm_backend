const express = require('express');
const { register, login,listVerifiedMarketers} = require('../controller/marketerController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);



module.exports = router;
