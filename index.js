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
            'Authorization': `Bearer ${token_data.access_token}`
        }
    })
    return await response.json()
}

getPatient().then((data) => {
    console.log(data)
    document.getElementById('mgw-data-url').textContent = fhirUrl + '/Patient/' + token_data.patient
    document.getElementById('mgw-data-content').textContent= JSON.stringify(data)
}).catch((err) => {
    debugger
    console.log('error fetching patient data')
})