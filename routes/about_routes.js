const express = require('express');
const router = express.Router();

// הלוגיקה של שליפת נתוני הצוות
const getDevelopersTeam = async () => {
    try {
        return [
            {
                first_name: "Elia",
                last_name: "Meerson"
            },
            {
                first_name: "Sapir",
                last_name: "Levi"
            },
            {
                first_name: "Alaa",
                last_name: "Abdelhay"
            }
        ];
    } catch (error) {
        throw new Error("Failed to fetch developers team information.");
    }
};

// הגדרת הנתיב (Route)
router.get('/api/about', async (req, res) => {
    try {
        const teamMembers = await getDevelopersTeam();
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(500).json({
            id: 1,
            message: "An error occurred while fetching the developers team information."
        });
    }
});

module.exports = router;