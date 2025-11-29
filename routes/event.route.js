const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/upload');


//  addevent router
router.post('/addevent', upload.single('file'), async (req, res) => {
    try {
        const { title, description, event_date, event_time } = req.body;
        const file = req.file;

        if (!title || !description || !event_date || !event_time || !file) {
            return res.status(400).json({ message: "all fields are required", success: false });
        }

        // insert into database
        const result = await db.executeQuery(
            `INSERT INTO events (title, description, event_date, event_time, image_url) VALUES(?, ?, ?, ?, ?)`,
            [title, description, event_date, event_time, file.filename]
        );

        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "event added successfully", success: true });
        } else {
            return res.status(400).json({ message: "event not added", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});


// getevent router
router.get('/getevent', async (req, res) => {
    try {
        const result = await db.executeQuery("SELECT * FROM events");
        
        if (result && result.length > 0) {
            return res.status(200).json({ message: "events fetched successfully", success: true, result });
        } else {
            return res.status(400).json({ message: "no events found", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});


// update event router
router.put('/updateevent/:id', upload.single('file'), async (req, res) => {
    try {
        const id = req.params.id;
        const file = req.file;
        const { title, description, event_date, event_time } = req.body;

        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        if (file) {
            await db.executeQuery(
                "UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ?, image_url = ? WHERE id = ?",
                [title, description, event_date, event_time, file.filename, id]
            );
        } else {
            await db.executeQuery(
                "UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ? WHERE id = ?",
                [title, description, event_date, event_time, id]
            );
        }

        return res.status(200).json({ message: "event updated successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});


// delete event router
router.delete('/deleteevent/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        const result = await db.executeQuery("DELETE FROM events WHERE id = ?", [id]);

        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "event deleted successfully", success: true });
        } else {
            return res.status(400).json({ message: "event not deleted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});


module.exports = router