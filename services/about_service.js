const express = require('express');
const app = express();
const aboutRoutes = require('../routes/about_routes');


const logger = require('../utils/logger');

app.use(express.json());
app.use('/', aboutRoutes);

const PORT = process.env.PORT || process.env.ABOUT_SERVICE_PORT || 4004;

app.listen(PORT, () => {
   
    logger.info(`About Service is running on port ${PORT}`);
});