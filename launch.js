import {Cookie} from "./helpers.js";
import {clientId, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

// const fhirUrl = urlParams.get('iss')
const fhirUrl = "https://lgo7vdpd7ufawgme7jgxyhs5f4.apigateway.us-ashburn-1.oci.customer-oci.com/dispatch/r4/dacc6494-e336-45ad-8729-b789ff8663c6"
Cookie.set('fhir_url', fhirUrl, {secure: true, "max-age": 3600})

const launchId = urlParams.get('launch')

async function getWellKnown() {
    let response = await fetch(fhirUrl + '/.well-known/smart-configuration', {
        headers: {
            Accept: 'application/json',
            "Cerner-Deployment-Config": 'ehr-sandbox'
        }
    })

    return await response.json()
}

function authorize(data) {
    //.replace
    let authEndpoint = data.authorization_endpoint;
    let token_endpoint = data.token_endpoint;
    Cookie.set('token_endpoint', token_endpoint, {secure: true, "max-age": 3600})

    debugger;

    let auth_location = `${authEndpoint}?` +
        "response_type=code&" +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURI(redirectUri)}&` +
        `launch=${launchId}&` +
        "scope=user%2FPatient.read%20launch%20fhirUser&" +
        "state=98wrghuwuogerg97&" +
        `aud=${fhirUrl}`
    location.assign(auth_location)
}


getWellKnown().then((data) => {
    authorize(data)
}).catch((err) => {
    debugger
    console.log('error fetching well-known')
})



