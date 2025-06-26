require('dotenv').config();
const { Config } = require('./src/configs/config');
const app = require('./src/app');
// const https = require('https');
// const fs = require('fs');

// const options = {
//     key: fs.readFileSync("dev_ssl/be-key.pem", "utf8"),
//     cert: fs.readFileSync("dev_ssl/be-cert.pem", "utf8")
// }

// const port = Config.PORT;
// https.createServer(options, app).listen(port, () => {
//     console.log(`LOCAL SSL SERVER ACTIVE ON PORT ${port}!`)
// });

const port = Config.PORT;
app.listen(port, () => {
    console.log(`TAXI-VARGA SERVER RUNNING ON PORT: ${port}!`);
});