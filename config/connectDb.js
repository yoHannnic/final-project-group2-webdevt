const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=> console.log(`Database connected successfully`.bgCyan.white))
    .catch( (error) => {
        console.log("issue in db connection");
        console.error(`${error}`.bgRed);
        process.exit(1);
    });
};

module.exports = connectDb;