import fetch from 'node-fetch'
import { URLSearchParams } from 'url';

function post(options): Promise<any> {
    return request('POST', options);
}

function get(options): Promise<any> {
    return request('GET', options);
}

function put(options): Promise<any> {
    return request('PUT', options);
}

export default { post, get, put }

function sanitizeTimeout(timeout) {
    if (typeof timeout === 'number' && timeout > 0 && isFinite(timeout)) {
        return timeout
    }
    return undefined
}

async function request(method, { uri, headers, body, form, json, timeout }): Promise<any> {
    headers = { ...headers }

    if (form) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        body = new URLSearchParams(form)
    }
    else if (json && body) {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(body)
    }

    if (json) {
        headers['Accept'] = 'application/json'
    }

    timeout = sanitizeTimeout(timeout)
    const timeoutSignal = timeout && AbortSignal.timeout(timeout)

    const result = await fetch(uri, { method, headers, body, signal: timeoutSignal })
    return json ? result.json() : result
}
