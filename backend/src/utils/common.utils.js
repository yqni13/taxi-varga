exports.basicResponse = (body, success, message) => {
    return {
        headers: { success, message },
        body: body
    };
};

exports.stateRegex = new RegExp(/([A-Za-zäöüÄÖÜ ])\w+/g)

exports.streetRegex = new RegExp(/([A-Za-zöäüÖÄÜ \-])\w+/g)