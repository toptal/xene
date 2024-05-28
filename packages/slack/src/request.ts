import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import { URLSearchParams } from 'url';

export function post(options): Promise<any> {
    return _request('POST', options);
}

export function get(options): Promise<any> {
    return _request('GET', options);
}

export function put(options): Promise<any> {
    return _request('PUT', options);
}

const request = {
    post,
    get,
    put
}
export { request }

async function _request(method, options): Promise<any> {
    let headers = { ...options.headers }

    let body = options.body
    if (options.form) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        body = new URLSearchParams(options.form)
    }
    else if (options.json && body) {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(body)
    }

    if (options.json) {
        headers['Accept'] = 'application/json'
    }

    let abortSignal = undefined
    let abortTimeout = undefined
    if (typeof options.timeout === 'number' && options.timeout > 0 && isFinite(options.timeout)) {
        const controller = new AbortController()
        abortTimeout = setTimeout(() => controller.abort(), options.timeout)
        abortSignal = controller.signal
    }

    let promise = fetch(options.uri, {
        method,
        headers,
        body,
        signal: abortSignal
    })

    try {
        const result = await promise
        return options.json ? result.json() : result
    } finally {
        if (abortTimeout !== undefined) {
            clearTimeout(abortTimeout)
        }
    }
}