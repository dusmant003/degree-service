const express = require('express');
const router = express.Router();
const db = require('../config/db');

// addcontactroute
router.post('/addcontact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "all fields are required", success: false });
        }
        // insert into database
        const result = await db.executeQuery(`INSERT INTO contact_messages(name, email, message) VALUES (?, ?, ?)`,
            [name, email, message]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "message added successfully", success: true, result: result });

        } else {
            return res.status(400).json({ message: "message not added", success: false })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// getcontactroute
router.get('/getcontact', async (req, res) => {
    try {
        const result = await db.executeQuery(`SELECT * FROM contact_messages`);
        if (result && result.length > 0) {
            return res.status(200).json({ message: "message geted successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "message not geted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// deletecontactroute
router.delete('/deletecontact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }
        // delete into database
        const result = await db.executeQuery(`DELETE FROM contact_messages WHERE id = ?`, [id]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "message deleted successfully", success: true });
        } else {
            return res.status(400).json({ message: "message not deleted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

module.exports = router