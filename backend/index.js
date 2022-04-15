import express from 'express';
import logger from 'morgan';
import backendRouter from './backend.js';

// Initialize express
const app = express();
const port = 3000;
app.use(logger('dev'));
app.use('/', express.static('./src'));
app.use('/api', backendRouter);


// Start the Server
app.listen(port, () => {
    console.log(`Hosting server on port: ${port}`)
});
