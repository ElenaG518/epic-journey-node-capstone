'use strict';

let journey_id;
let journey_title;

// SCROLLING HEADER
// function resizeHeaderOnScroll() {
//     const distanceY = window.pageYOffset || document.documentElement.scrollTop,
//         shrinkOn = 150,
//         headerEl = document.getElementById('js-header');
//     headerEl.classList.add("smaller");

//     if (distanceY > shrinkOn) {
//         headerEl.classList.add("smaller");
//     } else {
//         headerEl.classList.remove("smaller");
//     }
// }

// window.addEventListener('scroll', resizeHeaderOnScroll);

// home anchor
$('.home-anchor').click(event => {
    console.log("home anchor clicked");
    event.preventDefault();
    const username = $('#loggedInUserName').val();
    console.log(username);
    $('.journal-entry').empty();
    $('.cards').empty();
    $('.create-journey').hide();
    $('.edit-journey').empty().hide();
    $('#submit-image').removeClass('hide');
    $('#submit-journey').addClass('hide');

    getListOfJourneys(username);
});

// logout anchor
$('.logout-anchor').click(event => {
    console.log("logout anchor clicked");
    event.preventDefault();
    $('#loggedInUserName').val("");
    location.reload();
});

// form event listeners

$('.signup-anchor').click(event => {
    event.preventDefault();
    var headerHeight = $('.signup-form').height();
    console.log(headerHeight);
    console.log("got to sign up");
    $('.login-form').addClass('hide');
    $('.signup-form').removeClass('hide');
});

$('.login-anchor').click(event => {
    event.preventDefault();
    var headerHeight = $('.login-form').height();
    console.log(headerHeight);
    console.log("got to login");
    $('.signup-form').addClass('hide');
    $('.login-form').removeClass('hide');
});

$('.demo-anchor').click(event => {
    event.preventDefault();
    var headerHeight = $('.login-form').height();
    console.log(headerHeight);
    console.log("demo-anchor clicked");
    login("user", "pass");
});

$('.add-journey').click(event => {
    event.preventDefault();
    console.log("add journey button clicked");
    $('.create-journey').removeClass('hide').show();
    $('.homepage').hide();
    const title = $('#title').val("");
    const location = $('#location').val("");
    const startDates = $('#datepicker-start').val("");
    const endDates = $('#datepicker-end').val("");
    const description = $('#description').val("");
    const username = $('#loggedInUserName').val();
    $('.album-pic').empty();
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

    //validate the input
    if (firstName == "") {
        alert('Please add a first name');
    } else if (lastName == "") {
        alert('Please add a last name');
    } else if (username == "") {
        alert('Please add an user name');
    } else if (password == "") {
        alert('Please add a password');
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
            //if call is successfull
            .done(function(result) {
                $('#loggedInUserName').val(result.username);
                $('nav').removeClass('hide');
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
    const username = $('#login-username').val();
    const password = $('#login-password').val();
    login(username, password);
});    

function login(username, password) {
    if (username == "") {
        alert('Please enter username');
    } else if (password == "") {
        alert('Please enter password');
    } else {
        //create the payload object (what data we send to the api call)
        const userObject = {
            username: username,
            password: password
        };
        console.log(userObject);
        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(userObject),
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function(result) {
                $('#loggedInUserName').val(result.username);
                console.log(result.username);
                $('#js-header').addClass('smaller');
                $('nav').removeClass('hide');

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
};

// Journey API calls

$('#submit-image').click(function(event) {
    event.preventDefault();
    console.log("add image");
    addJourneyAlbumCover();
});

// CREATE journeys API call
$('.journey-form').submit(function(event) {
    event.preventDefault();
    // capture values for journey
    const title = $('#title').val();
    const location = $('#location').val();
    const startDates = $('#datepicker-start').val();
    const endDates = $('#datepicker-end').val();
    const description = $('#description').val();
    const username = $('#loggedInUserName').val();
    const album = $('#url').val();
    console.log("url ", album);
    //create the payload object (what data we send to the api call)
    const journalObject = {
        title: title,
        location: location,
        startDates: startDates,
        endDates: endDates,
        description: description,
        loggedInUserName: username, 
        album: album
    };
    console.log(journalObject);
    //make the api call using the payload above
    $.ajax({
            type: 'POST',
            url: '/journeys/create',
            dataType: 'json',
            data: JSON.stringify(journalObject),
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function(result) {
            console.log("success ", result);
            journey_id = result.id;
            journey_title = result.title;
            $('.journal-entry').empty();
            getJourneyById(journey_id, displayJourney);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert(`${error}`);
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
    //make the api call using the payload above
    $.ajax({
            type: 'GET',
            url: `/journeys/${username}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function(result) {
            console.log("getlist ", result);
            displayJourneys(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

// display all journeys to client
function displayJourneys(data) {
    console.log("fuction displayJourneys ran", data);
    $('.intro').hide();
    $('.homepage').removeClass('hide').show();
    if (!$('.dashboard').hasClass('hide')) {
        $('.dashboard').hide();
    };
    
    for (var index in data.journeys) {
        console.log("for", data.journeys[index]._id, data.journeys[index].title, data.journeys[index].album);
        createThumb(data.journeys[index]);
    }
}

// create thumbnails for the each journey displayed on homepage
function createThumb(item) {
    console.log("function createThumb", item);
    $('.cards').append(
        `<article class="card">
            <a href="#${item.title}" class="link-to-journey" id="${item.id}">
            <picture class="thumbnail">
                <img src="${item.album}" alt="${item.title}">
            </picture> 
            <div class="card-content">
            <p>${item.title}</p>
            </div>
            </a> 
            </article>`
    );
}

// API call to fetch only selected journey 
$('.cards').on('click', '.link-to-journey', event => {
    event.preventDefault();
    console.log("clicked it");
    journey_id = $(event.currentTarget).attr('id');
    console.log(journey_id);
    getJourneyById(journey_id, displayJourney);
});

function getJourneyById(journey_id, callback) {
    console.log("getJourneyById ran", journey_id);

    //make the api call using the payload above
    $.ajax({
            type: 'GET',
            url: `/journeys/id/${journey_id}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function(result) {
            console.log(result);
            $('.journal-entry').empty();
            callback(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Check your connection');
        });
};

// display journey after it has been created or when it has been clicked from the homepage
function displayJourney(data) {
    console.log("displayJourney function ran");
    $('.dashboard').removeClass('hide').show();
    $('.homepage').hide();
    $('.album').empty();
    $('.create-journey').hide();
    // get journey id in case of edit or delete
    journey_id = data.id;
    console.log(data);
    journey_title = `${data.title}`;
    $('.journal-entry').append(
        `<h2>${data.title}</h2>
         <p class="location">${data.location}</p>
         <p class="dates">${data.dates}</p>
         <p class = "description">${data.description}</p>
         `
    );
    $('.album').append (`<picture><img src="${data.album}" alt="${data.title}"></picture>`);
    // call function to get all images by the id of the journey
    getAllImages(journey_id);
}


// CREATE CLOUDINARY WIDGET TO UPLOAD PICTURES
$('#upload_widget_opener').click(event => {
    console.log("click upload_widget_opener");
    event.preventDefault();
    const username = $('#loggedInUserName').val();
    console.log("widget ", username, journey_id, journey_title);
    callCloudinary(username, journey_id, journey_title);
    
});

// call cloudinary via AddJourneyAlbumCover to change album cover
$('.album-pic').on('click', '.change-cover', event => {
    event.preventDefault();
    console.log("change-cover has been clicked");
    addJourneyAlbumCover();
})

function addJourneyAlbumCover() {
    cloudinary.openUploadWidget({ cloud_name: 'elenag518', upload_preset: 'pachirili', height: 300, width: 300, crop: "limit" },
        function(error, result) {
            console.log(error, result);
            $('#submit-image').addClass('hide');
            $('#submit-journey').removeClass('hide');
            }, false);

    // capture secure url for uploaded picture 
    $(document).on('cloudinarywidgetfileuploadsuccess', function(e, data) {
        const username = $('#loggedInUserName').val();
        console.log("Single file success", e, data);
        console.log("data secure url ", data.secure_url, username);
        $('#url').val("");
        $('#url').val(data.secure_url);
        const imgUrl= $('#url').val();
        console.log("url ", imgUrl);
        $('.album-pic').html(`
        <img src="${imgUrl}" class="album-confirm">
        <a href="#" class="change-cover">change album cover</a>`);
        
    });
    $(document).on('cloudinarywidgeterror', function(e, data) {
        console.log("Error", data);
    });
    $(document).on('cloudinarywidgetdeleted', function(e, data) {
        console.log("Public ID", data.public_id);
    });
    $(document).on('cloudinarywidgetclosed', function(e, data) {
        console.log("Widget closed", data);
    });
};


// add additional pictures to journeys
function callCloudinary(username, id, title) {
    console.log("callCloudinary ", username, id, title);
    cloudinary.openUploadWidget({ cloud_name: 'elenag518', upload_preset: 'pachirili', height: 300, width: 300, crop: "limit" },
        function(error, result) {
            console.log(error, result[0].secure_url);
            addPhotos(result[0].secure_url, username, id, title);
            }, false);

    $(document).on('cloudinarywidgetfileuploadsuccess', function(e, data) {
        console.log("Single file success", e, data);
        console.log("data secure url ", data.secure_url);
        
    });        
};

// add pictures for journeys to the database
function addPhotos(img_url, username, journey_id, journey_title) {
    console.log("Add photos funct", img_url, username, journey_id);
    const imgObject = {
        imgAddress: img_url,
        username: username,
        journeyId: journey_id,
        journeyTitle: journey_title
    };
    console.log(imgObject);
    //make the api call using the payload above
    $.ajax({
            type: "POST",
            url: `/journeys/add-img`,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(imgObject),
        })
        .done(function(result) {
            console.log(result);
            getJourneyById(journey_id, displayJourney);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            // alert('something bad just happened img');
        });
};

// API call to get all images in a journey

function getAllImages(journeyId) {
    console.log("function getAllImages", journeyId);
    //make the api call using the payload above
    $.ajax({
            type: 'GET',
            url: `/journeys/images/${journeyId}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(result) {
            console.log(result);
            displayAllImages(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayAllImages(imgArray) {
    console.log("function displayAllImages ", imgArray);
    const imgArrayString = [];
    for (let index in imgArray.images) {
        imgArrayString.push(`<picture>
            <img src="${imgArray.images[index].imgAddress}" alt="${imgArray.images[index].journeyTitle}">
            </picture>`);
    }
    console.log(imgArrayString);
    $('.album').append(imgArrayString);
}

function updateImageTitleId(journeyObjToUpdate) {
    console.log("updateImageTitleId", journeyObjToUpdate);
    const editImageTitle = {
        journeyId: journeyObjToUpdate.id,
        journeyTitle: journeyObjToUpdate.title
    };
    console.log(editImageTitle);
    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: `/journeys/update-img/${journeyObjToUpdate.id}`,
            dataType: 'json',
            data: JSON.stringify(editImageTitle),
            contentType: 'application/json'
        })
        // if the call is successful
        .done(function(result) {
            $('.journal-entry').empty();
            const username = $('#loggedInUserName').val();
            console.log(username);

            getJourneyById(journey_id, displayJourney);
            // getListOfJourneys(username);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);

        });
}


// EDIT journey

// edit journey anchor
$('.edit-journey-anchor').click(event => {
    console.log("edit journey clicked");
    event.preventDefault();
    const journeyId = journey_id;
    console.log(journeyId);
    $('.edit-journey').empty().show();
    $('.album').empty();
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
                    <label for="starting-date">Starting Date:</label> <input type="text" id="edit-datepicker-start" class="edit-start-dates" value=${data.startDates}></p>
                    <label>Ending Date:</label> <input type="text" id="edit-datepicker-end" class="edit-end-dates" value =${data.endDates}></p>
                    <label for='edit-description'>Journal Entry:</label>
                    <textarea class='edit-journal-text' id="edit-description" rows="10" cols="50">${data.description}</textarea>
                    <button role='button' type='submit' class='journal-edit-btn'>Submit</button>
            </fieldset>
        </form>`
    );
};

// listener for form to edit journey
$('.edit-journey').on('submit', '.edit-form', function(event) {
    event.preventDefault();
    console.log("journal-edit-btn has been pressed");
    $('.edit-journey').removeClass('hide').show();
    // capture values from form
    const id = journey_id;
    console.log("601", id);
    const title = $('#edit-title').val();
    const location = $('#edit-location').val();
    const startDates = $('.edit-start-dates').val();
    const endDates = $('.edit-end-dates').val();
    const description = $('#edit-description').val();
    const username = $('#loggedInUserName').val();
   

    // create paylode object
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
    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: `/journeys/update/${id}`,
            dataType: 'json',
            data: JSON.stringify(editJournalObject),
            contentType: 'application/json'
        })
        // if the call is successful
        .done(function(result) {
            $('.journal-entry').empty();
            const username = $('#loggedInUserName').val();
            console.log(username);
            $('.cards').empty();
            $('.edit-journey').hide();
            console.log("635", journey_id);
            getJourneyById(journey_id, updateImageTitleId);
            getListOfJourneys(username);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);

        });
});


// DELETE journey

// delete journey listener
$('.delete-journey-anchor').click(event => {
    console.log("delete journey clicked");
    event.preventDefault();
    const journeyId = journey_id;
    journey_id = "";
    console.log(journeyId);
    myFunction(journeyId);
});

function myFunction(journeyId) {
    var r = confirm("Are you sure you want to delete this journey?");
    if (r == true) {
        console.log("you pressed true");
        deleteJourney(journeyId);
        $('.album').empty();
    } else {
        console.log("You pressed Cancel!");
    }
}

// delete journey API call
function deleteJourney(id) {
    console.log(id);
    //make the api call to delete specific journey
    $.ajax({
            type: 'DELETE',
            url: `/journeys/${id}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        // if the call is successful
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