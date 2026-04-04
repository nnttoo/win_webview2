export async function callWw2(arg) {
    let response = await fetch("/ww2_post", {
        method: "POST",
        body: JSON.stringify(arg),
    });
    let result = await response.json();
    return result;
}
