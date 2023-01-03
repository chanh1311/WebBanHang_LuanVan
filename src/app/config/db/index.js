const mongoose = require('mongoose');
require('dotenv').config({ path: 'src/config.env' });

const URL_DB_ATLAS = process.env.URL_DB_ATLAS;
async function connect() {
    try {
        await mongoose.connect(URL_DB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect Sucessfully!!!!');
    } catch (error) {
        console.log('Connect faild!!!!');
    }
}

module.exports = { connect };
