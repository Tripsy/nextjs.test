// export const getQueryParams = function () {
//     return (new URL(window.location.href)).searchParams
// }
//
// export const getQueryParam = function (name) {
//     return getQueryParams().get(name)
// }

function getCookieDomainPart(domain?: string) {
    if (domain) {
        return ';domain=' + domain;
    }

    return ';domain=.' + document.location.host;
}

export const setCookie = function (name: string, value: string, expireSeconds: number = 86400, domain?: string) {
    let expires = '';

    if (expireSeconds) {
        let date = new Date();

        date.setTime(date.getTime() + expireSeconds * 1000);

        expires = '; expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + encodeURIComponent(value || '') + expires + getCookieDomainPart(domain) + ';path=/';

    return;
}

export const readCookie = function(name: string): string | null {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1];

    if (cookieValue) {
        return decodeURIComponent(cookieValue);
    }

    return null;
}

export const removeCookie = function (name: string, domain?: string) {
    document.cookie = name + `=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${getCookieDomainPart(domain)}`;
};

// // path = `value` OR `nested.value`
// export const getObjectValue = function (object, path) {
//     const keys = path.split('.')
//     let result = object
//
//     for (let key of keys) {
//         result = result[key]
//
//         if (result === undefined) {
//             return undefined
//         }
//     }
//
//     return result
// }
//
// export const setObjectValue = function (object, path, value) {
//     const keys = path.split('.')
//     let result = object
//
//     for (let i = 0; i < keys.length - 1; i++) {
//         const key = keys[i]
//
//         if (result[key] === undefined) {
//             result[key] = {} // Create nested object if it doesn't exist
//         }
//
//         result = result[key]
//     }
//
//     result[keys[keys.length - 1]] = value
// }
//
// export const getFirstElementFromArray = function (a: []) {
//     return a.at(0)
// }
//
// export const getLastElementFromArray = function (a) {
//     return a.at(-1)
// }
//
// export const isViewportMobile = function () {
//     return window.matchMedia('(max-width: 767px)').matches
// }
