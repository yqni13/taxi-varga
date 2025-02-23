/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
require('dotenv').config();
const targetPath = "./src/environments/environment.prod.ts";
const public_key = process.env['PUBLIC_KEY'];
const private_key = process.env['PRIVATE_KEY'];

const modifiedPublicKey = String(public_key).replaceAll(/_/g, '\n').trim();
const modifiedPrivateKey = String(private_key).replaceAll(/_/g, '\n').trim();

const envConfigFile = `import { Environment } from "./environment.model";

export const environment: Environment = {
    production: true,
    API_BASE_URL: '${process.env['API_URL']}',
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
