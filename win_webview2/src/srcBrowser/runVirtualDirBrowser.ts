

export async function callVirtualDirFunction(arg: {
    funName: string,
    params: object

}) {

    let response = await fetch("/ww2_postmethod", {
        method: "POST",
        body: JSON.stringify(arg),
        headers: {
            "Content-Type": "application/json"
        },
    });

    let result = await response.json() as {
        err: string,
        data: object,
    }

    return result;
}