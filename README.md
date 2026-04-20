# yqni13 | $\texttt{\color{seagreen}{TAXI-VARGA}}$
### $\textsf{\color{brown}{v1.9.22}}$

<br><br>

<div align="center">
    <img src="frontend/public/assets/docs/responsive_overview.png" alt="no responsive design at the moment">
</div>


<br>
<div align="center">
    <a href="https://v18.angular.dev/overview"><img src="frontend/public/assets/docs/icons/angular.png" alt="Angular"></a>
    <a href="https://nodejs.org/en"><img src="frontend/public/assets/docs/icons/nodejs.png" alt="Node.js"></a>
    <a href="https://mapsplatform.google.com/maps-products/?hl=en#places-section"><img src="frontend/public/assets/docs/icons/places.png" alt="GoolgePlacesAPI"></a>
    <a href="https://rxjs.dev/"><img src="frontend/public/assets/docs/icons/rxjs.png" alt="RxJS"></a>
    <a href="https://expressjs.com/"><img src="frontend/public/assets/docs/icons/express.png" alt="Express"></a>
    <a href="https://mapsplatform.google.com/maps-products/?hl=en#routes-section"><img src="frontend/public/assets/docs/icons/routes.png" alt="GoogleRoutesAPI"></a>
    <a href="https://www.i18next.com/"><img src="frontend/public/assets/docs/icons/i18n.png" alt="i18n"></a>
    <a href="https://jestjs.io/"><img src="frontend/public/assets/docs/icons/jest.png" alt="Jest"></a>
</div>

<br>


### $\textsf{\color{teal}Hosting}$
This project runs live (see link). The frontend is hosted by <a href="https://app.netlify.com/">Netlify</a>, while the backend is hosted by <a href="https://vercel.com/">Vercel</a>.<br>
For testing purposes one instance runs on env:stag while the live version runs on env:prod.
<br>
### visit the <a href="https://taxi-varga.at">WEBSITE</a>

<br>

## 🪄 $\textsf{\color{salmon}Getting started}$

### $\textsf{\color{teal}Prerequisites}$

- node: v22+
- Google API Key (geocode, places, distanceMatrix)
- Betterstack Telemetry (logging)

<br>

### $\textsf{\color{teal}Local setup}$


Download or clone project

```sh
git clone https://github.com/yqni13/taxi-varga
```

Create new .env file and fill in your credentials/other env data [(see docs)](./CONFIGURATION.md).
<br>Navigate/cd into the root paths (/frontend and /backend) and install dependencies via npm:
```sh
$ npm ci
```
This web project uses Google API calls, which require the application to run on SSL (https) - for each environment (dev/stag/prod). Therefore, when running on localhost, you need to use a self-signed certificate and configure your local environment to trust the certificate and enable an SSL connection. See the following [start-via-ssl configurations](README_SSL.md) for help. Additionally, the script to overwrite env data needs to be configured within [set-env.ts](./frontend/set-env.ts) (env:prod). Create a local copy [(see docs)](./CONFIGURATION.md) for local development. Start application (frontend) in local environment:
```sh
npm run start-local-ssl
```
which will open automatically on `https://localhost:4200/`. To run backend, use:
```sh
node server.js
```

<br>

## 🧩 $\textsf{\color{salmon}Features}$

| Feature | Description |
|---------|-------------|
| 🪁 Angular | Angular v18 standalone with routing + nested routes on id |
| 🌍 Google API | Google places/routes/geolocation API calculation/visualization |
| ⌨ Input | Customized form components (text/textarea/select) |
| 🔍 Search | Customized search-input form component combined with Google Places API |
| ⚠️ Validation | Customized validation in combination with Angular + Express-Validator |
| 🖼️ Preload | Customized image/video preload |
| 🔐 Encryption | Asymmetric/hybrid (RSA/AES) encrypted requests |
| 📧 Email | Email service with node.js & nodemailer |
| 🗯️ Notification | Customized snackbar + extended translation service |
| 🎨 Themes | Customized theme options (dark/light mode) |
| 📱 Design | Responsive design 400px > width < 1800px supported via flexbox & media queries |

<br>

### $\textsf{\color{teal}Customized form}$

All services take input for calculating the offer based on addresses, timestamps and checkboxes/radio buttons, as well as customer data such as name, email, phone number and notes. For full control, custom form components in combination with custom validation are used. The example of figure 2 shows built-in required-validator as well as custom time-related validation to be highlighted via red warning symbol and regarding validation message. Data validated by the backend informs the user via a (custom) snackbar message of any invalid input.

<div align="center">
    <img src="frontend/public/assets/docs/custom_forms_validation.jpg" alt="404 no picture found">
    Figure 2, v1.0.0-beta
</div>

<br>

### $\textsf{\color{teal}Google API}$

Data from Google, based on the `RoutesAPI`, `PlacesAPI` and `MapsAPI (Geocode)`, is used for the calculations and address suggestions/autocompletion. The user can type their address into the search field for his address and gets a max of 5 addresses listed as a result of the current input. Figure 3 shows that, after every change to the search input, a request is sent, providing the listed options in the response. Clicking on an option sends a final request to get all details of the selected address/place, which is necessary to continue the service. If no option is selected, the form will be invalid and the regarding validation message displayed. Google requires its logo to be displayed whenever a map or place data (in this case, the address options) is used.

<div align="center">
    <img src="frontend/public/assets/docs/google_autocomplete.png" alt="&nbsp;no picture found">
    Figure 3, v1.0.0
</div>

<br>

Additionally, the service for spontaneous drives offers a feature that uses coordinates via `Geolocation` to determine the starting address and displaying `Google Maps` with the location marked, improving user experience and coordinate accuracy verification (see Figure 4, location used as pickup address). 

<div align="center">
    <img src="frontend/public/assets/docs/maps_api.gif" alt="&nbsp;no picture found">
    Figure 4, v1.5.2
</div>

<br>

### $\textsf{\color{teal}Theme, Internationalization and extended translate service}$

The applications design can be changed to one of two different themes: $\textsf{\color{gray}{dark mode}}$ & $\textsf{\color{goldenrod}{light mode}}$ (see Figure 5). The selected theme as well as the current language for translations are stored in the localstorage. Dark mode and german language are set for default. For easier maintenance and readability, a loader combines multiple .json files for the same language translations [see custom-translate-loader.ts](/frontend/public/assets/i18n/custom-translate-loader.ts).

<br>

Additionally to the ngx-translate package, a `customized extention` is used to handle dynamic values for translations [(see docs)](./TRANSLATIONS.md).
<div align="center">
    <img src="frontend/public/assets/docs/theme_i18n.gif" alt="&nbsp;no picture found">
    Figure 5, v1.5.6
</div>

<br>

### $\textsf{\color{teal}Security}$

For security reasons, the user automatically initiates a background login process, which sends an inittialization request (see figure 6). The payload consists of the service in use and the credentials. Currently, both username and password are asymmetrically encrypted; the best practice would be to hash the password, but we don't use a database for hash comparison. The server compares the data to verify the authenticity of the client and generates a random JSON Web Token (JWT) with an appropriate expiration time. In the response shown in Figure 6, we can see the generated token, which is stored (currently not as a cookie; this will be addressed in a future update) and included with each following request to ensure authentication.

<div align="center">
    <img src="frontend/public/assets/docs/session-token_login.jpg" alt="&nbsp;no picture found">
    Figure 6, v1.0.0
</div>

<br>

Hybrid encryption is used for encrypting sensitive data such as the user input submitted when sending emails (name, phone number, message, and so forth). Figure 7 displays the encrypted data in the request, decrypted in the backend to handle logic and again encrypting data for the response. On client side, the webcrypto api support Angular to handle RSA and AES en/decryption and in NodeJS on the backend, node-forge is used.

<div align="center">
    <img src="frontend/public/assets/docs/encrypted_request.jpg" alt="&nbsp;no picture found">
    Figure 7, v1.0.0
</div>

<br>

### $\textsf{\color{teal}Preloading}$

To prevent any delay between building the page and displaying the active assets (images/videos), the `AssetsPreloadService` and `AssetsPreloadGuard` are used to load all assets accordingly. 

While the guard is used within the `*.routes.ts` files to load assets in advance (see Figure 8, code block), the service can also be used to preload assets/data dynamically or modular:
```sh
this.assetsPreloadService.preloadAssets({
    images?: imagePathArray,
    videos?: videoPathArray
}).finally(() => {
    this.isLoadingFlag = false;
})
```

<div align="center">
    <img src="frontend/public/assets/docs/preload.gif" alt="&nbsp;no picture found">
    Figure 8, v1.2.2
</div>

<br>

## 🔧 $\textsf{\color{salmon}Testing}$

### $\textsf{\color{teal}Jest}$

The `jest` testing framework was added to the project, providing unit-tests and integration-tests for the `backend`.<br>
Install the packages `@jest/globals`, `@types/jest`, `supertest` additional to `jest`:
```sh
npm install jest @jest/globals @types/jest supertest --save-dev
```
Currently, 200+ tests exist for models, utilities, validators, and workflows/integration-tests [(see tests)](./backend/tests).<br>
Run tests on local device by including setup for dotenv/config to provide environment variables:
```sh
set NODE_MODE=staging && jest --setupFiles dotenv/config
```
or simply save as script command in `package.json` to run `npm test`:
```sh
  "scripts": {
    "start": "node server.js",
    "test": "set NODE_MODE=staging && jest --setupFiles dotenv/config"
  }
```
To automatically run tests before merging a feature/development branch upstream, a `GitHub Action` is set up, see [main.yml](.github/workflows/main.yml).<br>
To prevent an unwanted merge due to an unfinished or failed test run, the project is set up to disable merging until all tests have passed (see Figure 9).

<div align="center">
    <img src="frontend/public/assets/docs/github-action-jest.jpg" alt="&nbsp;no picture found">
    Figure 9, v1.3.1
</div>

<br>

### $\textsf{\color{teal}Angular ESLint}$

Added angular-eslint to project for next step of testing.<br>
Install ESLint global via node package manager:
```sh 
$ npm install -g eslint
```
Install ESLint local for angular project: 

```sh
$ ng add @angular-eslint/schematics
```

Run ESLint to list all current lint errors: 
```sh
$ npm run lint
```
<br>

### $\textsf{\color{teal}Cross-browser testing}$

<img src="frontend/public/assets/docs/icons/firefox_logo50.ico"> | <img src="frontend/public/assets/docs/icons/chrome_logo50.ico"> | <img src="frontend/public/assets/docs/icons/opera_logo50.ico"> | <img src="frontend/public/assets/docs/icons/edge_logo50.ico"> | <img src="frontend/public/assets/docs/icons/duckduckgo_logo50.ico"> | <img src="frontend/public/assets/docs/icons/brave_logo50.ico">
|:------:|:------:|:------:|:------:|:------:|:------:|
|Firefox | Chrome | Opera  | Edge   | DuckGo | Brave  |
|Yes*    | Yes    | Yes    | Yes    | Yes    | Yes    |

<br>

*This browser has problems with some loading/processing.

<br>

## 📈 $\textsf{\color{salmon}Updates}$
[see changelog for all updates](CHANGELOG.md)

$\textsf{[v1.9.20\ =>\ {\textbf{\color{brown}v1.9.22}]}}$ app
- $\textsf{\color{orange}Patch:}$ Updated:
  + styling of custom input components
  + using 'host' property in components instead of @HostListener decorator

<br>

### Aimed objectives for next $\textsf{\color{green}minor}$ update:
<dl>
    <dd>- update email format</dd>
    <dd>- update token handling (refresh token)</dd>
    <dd>- update logging & exception handling (client side)</dd>
    <dd>- add testing (frontend)</dd>
</dl>
