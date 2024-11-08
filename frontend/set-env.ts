// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const targetPath = "./src/environments/environment.prod.ts";
const envConfigFile = `import { Environment } from "./environment.model";

export const environment: Environment = {
    production: true,
    API_BASE_URL: '${process.env['API_URL']}'
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
