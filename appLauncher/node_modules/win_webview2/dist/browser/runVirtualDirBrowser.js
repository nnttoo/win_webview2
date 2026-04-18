export async function callVirtualDirFunction(arg) {
    let response = await fetch("/ww2_postmethod", {
        method: "POST",
        body: JSON.stringify(arg),
        headers: {
            "Content-Type": "application/json"
        },
    });
    let result = await response.json();
    return result;
}
