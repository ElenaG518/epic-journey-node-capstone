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