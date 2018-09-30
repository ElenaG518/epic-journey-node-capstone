'use strict';

let journey_id;
const API_KEY = "448714965531915";
const IMG_UPLOAD_ENDPOINT = "https://api.cloudinary.com/v1_1/elenag518/image/upload";
const DOMAIN = window.location.origin;

// form event listeners

$('.signup-anchor').click(event => {
    event.preventDefault();
    console.log("got to sign up");
    $('.login-form').addClass('hide');
    $('.signup-form').removeClass('hide');
});

$('.login-anchor').click(event => {
    event.preventDefault();
    console.log("got to login");
    $('.signup-form').addClass('hide');
    $('.login-form').removeClass('hide');
});

$('.add-journey').click(event => {
    event.preventDefault();
    console.log("add journey button clicked");
    $('.create-journey').removeClass('hide').show();
    $('.homepage').hide();

});

// API calls to users router

// sign up API call to create user
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
                $('#loggedInUserName').val(result.username);
                getListOfJourneys(result.username);
                console.log(result);
            })
            //if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                const message = jqXHR.responseJSON.message;
                alert(message);
            });
    }
});

// login API call
$('.login-form').submit(function(event) {
    event.preventDefault();
    console.log("login form ran");

    const username = $('#login-username').val();
    const password = $('#login-password').val();
    // console.log(username);
    // console.log(password);

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
                $('#loggedInUserName').val(result.username);
                console.log(result.username);
                getListOfJourneys(result.username);
            })
            // if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                const message = jqXHR.responseJSON.message;
                alert(message);
            });

    };
});

// API calls to journeys router

// API call to create journeys
$('.journey-form').submit(function(event) {
    event.preventDefault();
    console.log("journal entry form ran");
    const title = $('#title').val();
    const location = $('#location').val();
    const dates = $('#dates').val();
    const description = $('#description').val();
    const username = $('#loggedInUserName').val();

    const journalObject = {
        title: title,
        location: location,
        dates: dates,
        description: description,
        loggedInUserName: username
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
            $('.journal-entry').empty();
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

// make API call to database for Journeys and send results to callback
// function to be displayed to client
function getListOfJourneys(username) {
    console.log("getListOfJourneys function ran")
    if ((username == "") || (username == undefined) || (username == null)) {
        username = $('#loggedInUserName').val();
    }

    console.log(username);
    $.ajax({
            type: 'GET',
            url: `/journeys/${username}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(result) {
            console.log(result);
            displayJourneys(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Check your connection');
        });
}

// display all journeys to client
function displayJourneys(data) {
    $('.intro').hide();
    $('.homepage').removeClass('hide').show();
    if (!$('.dashboard').hasClass('hide')) {
        $('.dashboard').hide();
    };
    for (var index in data.journeys) {
        $('.cards').append(
            `<article class="card">
            <a href="#" class="link-to-journey" id="${data.journeys[index].id}">
                
            
                <div class="card-content">
                    <p>${data.journeys[index].title}</p>
                    <p>${data.journeys[index].id}</p>
                    
                </div>
                
            </a>
        </article>`
        );
    }
}

$('.cards').on('click', '.link-to-journey', event => {
    event.preventDefault();
    console.log("clicked it");
    journey_id = $(event.currentTarget).attr('id');
    console.log(journey_id);
    $.ajax({
            type: 'GET',
            url: `/journeys/id/${journey_id}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(result) {
            console.log(result);
            $('.journal-entry').empty();
            displayJourney(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Check your connection');
        });
})

// display journey after it has been created or when it has been clicked from the homepage
function displayJourney(data) {
    console.log("displayJourney function ran");
    $('.dashboard').removeClass('hide').show();
    $('.homepage').hide();

    $('.create-journey').hide();
    // get journey id in case of edit or delete
    journey_id = data.id;
    console.log(data);
    console.log(journey_id);

    $('.notebook').append(
        `<div class="journal-entry">
                    <h2>${data.title}</h2>
                    <p class="location">${data.location}</p>
                    <p class="dates">${data.dates}<p>
                    <p class = "description">${data.description}</p>
             </div>`
    );



    // const album = [];

    // for (index in data.photos) {
    //  album.push(`<img src="${data.album[i].src}">`);
    //     }
    // $('.dashboard').append(

    //     '<div class=\"album\">' + album + '</div>' +

    //     '<button class=\"add-pics\">Add Photos</button>'

    // );
};



// $('.dashboard').click('.add-pics', event => {
//     // event.preventDefault();
//     event.stopPropagation();
//     console.log("Add photos button pressed");
// });



// Journey anchors and API calls

// home anchor
$('.home-anchor').click(event => {
    console.log("home anchor clicked");
    $('.journal-entry').empty();
    event.preventDefault();
    const username = $('#loggedInUserName').val();
    console.log(username);
    $('.cards').empty();
    getListOfJourneys(username);
});


// DELETE journey

// delete journey listener
$('.delete-journey-anchor').click(event => {
    console.log("delete journey clicked");
    event.preventDefault();
    const journeyId = journey_id;
    journey_id = "";
    console.log(journeyId);
    deleteJourney(journeyId);
});

// delete journey API call
function deleteJourney(id) {
    console.log(id);
    $.ajax({
            type: 'DELETE',
            url: `/journeys/${id}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(message) {
            const username = $('#loggedInUserName').val();
            console.log(username);
            $('.cards').empty();
            getListOfJourneys(username);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('could not delete journey');
        });

}

// edit journey anchor
$('.edit-journey-anchor').click(event => {
    console.log("edit journey clicked");
    event.preventDefault();
    const journeyId = journey_id;
    // journey_id = "";
    console.log(journeyId);
    editJourney(journeyId);
});

// fetch journey to edit API call
function editJourney(id) {
    console.log("editJourney function ran");
    console.log(id);
    $.ajax({
            type: 'GET',
            url: `/journeys/edit/${id}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(result) {
            console.log(result);
            displayEditJourneyForm(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('something bad just happened at journals/create');
        });
};

// edit journey form poplulated with result from editJourney function
function displayEditJourneyForm(data) {
    console.log("displayEditJourneyForm function ran");
    $('.dashboard').hide();
    $('.edit-journey').append(
        `<h2>Editing ${data.title}</h2>
         <form class="edit-form">
            <fieldset >
                <legend>Edit Journey</legend>
                    <label for='edit-title'>Title:</label>
                    <input type='text' id='edit-title' name='title' value ="${data.title}" >
                    <label for='edit-location'>Location:</label>
                    <input type='text' id='edit-location' name='location' value ="${data.location}" >
                    <p>Starting Date: <input type="text" id="datepicker" class="edit-start-dates"></p>
                    <p>Ending Date: <input type="text" id="datepicker" class="edit-end-dates"></p>
                    <label for='edit-description'>Journal Entry:</label>
                    <textarea class='journal-text' id="edit-description">${data.description}</textarea>
                    <button role='button' type='submit' class='journal-edit-btn'>Submit</button>
            </fieldset>
        </form>`
    );
};

// listener for form to edit journey
$('.edit-journey').on('submit', '.edit-form', function(event) {
    event.preventDefault();
    console.log("journal-edit-btn has been pressed");

    const id = journey_id;
    const title = $('#edit-title').val();
    const location = $('#edit-location').val();
    const startDates = $('#edit-start-dates').val();
    const endDates = $('#edit-end-dates').val();
    const description = $('#edit-description').val();
    const username = $('#loggedInUserName').val();

    const editJournalObject = {
        title: title,
        location: location,
        startDates: startDates,
        endDates: endDates,
        description: description,
        loggedInUserName: username,
        id: id
    };
    console.log(editJournalObject);

    $.ajax({
            type: 'PUT',
            url: `/journeys/update/${id}`,
            dataType: 'json',
            data: JSON.stringify(editJournalObject),
            contentType: 'application/json'
        })
        .done(function(result) {
            $('.journal-entry').empty();
            const username = $('#loggedInUserName').val();
            console.log(username);
            $('.cards').empty();
            $('.edit-journey').hide();
            getListOfJourneys(username);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);

        });
});




// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
$('.get-users').click(event => {
    event.preventDefault();
    console.log("getlistofusers function ran");
    $.ajax({
            type: 'GET',
            url: '/users',
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(result) {
            console.log(result);
            displayUserList(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Check your connection');
        });
});

// this function stays the same when we connect
// to real API later
function displayUserList(data) {
    console.log("displayUserList function ran");
    console.log(data);
    for (var index in data) {
        $('.users').append(
            `<div class ="user">
                <p>${data[index].firstName} ${ data[index].lastName }</p>
                <p>${ data[index].username }</p></div>`

        );
    }
};

$(function() {
    $("#datepicker").datepicker();
});