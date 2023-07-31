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

async function getmetadata() {

  if (!token_data.access_token || !token_data.patient) {
      console.log('no access token or patient found in cookie')
      return
  }

  let response = await fetch(fhirUrl + '/metadata?_format=json', {
      headers: {
          'Accept': 'application/json',
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

const postPatientBody = `{
    "resourceType": "Patient",
    "identifier": [
      {
        "assigner": {
          "reference": "Organization/675844"
        }
      }
    ],
    "active": true,
    "name": [
      {
        "use": "official",
        "family": "CORS",
        "given": [
          "OCITEST"
        ],
        "period": {
          "start": "2010-05-17T14:54:31.000Z"
        }
      }
    ],
    "gender": "male",
    "birthDate": "2023-05-22",
  }`

async function postPatient() {
    let response = await fetch(fhirUrl + '/Patient', {
        method: 'POST',
        headers: {
            'Accept': 'application/fhir+json',
            'Content-Type': 'application/fhir+json',
            'Authorization': `Bearer ${token_data.access_token}`,
            "Cerner-Deployment-Config": 'ehr-sandbox'
        },
        body: postPatientBody
    })

    return await response
}


// getPatient().then((data) => {
//     console.log(data)
//     document.getElementById('mgw-data-url').textContent = fhirUrl + '/Patient/' + token_data.patient
//     document.getElementById('mgw-data-content').textContent= JSON.stringify(data)
// }).catch((err) => {
//     console.log('error fetching patient data')
// })

getmetadata().then((data) => {
  console.log(data)
  document.getElementById('mgw-data-url').textContent = fhirUrl + '/metadata?_format=json'
  document.getElementById('mgw-data-content').textContent= JSON.stringify(data)
}).catch((err) => {
  console.log('error fetching metadata')
})


// patchPatient().then((response) => {
//     console.log('Patient PATCH')
//     console.log(response)
//     document.getElementById('patch-action').textContent = 'Patched Patient'
//     document.getElementById('patch-data-status').textContent= 'Response: ' + response.status
// }).catch((err) => {
//     console.log('error patching patient')
// })

// postPatient().then((response) => {
//     console.log('Patient POST')
//     debugger
//     console.log(response)
//     document.getElementById('post-action').textContent = 'Created Patient'
//     document.getElementById('post-data-status').textContent= 'Response: ' + response.status
// }).catch((err) => {
//     console.log('error creating patient')
// })
