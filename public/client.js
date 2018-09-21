// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_STATUS_UPDATES = {
    "journeys": [{
            "id": "1111111",
            "title": "Oaxaca Linda",
            "location": "Oaxaca, Mexico",
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
                }
            ]
        },
        {
            "id": "2222222",
            "title": "Chiapas Linda",
            "location": "Chiapas, Mexico",
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
            }]
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
    setTimeout(function() { callbackFn(MOCK_STATUS_UPDATES) }, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.journeys) {
        $('body').append(
            '<p>' + data.journeys[index].title + '</p>',
            '<p>' + data.journeys[index].location + '</p>',
            '<p>' + data.journeys[index].description + '</p>',
            '<img src=\"' + data.journeys[index].album[0].src + '\" height="100">',
            '<img src=\"' + data.journeys[index].album[1].src + '\" height="100">'
        );
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

//  on page load do this
$(function() {
    getAndDisplayStatusUpdates();
})