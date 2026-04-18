"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMapFunction = checkMapFunction;
const util_1 = require("./util");
async function checkMapFunction(arg) {
    if (arg.path != "/ww2_postmethod")
        return null;
    if (arg.method != "POST")
        return null;
    if (arg.body == null)
        return null;
    let jsonResponse = {
        data: null,
        error: null
    };
    try {
        let bodyString = (0, util_1.byteArrayToString)(arg.body);
        let bodyObject = JSON.parse(bodyString);
        if (bodyObject.funName == null || bodyObject.funName == "")
            throw "no method name";
        if (!arg.mapfunction[bodyObject.funName])
            throw "no method match";
        jsonResponse.data = await arg.mapfunction[bodyObject.funName](bodyObject.params);
    }
    catch (error) {
        jsonResponse.error = error;
    }
    let serverResponse = null;
    try {
        let responseText = JSON.stringify(jsonResponse);
        serverResponse = {
            content: (0, util_1.byteArrayFromString)(responseText),
            contentType: "application/json"
        };
    }
    catch (error) {
        console.log(error);
    }
    return serverResponse;
}
