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

class BadStatusCodeError extends Error {
    statusCode: number
    response: any

    constructor(response) {
        super(`Bad status code: ${response.status}`)
        this.statusCode = response.status
        this.response = response
    }
}

class FailedRequestError extends Error {
    cause: any
    code: string

    constructor(err) {
        super(`Request failed with code: ${err.code}`)
        this.cause = err
        this.code = err.code
    }
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

    try {
        const response = await fetch(uri, { method, headers, body, signal: timeoutSignal })
        if (response.status >= 400) {
            throw new BadStatusCodeError(response)
        }
        return json ? response.json() : response
    }
    catch (err) {
        throw new FailedRequestError(err)
    }
}
