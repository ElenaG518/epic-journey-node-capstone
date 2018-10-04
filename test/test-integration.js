'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { Journey } = require('../journeys/models');
const { User } = require('../users/models');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
// const { app } = require('../server');
// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

chai.use(chaiHttp);


// GENERATE AND SEED DATA FOR USERS
function seedUserData() {
    console.info('seeding user data');
    const seedData = [];
    for (let i = 1; i <= 5; i++) {
        seedData.push(generateUserData());
    }
    // this will return a promise
    return User.insertMany(seedData);
}

function generateUserData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.lorem.word(),
        password: faker.random.alphaNumeric()
    };
}

function generateImages(journeyId, imgaddress) {
    return {
        journeyId: journeyId,
        imgAddress: imgaddress

    }
}

// GENERATE AND SEED DATA FOR JOURNEYS 
function seedJourneyData() {
    console.info('seeding journey data');
    const seedData = [];
    for (let i = 1; i <= 5; i++) {
        seedData.push(generateJourneyData());
    }
    // this will return a promise
    return Journey.insertMany(seedData);
}

function generateJourneyData() {
    return {
        title: faker.lorem.sentence(),
        location: faker.address.country(),
        startDates: faker.date.past(),
        endDates: faker.date.recent(),
        description: faker.lorem.paragraph(),
        created: faker.date.past(),
        loggedInUserName: "elenaG",
        images: "../images/pic2.jpg"
    };
}



// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('GET endpoint', function() {

    it('should return a 200 status code and HTML', function() {
        // strategy:
        //    1. prove res has right status, data type
        //    3. prove the res is an html file
        //
        // need to have access to mutate and access `res` across
        // `.then()` calls below, so declare it here so can modify in place

        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type');
                expect(res.header['content-type']).to.be.equal('text/html; charset=UTF-8');
            });

    });
});

describe('User router API resource', function() {

    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedJourneyData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedUserData();
    });

    // afterEach(function() {
    //     return tearDownDb();
    // });

    after(function() {
        return closeServer();
    });

    // note the use of nested `describe` blocks.
    // this allows us to make clearer, more discrete tests that focus
    // on proving something small
    describe('GET endpoint for users', function() {

        it('should return all existing users', function() {
            // strategy:
            //    1. get back all users returned by by GET request to `/users`
            //    2. prove res has right status, data type
            //    3. prove the number of users we got back is equal to number
            //       in db.
            //
            // need to have access to mutate and access `res` across
            // `.then()` calls below, so declare it here so can modify in place
            let res;
            return chai.request(app)
                .get('/users')
                .then(function(_res) {
                    // so subsequent .then blocks can access response object
                    res = _res;
                    expect(res).to.have.status(200);
                    // otherwise our db seeding didn't work
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return User.count();
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                });
        });
    });

    describe('POST endpoint for user', function() {
        // strategy: make a POST request with data,
        // then prove that the user we get back has
        // right keys, and that `id` is there (which means
        // the data was inserted into db)
        it('should create a new user', function() {

            const newUser = {
                firstName: "Afirstname",
                lastName: "Alastname",
                username: "somethingfunny",
                password: "1234abcd"
            };
            console.log(newUser);
            return chai.request(app)
                .post('/users/create')
                .send(newUser)
                .then(function(res) {
                    console.log(res.body);
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'id', 'username', 'firstName', 'lastName');
                    // cause Mongo should have created id on insertion
                    expect(res.body.id).to.not.be.null;
                    console.log(res.body.id);
                    expect(res.body.username).to.equal(newUser.username);
                    expect(res.body.firstName).to.equal(newUser.firstName);
                    expect(res.body.lastName).to.equal(newUser.lastName);

                    return User.findById(res.body.id);
                })
                .then(function(user) {
                    expect(user.username).to.equal(newUser.username);
                    expect(user.firstName).to.equal(newUser.firstName);
                    expect(user.lastName).to.equal(newUser.lastName);

                });
        });
    });


});

describe('Journey router API resource', function() {

    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedJourneyData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedJourneyData();
    });

    // afterEach(function() {
    //     return tearDownDb();
    // });

    after(function() {
        return closeServer();
    });

    // note the use of nested `describe` blocks.
    // this allows us to make clearer, more discrete tests that focus
    // on proving something small
    describe('GET endpoint', function() {

        it('should return all existing journeys for user', function() {
            // strategy:
            //    1. get back all journeys returned by by GET request to `/journeys`
            //    2. prove res has right status, data type
            //    3. prove the number of journeys we got back is equal to number
            //       in db.
            //
            // need to have access to mutate and access `res` across
            // `.then()` calls below, so declare it here so can modify in place
            let res;
            return chai.request(app)
                .get('/journeys/elenaG')
                .then(function(_res) {
                    // so subsequent .then blocks can access response object
                    res = _res;
                    expect(res).to.have.status(200);
                    // otherwise our db seeding didn't work
                    expect(res.body.journeys).to.have.lengthOf.at.least(1);
                    return Journey.count();
                })
                .then(function(count) {
                    expect(res.body.journeys).to.have.lengthOf(count);
                });
        });

        it('should return journey with specific id', function() {

            return Journey
                .findOne()
                .then(function(journey) {
                    return chai.request(app)
                        .get(`/journeys/id/${journey.id}`)
                        .then(function(res) {
                            // expect(res).to.be.json;
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.include.keys(
                                'id', 'title', 'location', 'dates', 'description', 'created', 'loggedInUserName');
                            expect(res.body.id).to.equal(journey.id);
                            expect(res.body.title).to.equal(journey.title);
                            expect(res.body.location).to.equal(journey.location);
                            expect(res.body.dates).to.equal(journey.dates);
                            expect(res.body.description).to.equal(journey.description);
                            expect(res.body.loggedInUserName).to.equal(journey.loggedInUserName);

                        })
                });
        });


        it('should return images for a specific journey', function() {

            let journey;
            return Journey
                .findOne()
                .then(function(journey) {
                    chai.request(app)
                        .get(`journeys/images/${journey._id}`)

                    .then(function(res) {
                            expect(res).to.be.json;
                            expect(res.body).to.include.keys(
                                'journeyId', 'imgAddress');
                            expect(res.body.journeyId).to.equal(journey.journeyId);
                            expect(res.body.imgAddress).to.equal(journey.imgAddress);
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ message: 'couldnot retrieve images' });
                        });
                })
        });


        it('should return journeys with right fields', function() {
            // Strategy: Get back all journeys, and ensure they have expected keys

            let resJourney;
            return chai.request(app)
                .get('/journeys/elenaG')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.journeys).to.be.a('array');
                    expect(res.body.journeys).to.have.lengthOf.at.least(1);

                    res.body.journeys.forEach(function(journey) {
                        expect(journey).to.be.a('object');
                        expect(journey).to.include.keys(
                            'id', 'title', 'location', 'dates', 'description', 'created', 'loggedInUserName');
                    });
                    resJourney = res.body.journeys[0];
                    return Journey.findById(resJourney.id);
                })
                .then(function(journey) {
                    expect(resJourney.id).to.equal(journey.id);
                    expect(resJourney.title).to.equal(journey.title);
                    expect(resJourney.location).to.equal(journey.location);
                    expect(resJourney.dates).to.equal(journey.dates);
                    expect(resJourney.description).to.equal(journey.description);
                    expect(resJourney.loggedInUserName).to.equal(journey.loggedInUserName);

                });
        });



        describe('POST endpoint', function() {
            // strategy: make a POST request with data,
            // then prove that the journey we get back has
            // right keys, and that `id` is there (which means
            // the data was inserted into db)
            it('should add a new journey', function() {

                const newJourney = generateJourneyData();
                let mostRecentGrade;

                return chai.request(app)
                    .post('/journeys/create')
                    .send(newJourney)
                    .then(function(res) {

                        console.log("hey", res.body.id);
                        generateImages(res.body.id, res.body.imgAddress);
                        expect(res).to.have.status(201);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.include.keys(
                            'id', 'title', 'location', 'dates', 'description', 'created', 'loggedInUserName');
                        // cause Mongo should have created id on insertion
                        expect(res.body.id).to.not.be.null;
                        expect(res.body.title).to.equal(newJourney.title);
                        expect(res.body.location).to.equal(newJourney.location);

                        let dateString = `${newJourney.startDates} - ${newJourney.endDates}`.trim();
                        // expect(res.body.dates).to.equal(dateString);
                        expect(res.body.description).to.equal(newJourney.description);
                        expect(res.body.loggedInUserName).to.equal(newJourney.loggedInUserName);

                        return Journey.findById(res.body.id);
                    })
                    .then(function(journey) {
                        expect(journey.title).to.equal(newJourney.title);
                        expect(journey.location).to.equal(newJourney.location);
                        let dateString = `${newJourney.startDates} - ${newJourney.endDates}`.trim();
                        // expect(journey.dates).to.equal(dateString);
                        expect(journey.description).to.equal(newJourney.description);
                        expect(journey.loggedInUserName).to.equal(newJourney.loggedInUserName);
                    });
            });
        });

        describe('PUT endpoint', function() {

            // strategy:
            //  1. Get an existing journey from db
            //  2. Make a PUT request to update that journey
            //  3. Prove journey returned by request contains data we sent
            //  4. Prove journey in db is correctly updated
            it('should update fields you send over', function() {
                const updateData = {
                    title: 'fofofofofofofof',
                    location: 'futuristic fusion'
                };

                return Journey
                    .findOne()
                    .then(function(journey) {
                        updateData.id = journey.id;

                        // make request then inspect it to make sure it reflects
                        // data we sent
                        return chai.request(app)
                            .put(`/journeys/update/${journey.id}`)
                            .send(updateData);
                    })
                    .then(function(res) {
                        expect(res).to.have.status(204);

                        return Journey.findById(updateData.id);
                    })
                    .then(function(journey) {
                        expect(journey.title).to.equal(updateData.title);
                        expect(journey.location).to.equal(updateData.location);
                    });
            });
        });

        describe('DELETE endpoint', function() {
            // strategy:
            //  1. get a journey
            //  2. make a DELETE request for that journey's id
            //  3. assert that response has right status code
            //  4. prove that journey with the id doesn't exist in db anymore
            it('should delete a journey by id', function() {

                let journey;

                return Journey
                    .findOne()
                    .then(function(_journey) {
                        journey = _journey;
                        return chai.request(app).delete(`/journeys/${journey.id}`);
                    })
                    .then(function(res) {
                        expect(res).to.have.status(204);
                        return Journey.findById(journey.id);
                    })
                    .then(function(_journey) {
                        expect(_journey).to.be.null;
                    });
            });
        });
    });
});