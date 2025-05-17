const express            = require('express');
const { sendMailToList,getMailDescription, getMailDescriptionList} = require('../controller/mailController');
const router             = express.Router();


router.post('/send', sendMailToList);
router.post('/description',getMailDescription);
router.get('/description/list', getMailDescriptionList);

module.exports = router;