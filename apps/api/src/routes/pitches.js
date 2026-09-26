const express = require('express');
const router =  express.Router();
const {
    createPitch,
    getAllPitches,
    getPitchById,
    updatePitch,
    deletePitch
} = require('../controllers/pitchController');
const verifyToken = require('../middleware/verifyToken');

//Public routes
router.get('/', getAllPitches);
router.get('/:id', getPitchById);

//Protected routes
router.post('/',verifyToken, createPitch);
router.put('/:id', verifyToken, updatePitch);
router.delete('/:id', verifyToken, deletePitch);

module.exports = router;
