exports.basicResponse = (body, success, message) => {
    return {
        headers: { success, message },
        body: body
    };
};