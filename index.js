const express = require('express');
const dotenv = require('dotenv').config();
const router = require('./routes/router');
const port = process.env.PORT || 5001;
const cors =require('cors')
const connectDb = require('./dbconfig/dbconnection');
const errorHandler = require('./middlewares/errorHandler'); // Import the errorHandler before using it.
const app = express();
connectDb();
app.use(cors())
app.use(express.json());

app.use('/', router);

app.use(errorHandler);


app.listen(port, () => {
    console.log(`App is listening on port...${port}`);
});
