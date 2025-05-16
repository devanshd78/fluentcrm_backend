// routes/activityListRoutes.js
const express = require('express');
const multer  = require('multer');
const { 
  createActivityList, 
  getAllActivityLists, 
  uploadContacts,
  getContacts,
  updateActivityList,    
  deleteActivityList,
  getActivitiesByMarketer,
  getActivityById,
  addContact,
  updateContact,
  deleteContact,
  getMarketerList
} = require('../controller/activityListController');
const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create a new activity list
// POST /activity-lists/create
router.post('/create', createActivityList);

// Get all activity lists
// GET /activity-lists/getlist
router.post('/getlist', getAllActivityLists);

// Upload CSV to an existing list by activityId
// POST /activity-lists/:activityId/upload-csv
router.post('/upload', upload.single('file'), uploadContacts);
router.post('/get-contacts', getContacts);
router.post('/update', updateActivityList);
router.post('/delete', deleteActivityList);
router.post('/getbymarketerId', getActivitiesByMarketer);
router.post('/getbyactivityId', getActivityById);
router.post('/add',addContact);
router.post('/update-contact',updateContact);
router.post('/delete-contact', deleteContact);
router.get('/select-campaign', getMarketerList);

module.exports = router;