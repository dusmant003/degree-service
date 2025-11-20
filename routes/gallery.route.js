const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/upload');

// addimageroute
router.post('/addimage', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "no file uploaded", success: false });
        }
        // insert into database
        const result = await db.executeQuery(`INSERT INTO gallery (image_url) VALUES (?)`, [file.filename]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "image addes successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "image not addes", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
})

// getimageroute
router.get('/getimage', async (req, res) => {
    try {
        const result = await db.executeQuery("SELECT * FROM gallery");
        if (result && result.length > 0) {
            return res.status(200).json({ message: "image geted successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "image not geted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// updateimage
router.put('/updateimage/:id', upload.single('file'), async (req, res) => {
    try {
        const id = req.params.id;
        const file = req.file;
        if (!id || !file) {
            return res.status(400).json({ message: "id and file is required", success: false });
        }
        // update in to database
        const result = await db.executeQuery(`UPDATE gallery SET image_url = ? WHERE id = ?`, [file.filename, id]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "image updated successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "image not updated", success: false });

        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// deleteimageroute
router.delete('/deleteimage/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        // delete into database

        const result = await db.executeQuery(`DELETE FROM gallery WHERE id = ?`, [id]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "image deleted successfully", success: true });
        } else {
            return res.status(400).json({ message: "image not deleted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
})

module.exports = router