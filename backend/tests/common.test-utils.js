function mapMockApiResult(mockResult, mockBoolean, mockErrorMsg = null) {
    let apiResult = null;
    // TODO(yqni13): implement further api mocking
    if(mockErrorMsg) {
        apiResult = jest.fn().mockRejectedValueOnce(new Error(mockErrorMsg));
    }

    return apiResult;
}

module.exports = {
    mapMockApiResult: mapMockApiResult
}