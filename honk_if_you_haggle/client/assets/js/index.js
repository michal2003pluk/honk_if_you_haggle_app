/* eslint-disable space-before-function-paren */
const endpointRoot = 'http://127.0.0.1:8080/';

// Clears all cards currently present in the card-layout
function clearCardLayout() {
    const carListElt = document.getElementById('carList');
    carListElt.innerHTML = '';
}

/*
 Makes a fetch request to server to get all car data
 Loads data about each car into a template card
 Appends each card into the card-layout
 Code from: https://web.dev/fetch-api-error-handling/
*/
async function loadCars() {
    let data;

    // Make the GET request and handle errors
    try {
        const response = await fetch(endpointRoot + 'cars/');
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // Unexpected token < in JSON
            console.log('There was a SyntaxError', error);
        } else {
            console.log('There was an error', error);
        }
    }

    // Handle the case where data was fetched successfully
    if (data) {
        clearCardLayout();

        const carListElt = document.getElementById('carList');

        const templateContent = document.getElementById('carCardTemplate').content;

        // Create a card for each car in data
        for (const key in data) {
            const carData = data[key];

            // Copy the HTML from the template in index.html
            const copyHTML = document.importNode(templateContent, true);

            // Modify each part in the template with the appropriate data
            copyHTML.querySelector('.card-car-title').textContent = carData.make + ' ' + carData.model;
            copyHTML.querySelector('.card-car-year').innerHTML = `<strong>Year: </strong> ${carData.year}`;
            copyHTML.querySelector('.card-car-mileage').innerHTML = `<strong>Mileage: </strong> ${carData.mileage}`;
            copyHTML.querySelector('.card-car-price').textContent = `£${carData.price}`;
            copyHTML.querySelector('.card-car').id = 'carID:' + key;

            // Append card to the card-layout
            carListElt.appendChild(copyHTML);
        }

        // Attach an on-click event-listener to each so that its id is logged to console when clicked
        const listItems = carListElt.querySelectorAll('.card-car');
        for (const listItem of listItems) {
            listItem.addEventListener('click', (event) => {
                const id = listItem.id.split(':')[1];
                console.log(id);
                loadCar(id);
            });
        }
    }
}

// Loads different page which shows details about the spcific car clicked
async function loadCar(id) {
    const websiteBody = document.getElementById('mainWebsiteBody');
    const oneCarViewBody = document.getElementById('oneCarViewBody');

    // Visually hide main website body
    websiteBody.classList.add('visually-hidden');
    oneCarViewBody.classList.remove('visually-hidden');

    let data;

    // Make the GET request and handle errors
    try {
        const response = await fetch(endpointRoot + 'cars/' + id);
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // Unexpected token < in JSON
            console.log('There was a SyntaxError', error);
        } else {
            console.log('There was an error', error);
        }
    }

    // Handle the case where data was fetched successfully
    if (data) {
        // const oneCarViewImage = document.getElementById('oneCarViewImage');
        const oneCarViewCarTitle = document.getElementById('oneCarViewCarTitle');
        const oneCarViewBuyPrice = document.getElementById('oneCarViewBuyPrice');
        const oneCarViewBidPrice = document.getElementById('oneCarViewBidPrice');
        const lblNumberOfBids = document.getElementById('lblNumberOfBids');
        const oneCarViewMake = document.getElementById('oneCarViewMake');
        const oneCarViewModel = document.getElementById('oneCarViewModel');
        const oneCarViewYear = document.getElementById('oneCarViewYear');
        const oneCarViewMileage = document.getElementById('oneCarViewMileage');
        const oneCarViewColour = document.getElementById('oneCarViewColour');

        // oneCarViewImage.src = data.image;
        oneCarViewCarTitle.innerText = capitalise(data.make + ' ' + data.model);
        oneCarViewBuyPrice.innerText = data.price;

        oneCarViewMake.innerText = capitalise(data.make);
        oneCarViewModel.innerText = capitalise(data.model);
        oneCarViewYear.innerText = data.year;
        oneCarViewMileage.innerText = data.mileage;
        oneCarViewColour.innerText = capitalise(data.color);
    }
}

function capitalise(str) {
    const arr = str.split(' ');
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(' ');
}

// All the input DOM element in the modal begin with validationModal
// These are the suffixes that go after this prefix
const modalInputElmtNames = ['Image', 'Make', 'Model', 'Year', 'Mileage', 'Colour', 'Price'];

function attachModalEventListeners() {
    attachValidationListeners();
    attachClearButtonListener();
    attachSubmitButtonListener();
}

function attachValidationListeners() {
    for (let i = 0; i < modalInputElmtNames.length; i++) {
        // Get the specific DOM input element
        const elementString = 'validationModal' + modalInputElmtNames[i];
        const element = document.getElementById(elementString);

        element.addEventListener('input', (event) => {
            checkInputElementValidity(element);
        });
    }
}

// Changes the validity of a given input DOM element depending on its current value
function checkInputElementValidity(inputElmt) {
    // Determine which RegEx literal should be used depending on the id of the inputElmt
    let regex = '';
    switch (inputElmt.id) {
        case 'validationModalImage':
            regex = /^.+\.(png|jpg|jpeg|webp)$/;
            break;
        case 'validationModalMake':
        case 'validationModalColour':
            regex = /^(?=\S)[A-Za-z\s]+$/;
            break;
        case 'validationModalModel':
            regex = /^(?=\S)[A-Za-z\d\s]+$/;
            break;
        case 'validationModalYear':
        case 'validationModalMileage':
            regex = /^\d+(,\d{3})*$/;
            break;
        case 'validationModalPrice':
            regex = /^\d+(,\d{3})*(\.\d{1,2})?$/;
            break;
        default:
            console.log('Unimplemented id: ', inputElmt.id);
    }

    const valid = regex.test(inputElmt.value.trim());

    if (valid) {
        inputElmt.classList.remove('is-invalid');
        inputElmt.classList.add('is-valid');
    } else {
        inputElmt.classList.remove('is-valid');
        inputElmt.classList.add('is-invalid');
    }

    return valid;
}

function allInputElmtsValid() {
    let counter = 0;
    for (let i = 0; i < modalInputElmtNames.length; i++) {
        // Get the specific DOM input element
        const elementString = 'validationModal' + modalInputElmtNames[i];
        const element = document.getElementById(elementString);

        if (checkInputElementValidity(element)) {
            counter++;
        }
    }

    return counter === modalInputElmtNames.length;
}

// Attaches on-click listener to the clear button in the modal
function attachClearButtonListener() {
    const btnClear = document.getElementById('btnModalClear');

    btnClear.addEventListener('click', (event) => {
        for (let i = 0; i < modalInputElmtNames.length; i++) {
            // Get the specific DOM input element
            const elementString = 'validationModal' + modalInputElmtNames[i];
            const element = document.getElementById(elementString);

            // Clear value and reset validity feedback
            element.value = '';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        }
    });
}

async function attachSubmitButtonListener() {
    const newCarForm = document.getElementById('newCarForm');
    const btnSubmit = document.getElementById('btnModalSubmit');

    btnSubmit.addEventListener('click', async function (event) {
        if (allInputElmtsValid()) {
            // eslint-disable-next-line no-undef
            const data = new FormData(newCarForm);

            // Convert from FormData to JSON
            // https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
            let dataJSON = JSON.stringify(Object.fromEntries(data));
            console.log(dataJSON);

            // Remove all unnecessary whitespace
            // https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
            dataJSON = dataJSON.replace(/ +/g, '');
            console.log(dataJSON);

            // eslint-disable-next-line no-unused-vars
            const response = await fetch(endpointRoot + 'cars/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });
            loadCars();
        } else {
            console.log('Some inputs are invalid');
        }
    });
}

// Purpose: Load all cars into card-layout when DOM loads
document.addEventListener('DOMContentLoaded', loadCars);

// Purpose: Attach modal on-click event listeners
document.addEventListener('DOMContentLoaded', attachModalEventListeners);
