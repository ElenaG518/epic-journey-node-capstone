'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const mongoose = require('mongoose');

const { Journey, Image } = require('../journeys/models');

const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

chai.use(chaiHttp);

const username = 'exampleUser';
const firstName = 'Example';
const lastName = 'User';
const password = 'pass123';

function createUser() {
    return {
        username,
        firstName,
        lastName,
        password
    }
}

// GENERATE AND SEED DATA FOR JOURNEYS 
function seedJourneyData() {
    console.info('seeding journey data');
    const seedData = [];
    for (let i = 1; i <= 5; i++) {
        seedData.push(generateJourneyData());
    }

    return Journey.insertMany(seedData);
}

function generateJourneyData() {
    return {
        title: faker.lorem.sentence(),
        location: faker.address.country(),
        startDates: faker.date.past(),
        endDates: faker.date.recent(),
        description: faker.lorem.paragraph(),
        loggedInUserName: 'exampleUser',
        album: faker.image.imageUrl()
    };
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('/api/journeys', function () {

    before(function () {
      return runServer(TEST_DATABASE_URL);
    });
    
    after(function () {
      return closeServer();
    });
    
    beforeEach(function() {
      return seedJourneyData();
    });

    beforeEach(function() {
      return createUser();
    });

    afterEach(function() {
      return tearDownDb();
    });

    describe('GET for Journeys', function () {
        it('Should give access to journeys', function () {
            const token = jwt.sign(
                {
                  user: {
                    username,
                    firstName,
                    lastName
                  }
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
              );  

          return chai
            .request(app)
            .get('/api/journeys')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200);
                console.log(res.body)
                expect(res.body).to.be.an('object');
                expect(res.body.journeys).to.be.an('array');
                expect(res.body.journeys[0]).to.be.an('object');
                expect(res.body.journeys[0]).to.have.keys('id', 'title', 'location','loggedInUserName', 'dates', 'description', 'created', 'album');
            })    
        });
    });

    describe ('GET for journey with specific id', function() {
        it('should get journey with id', function() {

            const token = jwt.sign(
                {
                  user: {
                    username,
                    firstName,
                    lastName
                  }
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
            );

            let _jour;
            
            return Journey
                .findOne()
                .then(function(journey) {
                    _jour = journey;
                    console.log("put res ", journey)
                    return journey;
                })
                .then(function(journey) {
                    return chai.request(app)
                    .get(`/api/journeys/id/${journey._id}`)
                    .set('authorization', `Bearer ${token}`)
                    .then(function(res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys('id', 'title', 'location','loggedInUserName', 'dates', 'description', 'created', 'album');
                        expect(res.body.title).to.equal(_jour.title);
                        expect(res.body.location).to.equal(_jour.location);
                        expect(res.body.description).to.equal(_jour.description);
                    })
                })    
        })      
    })
    

    describe ('POST for journeys', function() {
        it('should create a new journey', function() {
            const token = jwt.sign(
                {
                  user: {
                    username,
                    firstName,
                    lastName
                  }
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
              );  
            
            const journeyData = generateJourneyData();

            return chai
            .request(app)
            .post('/api/journeys')
            .send(journeyData)
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.keys('id', 'title', 'location','loggedInUserName', 'dates', 'description', 'created', 'album');
            })
        })
    });

    describe ('PUT for journeys', function() {
        it('should update a journey', function() {

            const token = jwt.sign(
                {
                  user: {
                    username,
                    firstName,
                    lastName
                  }
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
            );
            
            return Journey
                .findOne()
                .then(function(res) {
                    console.log("put res ", res)
                    const updateItem = {
                        id: res._id,
                        title: 'new Title',
                        description: 'new Description',
                        location: 'new location'
                    };
                    return updateItem;
                })
                .then(function(updateItem) {
                    console.log("updateItem ", updateItem);
                    return chai.request(app)
                    .put(`/api/journeys/${updateItem.id}`)
                    .set('authorization', `Bearer ${token}`)
                    .send(updateItem)
                    .then(function(res) {
                        expect(res).to.have.status(204);
                    })
                })    
        })      
    })
    
    describe ('DELETE for journeys', function() {
        it('should delete a journey', function() {

            return Journey
                .findOne()
                .then(function(item) {
                    console.log("delete res ", item)
                    return item;
                })
                .then(function(item) {
                    return chai.request(app)
                    .delete(`/api/journeys/${item._id}`)
                    .then(function(res) {
                        expect(res).to.have.status(204);
                    })
                })    
        })      
    })    