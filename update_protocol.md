# yqni13 taxi-varga

### $\texttt{\color{olive}{LIST\ OF\ UPDATES}}$

<br>

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