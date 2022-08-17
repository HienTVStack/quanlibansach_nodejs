const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/booksCellManager_DACNPM', {
            // await mongoose.connect('mongodb+srv://HienTVStack:VanHien2001@cluster0.4mzxu.mongodb.net/WebsiteBanSach_BC-CNPM', {

            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log('=========> connect successfully !!!');
    } catch (error) {
        console.log('=========>  connect failure !!!');
    }
}

module.exports = {
    connect
};