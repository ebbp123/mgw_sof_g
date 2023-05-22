import { Cookie } from "./helpers.js";

const fhirUrl = Cookie.get("fhir_url")
let token_data_cookie = Cookie.get('token_data')
const token_data = token_data_cookie != undefined ? JSON.parse(token_data_cookie) : null;

async function getPatient() {

    if (!token_data.access_token || !token_data.patient) {
        console.log('no access token or patient found in cookie')
        return
    }

    let response = await fetch(fhirUrl + '/Patient/' + token_data.patient, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token_data.access_token}`,
            "Cerner-Deployment-Config": 'ehr-sandbox'
        }
    })
    return await response.json()
}

const patchTestAddress = `[
    {
      "path": "/address/0/id",
      "op": "test",
      "value": "CI-25151561-0"
    }
]`;

// Only makes a test operation
async function patchPatient() {
    let response = await fetch(fhirUrl + '/Patient/' + token_data.patient, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/fhir+json',
            'Content-Type': 'application/json-patch+json',
            'Authorization': `Bearer ${token_data.access_token}`,
            'If-Match': 'W/"34"',
            "Cerner-Deployment-Config": 'ehr-sandbox'
        },
        body: patchTestAddress
    })

    return await response
}

getPatient().then((data) => {
    console.log(data)
    document.getElementById('mgw-data-url').textContent = fhirUrl + '/Patient/' + token_data.patient
    document.getElementById('mgw-data-content').textContent= JSON.stringify(data)
}).catch((err) => {
    debugger
    console.log('error fetching patient data')
})


patchPatient().then((response) => {
    console.log(response)
    document.getElementById('post-action').textContent = 'Patched Patient'
    document.getElementById('post-data-status').textContent= response.status
}).catch((err) => {
    debugger
    console.log('error patching patient')
})


