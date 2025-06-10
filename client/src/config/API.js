import ENV from "./ENV";

export var INFO = {}

export async function UpdateInfo() {
    let response = await fetch(ENV.API_URL('info'))
    INFO = await response.json()
}