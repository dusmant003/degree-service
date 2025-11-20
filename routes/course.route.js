const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/upload');

// addcourseroute
router.post('/addcourse', upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file

        if (!title || !description || !file) {
            return res.status(400).json({ message: "all fields are required", success: false });
        }
        // insert in to database
        const result = await db.executeQuery("INSERT INTO courses (title, description, image_url) VALUES (? , ? ,?)",
            [title, description, file.filename]);

        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "course addes successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "course not added", success: false })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
})

// getcourseroute
router.get('/getcourse', async (req, res) => {
    try {
        const result = await db.executeQuery("SELECT * FROM courses");

        if (result && result.length > 0) {
            return res.status(200).json({ message: "course added successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "course not added", success: false })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
})

// updatecourseroute
router.put('/updatecourse/:id', upload.single('file'), async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description } = req.body;
        const file = req.file

        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        if (file) {
            await db.executeQuery("UPDATE courses SET title =? , description = ?, image_url = ? WHERE id = ?",
                [title, description, file.filename, id]);
        } else {
            await db.executeQuery("UPDATE courses SET title =? , description = ? WHERE id = ?",
                [title, description, id]);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
})

// deletecourseroute
router.delete('/deletecourse/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        const result = await db.executeQuery("DELETE FROM courses WHERE id = ?", [id]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "course deleted successfully", success: true });
        } else {
            return res.status(400).json({ message: "course not deleted", success: false })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });

    }
})

module.exports = router