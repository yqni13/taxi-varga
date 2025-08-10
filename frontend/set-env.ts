/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
require('dotenv').config();
let targetPath, public_key, private_key;
switch(process.env['BUILD_MODE']) {
    case('staging'): {
        targetPath = "./src/environments/environment.stag.ts";
        public_key = process.env['PUBLIC_KEY'];
        private_key = process.env['PRIVATE_KEY'];
        break;
    }
    case('production'):
    default: {
        targetPath = "./src/environments/environment.prod.ts";
        public_key = process.env['PUBLIC_KEY'];
        private_key = process.env['PRIVATE_KEY'];
    }
}

const modifiedPublicKey = String(public_key).replaceAll(/_/g, '\n').trim();
const modifiedPrivateKey = String(private_key).replaceAll(/_/g, '\n').trim();

const envConfigFile = `import { Environment } from "./environment.model";

export const environment: Environment = {
    BUILD_MODE: '${process.env['BUILD_MODE']}',
    API_BASE_URL: '${process.env['API_URL']}',
    GOOGLE_API_KEY: '${process.env['GOOGLE_API']}',
    IV_POSITION: ${process.env['IV_POSITION']},
    MAIL_SUBJECT: '${process.env['MAIL_SUBJECT']}',
    AUTH_USER: '${process.env['AUTH_USER']}',
    AUTH_PASSWORD: '${process.env['AUTH_PASS']}',
    PUBLIC_KEY: \`${modifiedPublicKey}\`,
    PRIVATE_KEY: \`${modifiedPrivateKey}\`
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
