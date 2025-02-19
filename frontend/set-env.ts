// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const targetPath = "./src/environments/environment.prod.ts";
const envConfigFile = `import { Environment } from "./environment.model";

export const environment: Environment = {
    production: true,
    API_BASE_URL: '${process.env['API_URL']}',
    IV_POSITION: ${process.env['IV_POSITION']},
    AUTH_USER: '${process.env['AUTH_USER']}',
    AUTH_PASSWORD: '${process.env['AUTH_PASS']}',
    PUBLIC_KEY: '${process.env['PUBLIC_KEY']}',
    PRIVATE_KEY '${process.env['PRIVATE_KEY']}'
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
