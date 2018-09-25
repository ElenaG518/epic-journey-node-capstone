'use strict'

// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_JOURNEY_ENTRIES = {
    "journeys": [{
            "id": "1111111",
            "title": "Oaxaca Linda",
            "location": "Oaxaca, Mexico",
            "dates": "Sept 12 - Sept 28, 2018",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "album": [{
                    "photoid": "1234",
                    "src": "images/pic1.jpg",
                    "caption": "so pretty"
                },
                {
                    "photoid": "567",
                    "src": "images/pic2.jpg",
                    "caption": "so prettier"
                },
                {
                    "photoid": "35456",
                    "src": "images/pic7.jpg",
                    "caption": "sublime"
                },
                {
                    "photoid": "764832",
                    "src": "images/pic8.jpg",
                    "caption": "ultimate"
                }
            ]
        },
        {
            "id": "2222222",
            "title": "Chiapas Linda",
            "location": "Chiapas, Mexico",
            "dates": "Aug 12 - Aug 28, 2018",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "album": [{
                    "photoid": "1234",
                    "src": "images/pic3.jpg",
                    "caption": "even better"
                },
                {
                    "photoid": "567",
                    "src": "images/pic4.jpg",
                    "caption": "better than the last one"
                }
            ]
        },
        {
            "id": "3333333",
            "title": "Yucatan Linda",
            "location": "Yucatan, Mexico",
            "dates": "Jul 12 - Jul 28, 2018",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "album": [{
                    "photoid": "4523",
                    "src": "images/pic5.jpg",
                    "caption": "gorgeous"
                },
                {
                    "photoid": "7648",
                    "src": "images/pic6.jpg",
                    "caption": "nothing compares"
                }
            ]
        },
        {
            "id": "4444444",
            "title": "Guatemala Linda",
            "location": "Guatemala, Guatemala",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "album": [{
                    "photoid": "35456",
                    "src": "images/pic7.jpg",
                    "caption": "sublime"
                },
                {
                    "photoid": "764832",
                    "src": "images/pic8.jpg",
                    "caption": "ultimate"
                }
            ]
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentStatusUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function() { callbackFn(MOCK_JOURNEY_ENTRIES) }, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    // for (index in data.journeys) {
    $('.notebook').append(
        `<div class="journal-entry">
                <h2>${data.journeys[0].title}</h2>
                <p>${data.journeys[0].location}</p>
                <p>${data.journeys[0].dates}<p>
                <p>${data.journeys[0].description}</p>
         </div>`
    );
    $('.dashboard').append(
        `<div class="album">
            <img src="${data.journeys[0].album[0].src}">
            <img src="${data.journeys[0].album[1].src}"> 
            <img src="${data.journeys[0].album[2].src}">
            <img src="${data.journeys[0].album[3].src}">
        </div>
        <button class='add-pics'>Add Photos</button>
        `
    );
    // }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

function displayHomeResults(data) {
    for (index in data.journeys) {
        $('.cards').append(
            `<article class="card">
            <a href="#">
                
                <picture class="thumbnail">
                    <img src="${data.journeys[index].album[0].src}" alt="taking a stroll with dogs">
                </picture>
                <div class="card-content">
                    <p>${data.journeys[index].title}</p>
                </div>
                <!-- .card-content -->
            </a>
        </article>`
        );
    }

    // $('.cards').append(`
    //     <article class="card">
    //         <a href="#">

    //             <picture class="thumbnail">
    //                 <img src="images/img.png" alt="add journey" class="img-placeholder">
    //             </picture>
    //             <div class="card-content">
    //                 <p>Add Journey</p>
    //             </div>
    //         </a>
    //     </article> `);
}

function showHomePage() {
    getRecentStatusUpdates(displayHomeResults);
}

function getAndEditJourney() {
    getRecentStatusUpdates(editJourney);
}

function editJourney(data) {
    $('.edit-journey').append(
        `<div class="edit-entry">
                <h2>Editing journey ${data.journeys[0].title}</h2>
                <form>
                    <fieldset class='edit-journey '>
                        <legend>Edit Journey</legend>
                        <label for='title'>Title:</label>
                        <input type='text' id='title' name='title' value ="${data.journeys[0].title}" required>
                        <label for='location'>Location:</label>
                        <input type='text' id='location' name='location' value ="${data.journeys[0].location}" required>
                        <label for='dates'>Dates:</label>
                        <input type='text' id='dates' name='dates' value ="${data.journeys[0].dates}" required>
                        <label for='entry'>Journal Entry:</label>
                        <textarea class='journal-text' value ="${data.journeys[0].description}"></textarea>
                        <button role='button' type='submit' id='journal-text'>Submit</button>
                        
                    </fieldset>
                </form>
        </div>`
    );
}

// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_USERS = {
    "users": [{
            "id": "1111111",
            "firstName": "Pera",
            "lastName": "Olin",
            "userName": "linda",
            "password": "secret"
        },
        {
            "id": "2222222",
            "firstName": "Elena",
            "lastName": "Granados",
            "userName": "awesome",
            "password": "secret2"
        },
        {
            "id": "3333333",
            "firstName": "Kenji",
            "lastName": "Hawley",
            "userName": "locote",
            "password": "secretote"
        }
    ]
};


// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getListofUsers(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function() { callbackFn(MOCK_USERS) }, 1);
}

// this function stays the same when we connect
// to real API later
function displayUserList(data) {
    for (index in data.users) {
        $('.users').append(
            `<div class="user">
            <p> ${data.users[index].firstName} ${data.users[index].lastName} </p>
            <p>  ${data.users[index].userName} </p></div>`

        );
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayUsers() {
    getListofUsers(displayUserList);
}

//  on page load do this
$(function() {
    getAndDisplayStatusUpdates();
    getAndDisplayUsers();
    showHomePage();
    getAndEditJourney();
})