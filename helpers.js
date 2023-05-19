export const Cookie = {
    get: (e) => {
        e = document.cookie.match(new RegExp("(?:^|; )" + e.replace(/([.$?*|{}()[\]\\/+^])/g, "$1") + "=([^;]*)"));
        return e ? decodeURIComponent(e[1]) : void 0
    },
    set: (e, n, o = {}) => {
        o = {path: "/", ...o}, o.expires instanceof Date && (o.expires = o.expires.toUTCString());
        let c = unescape(encodeURIComponent(e)) + "=" + unescape(encodeURIComponent(n));
        for (var t in o) {
            c += "; " + t;
            var a = o[t];
            !0 !== a && (c += "=" + a)
        }
        document.cookie = c
    },
    rem: (e) => {
        Cookie.set(e, "", {"max-age": -1})
    }
}

export function getWwwFormUrlEncodedData(data) {
    let formBody = [];
    for (let property in data) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}