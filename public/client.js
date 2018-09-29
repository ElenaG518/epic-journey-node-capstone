'use strict';

let journey_id;
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
    $('.create-journey').removeClass('hide');
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
                alert('Incorrect Username or Password');
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
            <a href="#">
                
            
                <div class="card-content">
                    <p>${data.journeys[index].title}</p>
                    <p>${data.journeys[index].id}</p>
                    
                </div>
                <!-- .card-content -->
            </a>
        </article>`
        );
    }
}

// display journey after it has been created or when it has been clicked from the homepage
function displayJourney(data) {
    console.log("displayJourney function ran");
    $('.dashboard').removeClass('hide');
    $('.create-journey').hide();
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
    journey_id = "";
    console.log(journeyId);
    editJourney(journey_id);
});

// edit journey API call
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

// edit journey form
function displayEditJourneyForm(data) {
    console.log("displayEditJourneyForm function ran");
    $('.dashboard').hide();
    $('.edit-journey').append(
        `<h2>Editing ${data.title}</h2>
         <form class="edit-form">
            <fieldset >
                <legend>Edit Journey</legend>
                    <label for='title'>Title:</label>
                    <input type='text' id='title' name='title' value ="${data.title}" required>
                    <label for='location'>Location:</label>
                    <input type='text' id='location' name='location' value ="${data.location}" required>
                    <label for='dates'>Dates:</label>
                    <input type='text' id='dates' name='dates' value ="${data.dates}" required>
                    <label for='entry'>Journal Entry:</label>
                    <textarea class='journal-text'>${data.description}</textarea>
                    <button role='button' type='submit' class='journal-edit-btn'>Submit</button>
            </fieldset>
        </form>`
    );
};

// listener for form to edit journey
$('.edit-journey').on('click', 'journal-edit-btn', function(event) {
    event.preventDefault();
    console.log("journal-edit-btn has been pressed");

    const id = journey_id;
    const title = $('#title').val();
    const location = $('#location').val();
    const dates = $('#dates').val();
    const description = $('#description').val();
    const username = $('#loggedInUserName').val();

    const editJournalObject = {
        id: id,
        title: title,
        location: location,
        dates: dates,
        description: description,
        loggedInUserName: username
    };
    console.log(editJournalObject);

    // $.ajax({
    //         type: 'PUT',
    //         url: `/journeys/${id}`,
    //         dataType: 'json',
    //         data: JSON.stringify(editJournalObject),
    //         contentType: 'application/json'
    //     })
    //     .done(function(result) {
    //         console.log(result);
    //         displayJourney(result);
    //     })
    //     // if the call is failing
    //     .fail(function(jqXHR, error, errorThrown) {
    //         console.log(jqXHR);
    //         console.log(error);
    //         console.log(errorThrown);
    //         alert('something bad just happened at journals/create');
    //     });


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
    console.log(data[0]);
    for (index in data.users) {
        $('.users').append(
            `<div class ="user">
                <p>${data[index].firstName} ${ data[index].lastName }</p>
                <p>${ data[index].userName }</p></div>`

        );
    }
};


//  on page load do this
$(function() {

})