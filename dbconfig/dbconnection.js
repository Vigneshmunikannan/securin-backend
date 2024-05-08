const mongoose = require('mongoose');
const { getdata } = require("../controllers/dbdatacontrollers");
const cron = require('node-cron');

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected:", connect.connection.host, connect.connection.name);

        cron.schedule('0 0 * * *', () => {
            getdata("refresh");
        });
        getdata("first");


    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}

module.exports = connectDb;
