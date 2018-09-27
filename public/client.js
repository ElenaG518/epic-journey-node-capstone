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


// this function can stay the same even when we
// are connecting to real API
// function getAndDisplayStatusUpdates() {
//     getRecentStatusUpdates(displayStatusUpdates);
// }

{
    /* <picture class="thumbnail">
                        <img src="${data.journeys[index].album[0].src}" alt="taking a stroll with dogs">
                    </picture> */
}

function displayHomeResults(data) {
    for (index in data.journeys) {
        $('.cards').append(
            `<article class="card">
            <a href="#">
                
                
                <div class="card-content">
                    <p>${data.journeys[index].title}</p>
                </div>
                <!-- .card-content -->
            </a>
        </article>`
        );
    }
}

function showHomePage() {
    getRecentStatusUpdates(displayHomeResults);
}

function getAndEditJourney() {
    getRecentStatusUpdates(editJourney);
}

function editJourney(data) {
    console.log(data.journeys[0]);
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
                        <textarea class='journal-text'>${data.journeys[0].description}</textarea>
                        <button role='button' type='submit' id='journal-text'>Submit</button>

                    </fieldset>
                </form>
        </div>`
    );
}

function displayJourney(data) {
    console.log("displayStatusUpdates function ran");
    // for (index in data) {
    console.log(data);
    $('.notebook').append(
        `<div class="journal-entry">
                    <h2>${data.title}</h2>
                    <p>${data.location}</p>
                    <p>${data.dates}<p>
                    <p>${data.description}</p>
             </div>`
    );

    // const album = [];
    // albumItems = data.album.length;
    // if (!(albumItems == 0)) {
    //     for (let i = 0; i < albumItems; i++) {
    //         album.push(`<img src="${data.album[i].src}">`);
    //     }
    // };
    // $('.dashboard').append(

    //     '<div class=\"album\">' + album + '</div>' +

    //     '<button class=\"add-pics\">Add Photos</button>'

    // );
};

$('.journey-form').submit(function(event) {
    event.preventDefault();
    console.log("journal entry form ran");
    const title = $('#title').val();
    const location = $('#location').val();
    const dates = $('#dates').val();
    const description = $('#description').val();

    // console.log(title, location, dates, entry);
    const journalObject = {
        title: title,
        location: location,
        dates: dates,
        description: description
    };
    console.log(journalObject);

    $.ajax({
            type: 'POST',
            url: '/journeys/create',
            dataType: 'json',
            data: JSON.stringify(journalObject),
            contentType: 'application/json'
        })
        .done(function(result) {
            console.log(result);
            displayJourney(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('something bad just happened at journals/create');
        });
});

// $('.dashboard').click('.add-pics', event => {
//     // event.preventDefault();
//     event.stopPropagation();
//     console.log("Add photos button pressed");
// });

// $('.notebook').click('#edit-journey', event => {
//     console.log("edit journey link pressed");
//     event.preventDefault();
// });

// $('.notebook').click('#delete-journey', event => {
//     console.log("delete journey link pressed");
//     event.preventDefault();
// });
// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn

// function getListofUsers(callbackFn) {
//     // we use a `setTimeout` to make this asynchronous
//     // as it would be with a real AJAX call.
//     setTimeout(function() { callbackFn(MOCK_USERS) }, 1);
// };

function getListofUsers(callbackFn) {
    console.log("getListofUsers function ran");
    $('.get-users').click(event => {
        console.log("getlistofusers function ran");
        $.ajax({
                type: 'GET',
                url: '/users',
                dataType: 'json',
                // data: JSON.stringify(userObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                console.log(result);
                callbackFn(result);
            })
            // if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Check your connection');
            });
    })
};

// this function stays the same when we connect
// to real API later
function displayUserList(data) {
    console.log("displauUserList function ran");
    for (index in data.users) {
        $('.users').append(
            `<div class="user">
            <p> ${data.users[index].firstName} ${data.users[index].lastName} </p>
            <p>  ${data.users[index].userName} </p></div>`

        );
    }
};

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayUsers() {
    getListofUsers(displayUserList);
}

// sign up API call
$('.signup-form').submit(function(event) {
    event.preventDefault();
    console.log("signup form ran");

    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const username = $('#username').val();
    const password = $('#password').val();
    // const passwordMatch = $('$password-match').val();

    //validate the input
    if (firstName == "") {
        alert('Please add a first name');
    } else if (lastName == "") {
        alert('Please add a last name');
    } else if (username == "") {
        alert('Please add an user name');
    } else if (password == "") {
        alert('Please add a password');
        // } else if (password !== passwordMatch) {
        //     alert('Password entries must match')
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newUserObject = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password
        };
        console.log(newUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function(result) {
                console.log(result);
            })
            //if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('OOPS can\'t connect');
            });
    }
});

// login API call
$('.login-form').submit(function(event) {
    event.preventDefault();
    console.log("login form ran");

    const username = $('#login-username').val();
    const password = $('#login-password').val();
    console.log(username);
    console.log(password);

    if (username == "") {
        alert('Please enter username');
    } else if (password == "") {
        alert('Please enter password');
    } else {

        const userObject = {
            username: username,
            password: password
        };
        console.log(userObject);
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(userObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                console.log(result);
            })
            // if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect Username or Password');
            });

    };
});

//  on page load do this
$(function() {
    // displayJourney();
    getAndDisplayUsers();
    // showHomePage();
    // getAndEditJourney();
})