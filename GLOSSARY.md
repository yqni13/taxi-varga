# 📜 GLOSSARY 📜

Guidelines to handle common naming schemas.<br>
Consistency within these rules improve readability, maintenance and modular development.

<br>

## 🈹 Prefix (Decorators)

| Prefix  | Description                                    |
|---------|------------------------------------------------|
| `tava`  | global/reusable components/directives (common) |
| `app`   | feature-specific components (modules)          |
|  --     | pipes and helper are defined by purpose        |

<br>


## 🈯 File naming

Basic description: `<base>.<subsuffix?>.<suffix>.<ending>` [specific always singular]

| Classification    | Structure                            | Example                         |
|-------------------|--------------------------------------|---------------------------------|
| Interceptors      | `[base].http.interceptor.[ending]`   | app.http.interceptor.ts         |
| Abstracts         | `[base].abstract.component.[ending]` | input.abstract.component.ts     |
| Environments      | `environment.[suffix].[ending]`      | environment.prod.ts             |
| Interfaces        | `[base].interface.[ending]`          | address-request.interface.ts    |
| Components        | `[base].component.[ending]`          | service-airport.component.ts    |
| Directives        | `[base].directive.[ending]`          | ng-var.directive.ts             |
| Translations      | `[base?]-[language].json`            | en.json                         |
| Routes            | `[base].route.enum.[ending]`         | service.route.enum.ts           |
| APIs              | `[base].api.service.[ending]`        | mail.api.service.ts             |
| Services          | `[base].service.[ending]`            | crypto.service.ts               |
| Helper            | `[base].helper.[ending]`             | common.helper.ts                |
| Guards            | `[base].guard.[ending]`              | auth.guard.ts                   |
| Enums             | `[base].enum.[ending]`               | snackbar-options.enum.ts        |
| Pipes             | `[base].pipe.[ending]`               | distance-format.pipe.ts         |
| Integration-Tests | `[base].integration.test.js`         | mailing.integration.test.js     |
| Unit-Tests        | `[base].[suffix].test.js`            | address.validators.test.s       |

<br>


## 🈳 Functions

| Description             | Prefix                | Example                       |
|-------------------------|-----------------------|-------------------------------|
| Calculate data          | `calc`                | calcDrivingAirport()          |
| Get data                | `get`                 | getPlaceDetails()             |
| Check status            | `is`, `has`, `can`    | hasParams()                   |
| Configure data          | `format`, `transform` | transformOptions()            |
| Validate data           | `validate`            | validateImageSize()           |
| Initiate data/process   | `init`                | initRouteCollection()         |
| Convert data            | `map`, `to`           | toPayload(), mapRoutes()      |

<br>

## Testing

| Description                   | Prefix              | Example                       |
|-------------------------------|---------------------|-------------------------------|
| Basic mocks fn/results        | `mock`              | mockResult, mockAPI           |
| Mock specific params          | `mockParam_`        | mockParam_language            |
| Basic data to test from json  | `MockData_`         | MockData_places               |
| Integration-Tests             | --                  | workflow/express-validation   |
| Unit-Tests                    | --                  | models, custom validation     |
| Description: parameters       | `Params: \<name\>`  | <origin>, <subject>           |
| Description: triggered result | `by [name]`         | notEmpty by undefined         | 

<br>

## 🈺 Other

| Classification            | Structure                   | Example                   |
|---------------------------|-----------------------------|---------------------------|
| Enum (template access)    | `[EnumName]Enum`            | BaseRouteEnum = BaseRoute |
| Environment variables     | `SECRET_[description]`      | SECRET_API_KEY            |
| Logger context (method)   | `tava_[Class]_[Method]`     | tava_DBConnect_Init       |
| Storage keys              | `taxi-varga_[name]`         | taxi-varga_sessionToken   |
| SCSS values mode based    | `--theme-[base]-[sub]`      | --theme-nav-text          |
| SCSS values device based  | `--device-[base]-[sub]`     | --device-nav-height       |
| SCSS styling selectors    | `tava-[file]-[subparts]`    | .tava-address-input-text  |

<br>

## Abbreviations

| Abbreviation           | Definition                   | Value/Importance             |
|------------------------|------------------------------|------------------------------|
| BH                     | Business Hours               | 04:00-12:00 = withinBH       |
| LA                     | Lower Austria                | short province definition    |
| VIA                    | Vienna International Airport | short location definition    |
| h2o                    | Home to Origin               | short route direction        |
| o2d                    | Origin to Destination        | short route direction        |
| d2o                    | Destination to Origin        | short route direction        |
| o2h                    | Origin to Home               | short route direction        |
| d2h                    | Destination to Home          | short route direction        |
| o2g                    | Origin to Golf Course        | short route direction        |
| g2d                    | Golf Course to Destination   | short route direction        |
