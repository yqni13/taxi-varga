# yqni13 taxi-varga

### $\texttt{\color{olive}{LIST\ OF\ UPDATES}}$

<br>

### 2025/09/04 - $\textsf{last\ update\ 1.6.6\ >>\ {\color{pink}1.6.7}}$

- $\textsf{\color{red}Patch:}$ Updated Google API paramters to adapt billing triggers.

### 2025/09/02 - $\textsf{last\ update\ 1.6.5\ >>\ {\color{pink}1.6.6}}$

- $\textsf{\color{teal}Addition:}$ Added maintenance middleware to improve control of application handling.

### 2025/08/19 - $\textsf{last\ update\ 1.6.4\ >>\ {\color{pink}1.6.5}}$

- $\textsf{\color{red}Bugfix:}$ Service 'quick' calculates prices with expected handling of return data. [Before: Return was priced on routes that do not have a return route to price.]

### 2025/08/17 - $\textsf{last\ update\ 1.6.3\ >>\ {\color{pink}1.6.4}}$

- $\textsf{\color{red}Patch:}$ Updated tenancy calculation on service 'quick' (incorrect handling of included tenancy).

### 2025/08/16 - $\textsf{last\ update\ 1.6.2\ >>\ {\color{pink}1.6.3}}$

- $\textsf{\color{red}Patch:}$ Updated costs on service 'destination'.

### 2025/08/13 - $\textsf{last\ update\ 1.6.1\ >>\ {\color{pink}1.6.2}}$

- $\textsf{\color{teal}Addition:}$ Added route to request meta data of application.
- $\textsf{\color{red}Patch:}$ Updated descriptions on services.

### 2025/08/10 - $\textsf{last\ update\ 1.5.10\ >>\ {\color{pink}1.6.1}}$

- $\textsf{\color{green}Change:}$ Added staging environment to test software outside of local environment before shipping as ready-to-use software.
- $\textsf{\color{red}Patch:}$ Updated calculations on services 'destination' to adapt discount-by-distance.

### 2025/08/08 - $\textsf{last\ update\ 1.5.9\ >>\ {\color{pink}1.5.10}}$

- $\textsf{\color{red}Patch:}$ Updated calculations on services 'destination' to swap addresses in parameters instead of route response data only.

### 2025/08/07 - $\textsf{last\ update\ 1.5.8\ >>\ {\color{pink}1.5.9}}$

- $\textsf{\color{red}Bugfix:}$ Service 'destination' uses parameters as expected to calculate. [Before: Additional parameters were undefined due to calling wrong layer in object for values.]

### 2025/08/06 - $\textsf{last\ update\ 1.5.7\ >>\ {\color{pink}1.5.8}}$

- $\textsf{\color{red}Patch:}$ Updated calculations on services 'destination', 'golf' and 'quick'.

### 2025/07/29 - $\textsf{last\ update\ 1.5.6\ >>\ {\color{pink}1.5.7}}$

- $\textsf{\color{red}Patch:}$ Updated validation on service 'quick' for postal codes (general) and origin address ('quick' only).

### 2025/07/27 - $\textsf{last\ update\ 1.5.3\ >>\ {\color{pink}1.5.6}}$

- $\textsf{\color{green}Change:}$ Updated design of starting page + small style modifications on existing pages.
- $\textsf{\color{red}Bugfix:}$ Searching for golf courses within service 'golf' results in listing all existing establishments. [Before: Searching for certain golf courses resulted in missing entries because some golf courses have primary type "hotel" which was not filtered for.]
- $\textsf{\color{red}Patch:}$ Updated return calculation on service 'quick'.

### 2025/07/18 - $\textsf{last\ update\ 1.5.2\ >>\ {\color{pink}1.5.3}}$

- $\textsf{\color{red}Patch:}$ Updated validation on service 'airport' to refuse addresses without zipcode.

### 2025/07/14 - $\textsf{last\ update\ 1.5.0\ >>\ {\color{pink}1.5.2}}$

- $\textsf{\color{teal}Addition:}$ Added feature to get location via Geolocation for service 'quick'.
- $\textsf{\color{red}Patch:}$ Updated address validation with '+' characters in original description.

### 2025/07/12 - $\textsf{last\ update\ 1.4.0\ >>\ {\color{pink}1.5.0}}$

- $\textsf{\color{teal}Addition:}$ Added new service 'quick' for spontaneous drives (no pre-ordering).

### 2025/07/01 - $\textsf{last\ update\ 1.3.6\ >>\ {\color{pink}1.4.0}}$

- $\textsf{\color{green}Change:}$ Updated Google Places API from Legacy to New version. Additionally improved search results by focusing on Austria-based addresses.

### 2025/06/27 - $\textsf{last\ update\ 1.3.4\ >>\ {\color{pink}1.3.6}}$

- $\textsf{\color{red}Patch:}$ Updated approach calculation on service 'destination'.
- $\textsf{\color{red}Bugfix:}$ Switching multiple times between mode 'arrival' and 'departure' on service 'airport' validates input correctly. [Before: Clicking into address-input-field and/or writing input and then switching modes caused wrong validations and blocked sending the request without displaying errors.]

### 2025/06/26 - $\textsf{last\ update\ 1.3.2\ >>\ {\color{pink}1.3.4}}$

- $\textsf{\color{red}Patch:}$ Refactored icons from dynamic to static load.
- $\textsf{\color{red}Patch:}$ Updated security respective dependencies.

### 2025/06/24 - $\textsf{last\ update\ 1.3.1\ >>\ {\color{pink}1.3.2}}$

- $\textsf{\color{teal}Addition:}$ Added integration tests for workflows and express-validations within backend.

### 2025/06/19 - $\textsf{last\ update\ 1.2.5\ >>\ {\color{pink}1.3.1}}$

- $\textsf{\color{teal}Addition:}$ Added unit tests for services, utils, validations and Google API within backend.
- $\textsf{\color{teal}Addition:}$ Added GLOSSARY.md as guidelines for name schemas, prefixes and abbreviations.

### 2025/06/14 - $\textsf{last\ update\ 1.2.4\ >>\ {\color{pink}1.2.5}}$

- $\textsf{\color{red}Patch:}$ Services 'destination' and 'golf' had incorrect prices to calculate with (static variables).

### 2025/06/11 - $\textsf{last\ update\ 1.2.3\ >>\ {\color{pink}1.2.4}}$

- $\textsf{\color{red}Patch:}$ Updated service 'destination' and 'golf' calculation + refactoring.

### 2025/06/08 - $\textsf{last\ update\ 1.2.2\ >>\ {\color{pink}1.2.3}}$

- $\textsf{\color{red}Patch:}$ Updated service 'destination' and 'golf' behavior to refuse Vienna/VIE requests and navigate back to service overview.
- $\textsf{\color{red}Patch:}$ Updated service 'flatrate' calculation.

### 2025/05/24 - $\textsf{last\ update\ 1.2.1\ >>\ {\color{pink}1.2.2}}$

- $\textsf{\color{red}Patch:}$ Added assets preload service/guard to provide loaded images/videos before showing page.
- $\textsf{\color{red}Patch:}$ Adapt price calculation based on/off business hours.

### 2025/05/07 - $\textsf{last\ update\ 1.2.0\ >>\ {\color{pink}1.2.1}}$

- $\textsf{\color{red}Patch:}$ Updated custom 'address-input' component behavior and added new validation to detect input without selected address.
- $\textsf{\color{red}Bugfix:}$ Opening an address input with input but no selected address reopens option list of active input field. [Before: Reopening address input with input and no selected address opened option lists of all (focused as well as inactive) address input fields in active component.]

### 2025/05/05 - $\textsf{last\ update\ 1.1.0\ >>\ {\color{pink}1.2.0}}$

- $\textsf{\color{teal}Addition:}$ Added key navigation for service components and image carousel.
- $\textsf{\color{red}Patch:}$ Updated business logic for service components 'flatrate' and 'golf'.
- $\textsf{\color{green}Change:}$ Changed input design of checkbox and radio buttons to fit color scheme + responsive behavior.

### 2025/05/02 - $\textsf{last\ update\ 1.0.5\ >>\ {\color{pink}1.1.0}}$

- $\textsf{\color{teal}Addition:}$ Added new service 'golf'.
- $\textsf{\color{red}Patch:}$ Updated validations in all service components.
- $\textsf{\color{green}Change:}$ Changed responsive design and color behaviour for multiple components.

### 2025/03/29 - $\textsf{last\ update\ 1.0.4\ >>\ {\color{pink}1.0.5}}$

- $\textsf{\color{red}Patch:}$ Adapt price calculation based on business hours.
- $\textsf{\color{red}Patch:}$ Adapt information on landing page.

### 2025/03/12 - $\textsf{last\ update\ 1.0.3\ >>\ {\color{pink}1.0.4}}$

- $\textsf{\color{red}Patch:}$ Adapt price calculation based on business hours.

### 2025/03/11 - $\textsf{last\ update\ 1.0.2\ >>\ {\color{pink}1.0.3}}$

- $\textsf{\color{red}Patch:}$ Adapt price calculation based on business hours.

### 2025/03/08 - $\textsf{last\ update\ 1.0.1\ >>\ {\color{pink}1.0.2}}$

- $\textsf{\color{red}Patch:}$ Add 'replyTo' option to mailing configuration for automatic assign of sender email address answering.

### 2025/03/02 - $\textsf{last\ update\ 1.0.0\ >>\ {\color{pink}1.0.1}}$

- $\textsf{\color{red}Patch:}$ Refactored business logic on service calculation 'destination'.
- $\textsf{\color{red}Patch:}$ Refactored content on 'samples' component.

### 2025/02/23 - $\textsf{last\ update\ 1.0.0-beta.2\ >>\ {\color{pink}1.0.0}}$

- $\textsf{\color{green}Change:}$ Added authentication to handle a service process witha session-token, checking for validity and expiration on every request.
- $\textsf{\color{green}Change:}$ Added en/decryption on client and server side to handle authentication and other sensible data on a secure level.
- $\textsf{\color{red}Patch:}$ Refactored Google API calls to send placeId instead of search text to increase output precision.
- $\textsf{\color{red}Patch:}$ Refactored business logic on service calculations.

### 2025/01/21 - $\textsf{last\ update\ 1.0.0-beta.1\ >>\ {\color{pink}1.0.0-beta.2}}$

- $\textsf{\color{red}Patch:}$ Added sessionToken to address-input.component to upgrade billing efficency (now only a session is charged instead of each request).

### 2025/01/21 - $\textsf{last\ update\ 1.0.0-beta\ >>\ {\color{pink}1.0.0-beta.1}}$

- $\textsf{\color{green}Change:}$ Update README.md to describe current project version.
- $\textsf{\color{green}Change:}$ Adapted responsive design regarding device height.