const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/upload');

// addnewsroute
router.post('/addnews', async (req, res) => {
    try {
        const { title, description, date, time } = req.body;

        if (!title || !description || !date || !time) {
            return res.status(400).json({ message: "all fields are required", success: false });
        }
 
        const result = await db.executeQuery(
            `INSERT INTO news (title, description, date, time) VALUES (?, ?, ?, ?)`,
            [title, description, date, time]
        );

        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "news added successfully", success: true, result });
        } else {
            return res.status(400).json({ message: "news not added", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// getnews route
router.get('/getnews', async (req, res) => {
    try {
        const result = await db.executeQuery(`SELECT * FROM news`);
        if (result && result.length > 0) {
            return res.status(200).json({ message: "news geted successfully", success: true, result: result })
        } else {
            return res.status(400).json({ message: "news not geted", success: false })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: flase });
    }
})

// update route
router.put('/updatenews/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, date, time } = req.body;
        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        // update into database
        const result = await db.executeQuery(`UPDATE news SET title = ?, description = ?, date = ?, time = ? WHERE id = ?`,
            [title, description, date, time, id]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "news updated successfully", success: true, result: result });

        } else {
            return res.status(400).json({ message: 'news not updated', success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});
// delete news route
router.delete('/deletenews/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        // delete from database
        const result = await db.executeQuery(
            `DELETE FROM news WHERE id=?`,
            [id]
        );

        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "news deleted successfully", success: true });
        } else {
            return res.status(400).json({ message: "news not deleted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

module.exports = router;