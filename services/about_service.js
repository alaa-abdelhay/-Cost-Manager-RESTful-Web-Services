const express = require('express');
const app = express();
const aboutRoutes = require('../routes/about_routes');

// ייבוא הלוגר הקיים בפרויקט שלך
const logger = require('../utils/logger');

app.use(express.json());
app.use('/', aboutRoutes);

const PORT = process.env.ABOUT_SERVICE_PORT || 4004;

app.listen(PORT, () => {
    // שימוש בלוגר במקום ב-console.log
    logger.info(`About Service is running on port ${PORT}`);
});