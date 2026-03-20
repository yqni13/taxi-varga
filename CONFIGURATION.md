## 🔑 $\textsf{\color{salmon}.env Setup}$

### Additional information to set `.env` up correctly :

| Key | Information |
|-----|-------------|
| SECRET_GOOGLE_API_KEY | get from your Google Cloud account |
| SECRET_HOME_API_KEY | create yourself |
| SECRET_HOME_ADDRESS | central address to handle calculations from |
| SECRET_BETTERSTACK_... | get from your Betterstack account |

<br>

## 🗒️ $\textsf{\color{salmon}set-env.dev.ts Setup}$

### Create this file as "set-env.dev.ts" at the root of /frontend.
`Support` is an additional GitHub repository in use (https://github.com/yqni13/support).
<br>
Hosting services do NOT support multi-line environment variables. To use ssh keys, it is neccessary to store the keys as single-line text and convert it back to the preferred format before building the project. Best practice would be to have a script that converts Netlify secrets beforehand or manually add the prepared keys as single-line text and then convert it.Therefore, private/public keys are converted from single-line secret to multi-line secret via `fs.readFileSync`.

```sh
const fs_dev = require('fs');
const targetPath_dev = "./src/environments/environment.ts";
const public_key_dev = fs_dev.readFileSync('./public_key.pem', {encoding: 'utf-8'});
const private_key_dev = fs_dev.readFileSync('./private_key.pem', {encoding: 'utf-8'});
const envConfigFile_dev = `import { Environment } from "./environment.model";

export const environment: Environment = {
    BUILD_MODE: '', /*select your environment like "development"*/
    API_BASE_URL: '', /*select backend link like "https://localhost:3000"*/
    API_SUPPORT_URL: '', /*select support link like "http://localhost:5050" or keep ''*/
    API_SUPPORT_KEY: '', /*select support key or keep ''*/
    GOOGLE_API_KEY: '', /*select your Google Cloud API Key*/
    IV_POSITION: 0, /*decide for yourself*/
    MAIL_SUBJECT: '', /*decide for yourself like "Request \"taxi-varga\""*/
    AUTH_USER: '', /*decide for yourself*/
    AUTH_PASSWORD: '', /*decide for yourself*/
    PUBLIC_KEY: \`${public_key_dev}\`, /*add your self-assigned certificate to root*/
    PRIVATE_KEY: \`${private_key_dev}\` /*add your self-assigned certificate to root*/
};
`;
fs_dev.writeFileSync(targetPath_dev, envConfigFile_dev);
console.log(`Output generated at ${targetPath_dev}`);
```