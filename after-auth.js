import {Cookie, getWwwFormUrlEncodedData} from "./helpers.js";
import {clientId, indexUri, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code')
const state = urlParams.get('state')

const tokenEndpoint = Cookie.get("token_endpoint")
const fhirUrl = Cookie.get("fhir_url")

var accessTokenPostBody = {
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': clientId,
    'redirect_uri': redirectUri
};

async function getAccessToken() {
    let response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: getWwwFormUrlEncodedData(accessTokenPostBody)
    })
    let token = await response.json()
    return token
}

Cookie.rem('token_data')
getAccessToken().then((data) => {
    debugger
    if (data.error) {
        console.log('error fetching token' + data.error_uri)
        return
    }

    Cookie.set('token_data', JSON.stringify(data), {secure: true, "max-age": 900})
    location.assign(indexUri)

}).catch((err) => {
    debugger
    console.log('error fetching access token')
})