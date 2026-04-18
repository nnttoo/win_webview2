import { byteArrayFromString, byteArrayToString, InternalFunctionResult, InternalFunctionResultPromise } from "./util";

type PostData = {
    funName : string,
    params : object
}

export async function checkMapFunction(
    arg: {
        mapfunction: { [key: string]: (msg: object) => Promise<object> },
        body: Uint8Array,
        method: string,
        path: string,
    }
) : InternalFunctionResultPromise {

    if (arg.path != "/ww2_postmethod") return null;
    if (arg.method != "POST") return null;
    if (arg.body == null) return null;



    let jsonResponse : {
        data : object | null,
        error : any,
    }  = {
        data : null,
        error :  null
    }


    try {

        let bodyString = byteArrayToString(arg.body);
        let bodyObject = JSON.parse(bodyString) as PostData;
        if(bodyObject.funName == null || bodyObject.funName == "") throw "no method name";
        if(!arg.mapfunction[bodyObject.funName]) throw "no method match";

        jsonResponse.data = await arg.mapfunction[bodyObject.funName](bodyObject.params);

        
    } catch (error) {
        jsonResponse.error = error;
    }


    let serverResponse : InternalFunctionResult | null = null;

    try {

        let responseText = JSON.stringify(jsonResponse);
        serverResponse = {
            content : byteArrayFromString(responseText),
            contentType : "application/json"
        }
        
    } catch (error) {
        console.log(error);
    }

    return serverResponse;
}