const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/upload');

// uploadroute
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file
        if (!file) {
            return res.status(400).json({ message: "no file uploades", success: false });
        } else {
            return res.status(200).json({ message: "file uploaded successfully", success: true, file: file });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
})


module.exports = router