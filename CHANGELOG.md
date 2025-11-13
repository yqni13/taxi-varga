# yqni13 | taxi-varga

### $\texttt{\color{olive}{LIST\ OF\ UPDATES}}$

<br>

### $\textsf{\color{skyblue}2025/11/13}$

$\textsf{[v1.6.19\ =>\ {\textbf{\color{brown}v1.6.20}]}}$ app
- $\textsf{\color{red}Patch:}$ Updated documentation formatting.

<br>

### $\textsf{\color{skyblue}2025/11/07}$

$\textsf{[v1.6.18\ =>\ v1.6.19]}$ app
- $\textsf{\color{red}Patch:}$ Updated titles of services at 'home' and 'service' page (Frontend).

<br>

### $\textsf{\color{skyblue}2025/10/29}$

$\textsf{[v1.6.17\ =>\ v1.6.18]}$ app
- $\textsf{\color{red}Patch:}$ Updated servCost calculation on service 'destination'.

<br>

### $\textsf{\color{skyblue}2025/10/03}$

$\textsf{[v1.6.16\ =>\ v1.6.17]}$ app
- $\textsf{\color{red}Patch:}$ Updated servCost calculation on service 'destination'.

<br>

### $\textsf{\color{skyblue}2025/09/30}$

$\textsf{[v1.6.15\ =>\ v1.6.16]}$ app
- $\textsf{\color{red}Patch:}$ Updated latency calculation on service 'quick'.

<br>

### $\textsf{\color{skyblue}2025/09/29}$

$\textsf{[v1.6.13\ =>\ v1.6.15]}$ app
- $\textsf{\color{red}Patch:}$ Updated surcharge conditions on service 'quick' due to calculations.
- $\textsf{\color{red}Patch:}$ Updated surcharge calculations on service 'quick' due to changed border-waypoint handling.

<br>

### $\textsf{\color{skyblue}2025/09/28}$

$\textsf{[v1.6.12\ =>\ v1.6.13]}$ app
- $\textsf{\color{red}Patch:}$ Updated border-distance logic and cost calculations on service 'quick'.

<br>

### $\textsf{\color{skyblue}2025/09/19}$

$\textsf{[v1.6.11\ =>\ v1.6.12]}$ app
- $\textsf{\color{red}Patch:}$ Updated samples and surcharge prices/conditions on service 'destination' logic.

<br>

### $\textsf{\color{skyblue}2025/09/15}$

$\textsf{[v1.6.10\ =>\ v1.6.11]}$ app
- $\textsf{\color{red}Patch:}$ Updated samples and distance condition on service 'destination' logic. Additionally, deprecated code & tests are removed within 09/2025.

<br>

### $\textsf{\color{skyblue}2025/09/11}$

$\textsf{[v1.6.9\ =>\ v1.6.10]}$ app
- $\textsf{\color{red}Patch:}$ Updated validation on phone number in UI form.

<br>

### $\textsf{\color{skyblue}2025/09/06}$

$\textsf{[v1.6.8\ =>\ v1.6.9]}$ app
- $\textsf{\color{red}Patch:}$ Updated costs on service 'destination' (parking rates).

<br>

### $\textsf{\color{skyblue}2025/09/05}$

$\textsf{[v1.6.7\ =>\ v1.6.8]}$ app
- $\textsf{\color{red}Patch:}$ Updated costs on service 'destination'.

<br>

### $\textsf{\color{skyblue}2025/09/04}$

$\textsf{[v1.6.6\ =>\ v1.6.7]}$ app
- $\textsf{\color{red}Patch:}$ Updated Google API paramters to adapt billing triggers.

<br>

### $\textsf{\color{skyblue}2025/09/02}$

$\textsf{[v1.6.5\ =>\ v1.6.6]}$ app
- $\textsf{\color{teal}Addition:}$ Added maintenance middleware to improve control of application handling.

<br>

### $\textsf{\color{skyblue}2025/08/19}$

$\textsf{[v1.6.4\ =>\ v1.6.5]}$ app
- $\textsf{\color{red}Bugfix:}$ Service 'quick' calculates prices with expected handling of return data. [Before: Return was priced on routes that do not have a return route to price.]

<br>

### $\textsf{\color{skyblue}2025/08/17}$

$\textsf{[v1.6.3\ =>\ v1.6.4]}$ app
- $\textsf{\color{red}Patch:}$ Updated tenancy calculation on service 'quick' (incorrect handling of included tenancy).

<br>

### $\textsf{\color{skyblue}2025/08/16}$

$\textsf{[v1.6.2\ =>\ v1.6.3]}$ app
- $\textsf{\color{red}Patch:}$ Updated costs on service 'destination'.

<br>

### $\textsf{\color{skyblue}2025/08/13}$

$\textsf{[v1.6.1\ =>\ v1.6.2]}$ app
- $\textsf{\color{teal}Addition:}$ Added route to request meta data of application.
- $\textsf{\color{red}Patch:}$ Updated descriptions on services.

<br>

### $\textsf{\color{skyblue}2025/08/10}$

$\textsf{[v1.5.10\ =>\ v1.6.1]}$ app
- $\textsf{\color{green}Change:}$ Added staging environment to test software outside of local environment before shipping as ready-to-use software.
- $\textsf{\color{red}Patch:}$ Updated calculations on services 'destination' to adapt discount-by-distance.

<br>

### $\textsf{\color{skyblue}2025/08/08}$

$\textsf{[v1.5.9\ =>\ v1.5.10]}$ app
- $\textsf{\color{red}Patch:}$ Updated calculations on services 'destination' to swap addresses in parameters instead of route response data only.

<br>

### $\textsf{\color{skyblue}2025/08/07}$

$\textsf{[v1.5.8\ =>\ v1.5.9]}$ app
- $\textsf{\color{red}Bugfix:}$ Service 'destination' uses parameters as expected to calculate. [Before: Additional parameters were undefined due to calling wrong layer in object for values.]

<br>

### $\textsf{\color{skyblue}2025/08/06}$

$\textsf{[v1.5.7\ =>\ v1.5.8]}$ app
- $\textsf{\color{red}Patch:}$ Updated calculations on services 'destination', 'golf' and 'quick'.

<br>

### $\textsf{\color{skyblue}2025/07/29}$

$\textsf{[v1.5.6\ =>\ v1.5.7]}$ app
- $\textsf{\color{red}Patch:}$ Updated validation on service 'quick' for postal codes (general) and origin address ('quick' only).

<br>

### $\textsf{\color{skyblue}2025/07/27}$

$\textsf{[v1.5.3\ =>\ v1.5.6]}$ app
- $\textsf{\color{green}Change:}$ Updated design of starting page + small style modifications on existing pages.
- $\textsf{\color{red}Bugfix:}$ Searching for golf courses within service 'golf' results in listing all existing establishments. [Before: Searching for certain golf courses resulted in missing entries because some golf courses have primary type "hotel" which was not filtered for.]
- $\textsf{\color{red}Patch:}$ Updated return calculation on service 'quick'.

<br>

### $\textsf{\color{skyblue}2025/07/18}$

$\textsf{[v1.5.2\ =>\ v1.5.3]}$ app
- $\textsf{\color{red}Patch:}$ Updated validation on service 'airport' to refuse addresses without zipcode.

<br>

### $\textsf{\color{skyblue}2025/07/14}$

$\textsf{[v1.5.0\ =>\ v1.5.2]}$ app
- $\textsf{\color{teal}Addition:}$ Added feature to get location via Geolocation for service 'quick'.
- $\textsf{\color{red}Patch:}$ Updated address validation with '+' characters in original description.

<br>

### $\textsf{\color{skyblue}2025/07/12}$

$\textsf{[v1.4.0\ =>\ v1.5.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added new service 'quick' for spontaneous drives (no pre-ordering).

<br>

### $\textsf{\color{skyblue}2025/07/01}$

$\textsf{[v1.3.6\ =>\ v1.4.0]}$ app
- $\textsf{\color{green}Change:}$ Updated Google Places API from Legacy to New version. Additionally improved search results by focusing on Austria-based addresses.

<br>

### $\textsf{\color{skyblue}2025/06/27}$

$\textsf{[v1.3.4\ =>\ v1.3.6]}$ app
- $\textsf{\color{red}Patch:}$ Updated approach calculation on service 'destination'.
- $\textsf{\color{red}Bugfix:}$ Switching multiple times between mode 'arrival' and 'departure' on service 'airport' validates input correctly. [Before: Clicking into address-input-field and/or writing input and then switching modes caused wrong validations and blocked sending the request without displaying errors.]

<br>

### $\textsf{\color{skyblue}2025/06/26}$

$\textsf{[v1.3.2\ =>\ v1.3.4]}$ app
- $\textsf{\color{red}Patch:}$ Refactored icons from dynamic to static load.
- $\textsf{\color{red}Patch:}$ Updated security respective dependencies.

<br>

### $\textsf{\color{skyblue}2025/06/24}$

$\textsf{[v1.3.1\ =>\ v1.3.2]}$ app
- $\textsf{\color{teal}Addition:}$ Added integration tests for workflows and express-validations within backend.

<br>

### $\textsf{\color{skyblue}2025/06/19}$

$\textsf{[v1.2.5\ =>\ v1.3.1]}$ app
- $\textsf{\color{teal}Addition:}$ Added unit tests for services, utils, validations and Google API within backend.
- $\textsf{\color{teal}Addition:}$ Added GLOSSARY.md as guidelines for name schemas, prefixes and abbreviations.

<br>

### $\textsf{\color{skyblue}2025/06/14}$

$\textsf{[v1.2.4\ =>\ v1.2.5]}$ app
- $\textsf{\color{red}Patch:}$ Services 'destination' and 'golf' had incorrect prices to calculate with (static variables).

<br>

### $\textsf{\color{skyblue}2025/06/11}$

$\textsf{[v1.2.3\ =>\ v1.2.4]}$ app
- $\textsf{\color{red}Patch:}$ Updated service 'destination' and 'golf' calculation + refactoring.

<br>

### $\textsf{\color{skyblue}2025/06/08}$

$\textsf{[v1.2.2\ =>\ v1.2.3]}$ app
- $\textsf{\color{red}Patch:}$ Updated service 'destination' and 'golf' behavior to refuse Vienna/VIE requests and navigate back to service overview.
- $\textsf{\color{red}Patch:}$ Updated service 'flatrate' calculation.

<br>

### $\textsf{\color{skyblue}2025/05/24}$

$\textsf{[v1.2.1\ =>\ v1.2.2]}$ app
- $\textsf{\color{red}Patch:}$ Added assets preload service/guard to provide loaded images/videos before showing page.
- $\textsf{\color{red}Patch:}$ Adapt price calculation based on/off business hours.

<br>

### $\textsf{\color{skyblue}2025/05/07}$

$\textsf{[v1.2.0\ =>\ v1.2.1]}$ app
- $\textsf{\color{red}Patch:}$ Updated custom 'address-input' component behavior and added new validation to detect input without selected address.
- $\textsf{\color{red}Bugfix:}$ Opening an address input with input but no selected address reopens option list of active input field. [Before: Reopening address input with input and no selected address opened option lists of all (focused as well as inactive) address input fields in active component.]

<br>

### $\textsf{\color{skyblue}2025/05/05}$

$\textsf{[v1.1.0\ =>\ v1.2.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added key navigation for service components and image carousel.
- $\textsf{\color{red}Patch:}$ Updated business logic for service components 'flatrate' and 'golf'.
- $\textsf{\color{green}Change:}$ Changed input design of checkbox and radio buttons to fit color scheme + responsive behavior.

<br>

### $\textsf{\color{skyblue}2025/05/02}$

$\textsf{[v1.0.5\ =>\ v1.1.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added new service 'golf'.
- $\textsf{\color{red}Patch:}$ Updated validations in all service components.
- $\textsf{\color{green}Change:}$ Changed responsive design and color behaviour for multiple components.

<br>

### $\textsf{\color{skyblue}2025/03/29}$

$\textsf{[v1.0.4\ =>\ v1.0.5]}$ app
- $\textsf{\color{red}Patch:}$ Adapt price calculation based on business hours.
- $\textsf{\color{red}Patch:}$ Adapt information on landing page.

<br>

### $\textsf{\color{skyblue}2025/03/12}$

$\textsf{[v1.0.3\ =>\ v1.0.4]}$ app
- $\textsf{\color{red}Patch:}$ Adapt price calculation based on business hours.

<br>

### $\textsf{\color{skyblue}2025/03/11}$

$\textsf{[v1.0.2\ =>\ v1.0.3]}$ app
- $\textsf{\color{red}Patch:}$ Adapt price calculation based on business hours.

<br>

### $\textsf{\color{skyblue}2025/03/08}$

$\textsf{[v1.0.1\ =>\ v1.0.2]}$ app
- $\textsf{\color{red}Patch:}$ Add 'replyTo' option to mailing configuration for automatic assign of sender email address answering.

<br>

### $\textsf{\color{skyblue}2025/03/02}$

$\textsf{[v1.0.0\ =>\ v1.0.1]}$ app
- $\textsf{\color{red}Patch:}$ Refactored business logic on service calculation 'destination'.
- $\textsf{\color{red}Patch:}$ Refactored content on 'samples' component.

<br>

### $\textsf{\color{skyblue}2025/02/23}$

$\textsf{[v1.0.0-beta.2\ =>\ v1.0.0]}$ app
- $\textsf{\color{green}Change:}$ Added authentication to handle a service process witha session-token, checking for validity and expiration on every request.
- $\textsf{\color{green}Change:}$ Added en/decryption on client and server side to handle authentication and other sensible data on a secure level.
- $\textsf{\color{red}Patch:}$ Refactored Google API calls to send placeId instead of search text to increase output precision.
- $\textsf{\color{red}Patch:}$ Refactored business logic on service calculations.

<br>

### $\textsf{\color{skyblue}2025/01/21}$

$\textsf{[v1.0.0-beta.1\ =>\ v1.0.0-beta.2]}$ app
- $\textsf{\color{red}Patch:}$ Added sessionToken to address-input.component to upgrade billing efficency (now only a session is charged instead of each request).

<br>

### $\textsf{\color{skyblue}2025/01/21}$

$\textsf{[v1.0.0-beta\ =>\ v1.0.0-beta.1]}$ app
- $\textsf{\color{green}Change:}$ Update README.md to describe current project version.
- $\textsf{\color{green}Change:}$ Adapted responsive design regarding device height.