const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/upload');
const { json } = require('body-parser');

// addstaff
router.post('/addstaff', upload.single('file'), async (req, res) => {
    try {
        const { name, designation, department, phone, email } = req.body
        const file = req.file;
        if (!name || !designation || !department || !phone || !email) {
            return res.status(400).json({ message: "all fields are required", succes: false });
        }

        // image optional
        const imageUrl = file ? file.filename : null;
        // inset into database
        const result = await db.executeQuery(`INSERT INTO staff (name,designation,department,phone,email,image_url) VALUES ( ? , ? , ? , ? , ? , ?)`,
            [name, designation, department, phone, email, imageUrl]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "staff added successfully", success: true, result: result });

        } else {
            return res.status(400).json({ message: "staff not added", success: false })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// getstaff router
router.get('/getstaff', async (req, res) => {
    try {
        const result = await db.executeQuery("SELECT * FROM staff");
        if (result && result.length > 0) {
            return res.status(200).json({ message: "staff geted successfully", success: true, result: result });
        } else {
            return res.status(400).json({ message: "staff not geted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: " internal server error", success: false });
    }
});

// updatestaff router
router.put('/updatestaff/:id', upload.single('file'), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, designation, department, phone, email } = req.body;
        const file = req.file;

        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }

        if (file) {
            await db.executeQuery(
                `UPDATE staff 
                 SET name = ?, designation = ?, department = ?, phone = ?, email = ?, image_url = ? 
                 WHERE id = ?`,
                [name, designation, department, phone, email, file.filename, id]
            );

            return res.status(200).json({
                message: "staff updated successfully",
                success: true
            });

        } else {
            await db.executeQuery(
                `UPDATE staff 
                 SET name = ?, designation = ?, department = ?, phone = ?, email = ? 
                 WHERE id = ?`,
                [name, designation, department, phone, email, id]
            );

            return res.status(200).json({
                message: "staff updated successfully",
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error", success: false });
    }
});

// deletestaf route
router.delete('/deletestaff/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "id is required", success: false });
        }
        // delete into database
        const result = await db.executeQuery(`DELETE FROM staff WHERE id = ?`, [id]);
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ message: "staff deleted successfully", success: true });
        } else {
            return res.status(400).json({ message: "staff not deleted", success: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500), json({ message: "internal server error", success: false });
    }
})


module.exports = router;