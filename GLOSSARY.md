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

| Classification | Structure                            | Example                         |
|----------------|--------------------------------------|---------------------------------|
| Interceptors   | `[base].http.interceptor.[ending]`   | app.http.interceptor.ts         |
| Abstracts      | `[base].abstract.component.[ending]` | input.abstract.component.ts     |
| Environments   | `environment.[suffix].[ending]`      | environment.prod.ts             |
| Interfaces     | `[base].interface.[ending]`          | address-request.interface.ts    |
| Components     | `[base].component.[ending]`          | service-airport.component.ts    |
| Directives     | `[base].directive.[ending]`          | ng-var.directive.ts             |
| Translations   | `[base?]-[language].json`            | en.json                         |
| Routes         | `[base].route.enum.[ending]`         | service.route.enum.ts           |
| APIs           | `[base].api.service.[ending]`        | mail.api.service.ts             |
| Services       | `[base].service.[ending]`            | crypto.service.ts               |
| Helper         | `[base].helper.[ending]`             | common.helper.ts                |
| Guards         | `[base].guard.[ending]`              | auth.guard.ts                   |
| Enums          | `[base].enum.[ending]`               | snackbar-options.enum.ts        |
| Pipes          | `[base].pipe.[ending]`               | distance-format.pipe.ts         |

<br>


## 🈳 Functions

| Description             | Prefix               | Example                       |
|-------------------------|----------------------|-------------------------------|
| calculate data          | `calc`               | calcDrivingAirport()          |
| get data                | `get`                | getPlaceDetails()             |
| check status            | `is`, `has`, `can`   | hasParams()                   |
| configure data          | `format`, `transform`| transformOptions()            |
| validate data           | `validate`           | validateImageSize()           |
| initiate data/process   | `init`               | initRouteCollection()         |
| convert data            | `map`, `to`          | toPayload(), mapRoutes()      |

<br>

## Testing

| Description                   | Prefix             | Example                       |
|-------------------------------|--------------------|-------------------------------|
| basic mocks fn/results        | `mock`             | mockResult, mockAPI           |
| mock specific params          | `mockParam_`       | mockParam_language            |
| basic data to test from json  | `MockData_`        | MockData_places               |

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

| Abbreviation           | Definition                  |
|------------------------|-----------------------------|
| BH                     | Business Hours              |
