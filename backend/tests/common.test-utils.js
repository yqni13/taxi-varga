function mapMockApiResult(mockResult, mockBoolean, mockErrorMsg = null) {
    let apiResult = null;
    // TODO(yqni13): implement further api mocking
    if(mockErrorMsg) {
        apiResult = jest.fn().mockRejectedValueOnce(new Error(mockErrorMsg));
    }

    return apiResult;
}

function mapMockDecryptResult(mockResult, mockErrorMsg = null) {
    let decryptResult = null;
    if(mockErrorMsg) {
        decryptResult = jest.fn().mockRejectedValueOnce(new Error(mockErrorMsg));
    } else if(mockResult) {
        decryptResult = jest.fn().mockResolvedValueOnce(mockResult);
    }

    return decryptResult;
}

module.exports = {
    mapMockApiResult: mapMockApiResult,
    mapMockDecryptResult: mapMockDecryptResult
}