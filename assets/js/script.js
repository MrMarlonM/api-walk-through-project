const API_KEY = "oaJsLvlXqxjjJE6WBbSVFMNd3DY";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));
    
    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                    "Authorization": API_KEY,
            },
                                    body: form,  
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayExeption(data);
        throw new Error(data.error);
    }
}

function displayExeption(data) {
    heading = "An Exeption Occured";
    let error = `<div>The API returned status code ${data.status_code}</div>`;
    error += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    error += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById('resultsModalTitle').textContent = heading;
    document.getElementById('results-content').innerHTML = error;
    resultsModal.show();
}

function displayErrors(data) {

    heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
    }   for (let error of data.error_list) {
        results += `<div>At line <span>${error.line}</span>,`;
        results += `column<span class="column">${error.col}</span>`;
        results += `<div class="error">${error.error}</div>`;
    }

    document.getElementById('resultsModalTitle').textContent = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayExeption(data);
        throw new Error(data.error);
    }
};

function displayStatus(data) {
    
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`
    
    document.getElementById('resultsModalTitle').textContent = heading;
    document.getElementById('results-content').innerHTML = results;
    
    resultsModal.show();
};
