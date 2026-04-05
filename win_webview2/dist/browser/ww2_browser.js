export async function callWw2(arg) {
    let response = await fetch("/ww2_post", {
        method: "POST",
        body: JSON.stringify(arg),
        headers: {
            "Content-Type": "application/json"
        },
    });
    let result = await response.json();
    return result;
}
