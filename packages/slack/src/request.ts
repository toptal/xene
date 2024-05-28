export function post(options) {
    return _request('POST', options);
}

export function get(options) {
    return _request('GET', options);
}

export function put(options) {
    return _request('PUT', options);
}

function _request(method, options) {
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
    if (options.timeout !== undefined) {
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

    if (abortTimeout !== undefined) {
        promise = promise.finally(() => clearTimeout(abortTimeout))
    }

    if (options.json) {
        return promise.then(response => response.json())
    }
    else {
        return promise
    }
}