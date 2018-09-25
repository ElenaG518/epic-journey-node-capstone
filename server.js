'use strict';
require('dotenv').config();
const { User } = require('./users/models');
const Entry = require('./models/entry');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const moment = require('moment');
const cors = require('cors');

const express = require('express');
const router = express.Router();
const app = express();
const morgan = require('morgan');

// const bcrypt = require('bcryptjs');
const passport = require('passport');
// const BasicStrategy = require('passport-http').BasicStrategy;
// const { router: usersRouter } = require('./users');
const usersRouter = require('./users/router');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const authRouter = require('./auth/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
// app.get('/api/protected', jwtAuth, (req, res) => {
//     return res.json({
//         data: 'rosebud'
//     });
// });



const { PORT, DATABASE_URL } = require('./config');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


app.use(morgan(':remote-addr - :remote-user :date[web] :method :url :response-time '));
// app.use(morgan(':date :method :url :response-time'));

mongoose.Promise = global.Promise;






// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {

    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

// ---------------USER ENDPOINTS-------------------------------------
// POST -----------------------------------
// creating a new user
// app.post('/users/create', (req, res) => {

//     //take the name, username and the password from the ajax api call
//     let firstName = req.body.firstName;
//     let lastName = req.body.lastName;
//     let username = req.body.username;
//     let password = req.body.password;

//     //exclude extra spaces from the username and password
//     username = username.trim();
//     password = password.trim();

//     //create an encryption key
//     bcrypt.genSalt(10, (err, salt) => {

//         //if creating the key returns an error...
//         if (err) {

//             //display it
//             return res.status(500).json({
//                 message: 'Internal server error'
//             });
//         }

//         //using the encryption key above generate an encrypted pasword
//         bcrypt.hash(password, salt, (err, hash) => {

//             //if creating the ncrypted pasword returns an error..
//             if (err) {

//                 //display it
//                 return res.status(500).json({
//                     message: 'Internal server error'
//                 });
//             }

//             //using the mongoose DB schema, connect to the database and create the new user
//             User.create({
//                 firstName,
//                 lastName,
//                 username,
//                 password: hash,
//             }, (err, item) => {

//                 //if creating a new user in the DB returns an error..
//                 if (err) {
//                     //display it
//                     return res.status(500).json({
//                         message: 'Internal Server Error'
//                     });
//                 }
//                 //if creating a new user in the DB is succefull
//                 if (item) {

//                     //display the new user
//                     console.log(`User \`${username}\` created.`);
//                     return res.json(item);
//                 }
//             });
//         });
//     });
// });

// // signing in a user
// app.post('/users/login', function(req, res) {

//     //take the username and the password from the ajax api call
//     const username = req.body.login - username;
//     const password = req.body.login - password;

//     //using the mongoose DB schema, connect to the database and the user with the same username as above
//     User.findOne({
//         username: username
//     }, function(err, items) {

//         //if the there is an error connecting to the DB
//         if (err) {

//             //display it
//             return res.status(500).json({
//                 message: "Internal server error"
//             });
//         }
//         // if there are no users with that username
//         if (!items) {
//             //display it
//             return res.status(401).json({
//                 message: "Not found!"
//             });
//         }
//         //if the username is found
//         else {

//             //try to validate the password
//             items.validatePassword(password, function(err, isValid) {

//                 //if the connection to the DB to validate the password is not working
//                 if (err) {

//                     //display error
//                     console.log('Could not connect to the DB to validate the password.');
//                 }

//                 //if the password is not valid
//                 if (!isValid) {

//                     //display error
//                     return res.status(401).json({
//                         message: "Password Invalid"
//                     });
//                 }
//                 //if the password is valid
//                 else {
//                     //return the logged in user
//                     console.log(`User \`${username}\` logged in.`);
//                     return res.json(items);
//                 }
//             });
//         };
//     });
// });


// -------------entry ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// creating a new Entry
app.post('/entry/create', (req, res) => {
    let entryType = req.body.entryType;
    let inputDate = req.body.inputDate;
    let inputPlay = req.body.inputPlay;
    let inputAuthor = req.body.inputAuthor;
    let inputRole = req.body.inputRole;
    let inputCo = req.body.inputCo;
    let inputLocation = req.body.inputLocation;
    let inputNotes = req.body.inputNotes;
    let loggedInUserName = req.body.loggedInUserName;

    Entry.create({
        entryType,
        inputDate,
        inputPlay,
        inputAuthor,
        inputRole,
        inputCo,
        inputLocation,
        inputNotes,
        loggedInUserName
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (item) {
            return res.json(item);
        }
    });
});

// PUT --------------------------------------
app.put('/entry/:id', function(req, res) {
    let toUpdate = {};
    //    let updateableFields = ['achieveWhat', 'achieveHow', 'achieveWhen', 'achieveWhy']; //<--Marius? 'entryType
    let updateableFields = ['entryType', 'inputDate', 'inputPlay', 'inputAuthor', 'inputRole', 'inputCo', 'inputLocation', 'inputNotes', 'loggedInUserName'];
    updateableFields.forEach(function(field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    //    console.log(toUpdate);
    Entry
        .findByIdAndUpdate(req.params.id, {
            $set: toUpdate
        }).exec().then(function(achievement) {
            return res.status(204).end();
        }).catch(function(err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// GET ------------------------------------
// accessing all of a user's entries
app.get('/entry-date/:user', function(req, res) {

    Entry
        .find()
        .sort('inputDate')
        .then(function(entries) {
            let entriesOutput = [];
            entries.map(function(entry) {
                if (entry.loggedInUserName == req.params.user) {
                    entriesOutput.push(entry);
                }
            });
            res.json({
                entriesOutput
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});
app.get('/entry-read/:user', function(req, res) {

    Entry
        .find({
            "entryType": "read"
        })
        .sort('inputDate')
        .then(function(entries) {
            let entriesOutput = [];
            entries.map(function(entry) {
                if (entry.loggedInUserName == req.params.user) {
                    entriesOutput.push(entry);
                }
            });
            res.json({
                entriesOutput
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});
app.get('/entry-seen/:user', function(req, res) {

    Entry
        .find({
            "entryType": "seen"
        })
        .sort('inputDate')
        .then(function(entries) {
            let entriesOutput = [];
            entries.map(function(entry) {
                if (entry.loggedInUserName == req.params.user) {
                    entriesOutput.push(entry);
                }
            });
            res.json({
                entriesOutput
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});
app.get('/entry-performed/:user', function(req, res) {

    Entry
        .find({
            "entryType": "performed"
        })
        .sort('inputDate')
        .then(function(entries) {
            let entriesOutput = [];
            entries.map(function(entry) {
                if (entry.loggedInUserName == req.params.user) {
                    entriesOutput.push(entry);
                }
            });
            res.json({
                entriesOutput
            });
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

// accessing a single achievement by id
app.get('/entry/:id', function(req, res) {
    Entry
        .findById(req.params.id).exec().then(function(entry) {
            return res.json(entry);
        })
        .catch(function(entries) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// DELETE ----------------------------------------
// deleting an achievement by id
app.delete('/entry/:id', function(req, res) {
    Entry.findByIdAndRemove(req.params.id).exec().then(function(entry) {
        return res.status(204).end();
    }).catch(function(err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

module.exports = { app, runServer, closeServer };